const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  NoSubscriberBehavior,
} = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');

class VoiceAzkarManager {
  constructor(client) {
    this.client = client;
    this.connections = new Map();
    this.players = new Map();
    this.playlists = this.loadPlaylists();
  }

  loadPlaylists() {
    const playlistPath = path.join(__dirname, '..', 'database', 'voice-azkar.json');
    try {
      if (fs.existsSync(playlistPath)) return JSON.parse(fs.readFileSync(playlistPath, 'utf8'));
    } catch {}
    return {
      default: [],
      reciters: { default: 'القارئ الافتراضي' },
    };
  }

  getGuildState(guildId) {
    return this.client.db.getGuild(guildId).voiceAzkar || {};
  }

  async join(guild, channelId) {
    const channel = guild.channels.cache.get(channelId);
    if (!channel?.isVoiceBased()) throw new Error('قناة صوتية غير صالحة');

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: true,
    });

    const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
    connection.subscribe(player);

    this.connections.set(guild.id, connection);
    this.players.set(guild.id, player);

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      const settings = this.getGuildState(guild.id);
      if (settings.autoReconnect !== false) {
        try {
          await entersState(connection, VoiceConnectionStatus.Signalling, 5000);
        } catch {
          this.join(guild, channelId).catch(console.error);
        }
      }
    });

    player.on(AudioPlayerStatus.Idle, () => this.playNext(guild.id));
    player.on('error', (err) => console.error('[VoiceAzkar]', err.message));

    const guildData = this.client.db.getGuild(guild.id);
    guildData.voiceAzkar.channelId = channelId;
    guildData.voiceAzkar.enabled = true;
    this.client.db.setGuild(guild.id, guildData);

    return connection;
  }

  playNext(guildId) {
    const player = this.players.get(guildId);
    const settings = this.getGuildState(guildId);
    const reciter = settings.reciter || 'default';
    const tracks = this.playlists[reciter] || this.playlists.default || [];

    if (!player || tracks.length === 0) return;

    const track = tracks[Math.floor(Math.random() * tracks.length)];
    if (!fs.existsSync(track)) return;

    const resource = createAudioResource(track, { inlineVolume: true });
    if (resource.volume) resource.volume.setVolume(settings.volume ?? 0.5);
    player.play(resource);
  }

  async play(guildId) {
    this.playNext(guildId);
  }

  stop(guildId) {
    const player = this.players.get(guildId);
    if (player) player.stop(true);
  }

  setVolume(guildId, volume) {
    const guildData = this.client.db.getGuild(guildId);
    guildData.voiceAzkar.volume = Math.max(0, Math.min(1, volume));
    this.client.db.setGuild(guildId, guildData);
  }

  leave(guildId) {
    this.stop(guildId);
    const connection = this.connections.get(guildId);
    if (connection) {
      connection.destroy();
      this.connections.delete(guildId);
      this.players.delete(guildId);
    }
    const guildData = this.client.db.getGuild(guildId);
    guildData.voiceAzkar.enabled = false;
    this.client.db.setGuild(guildId, guildData);
  }
}

module.exports = VoiceAzkarManager;
