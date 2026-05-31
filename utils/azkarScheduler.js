const { EmbedBuilder } = require('discord.js');
const config = require('../config');

class AzkarScheduler {
  constructor(client) {
    this.client = client;
    this.intervals = new Map();
  }

  getIntervalMs(type) {
    const map = { hourly: 3600000, '3hours': 10800000, daily: 86400000 };
    return map[type] || 3600000;
  }

  start(guildId) {
    this.stop(guildId);
    const guildData = this.client.db.getGuild(guildId);
    const settings = guildData.azkar;
    if (!settings?.enabled || !settings.channelId) return;

    const ms = this.getIntervalMs(settings.interval);
    const timer = setInterval(() => this.sendZikr(guildId), ms);
    this.intervals.set(guildId, timer);
  }

  stop(guildId) {
    const timer = this.intervals.get(guildId);
    if (timer) {
      clearInterval(timer);
      this.intervals.delete(guildId);
    }
  }

  async sendZikr(guildId) {
    const guild = this.client.guilds.cache.get(guildId);
    if (!guild) return;

    const guildData = this.client.db.getGuild(guildId);
    const settings = guildData.azkar;
    const channel = guild.channels.cache.get(settings.channelId);
    if (!channel) return;

    const azkarList = this.client.db.getAzkarList(guildId);
    if (azkarList.length === 0) return;

    const zikr = azkarList[Math.floor(Math.random() * azkarList.length)];
    const embed = new EmbedBuilder()
      .setColor(config.azkar.embedColor)
      .setTitle(config.azkar.embedHeader)
      .setDescription(zikr.text)
      .setFooter({ text: zikr.reference || 'سبحان الله' })
      .setTimestamp();

    if (zikr.image) embed.setImage(zikr.image);

    const content = settings.roleId && settings.mentionRole !== false
      ? `<@&${settings.roleId}>`
      : null;

    await channel.send({ content, embeds: [embed] });

    if (settings.playVoiceOnSend && guildData.voiceAzkar?.enabled) {
      this.client.voiceAzkar?.play(guildId);
    }
  }

  startAll() {
    for (const [guildId] of this.client.guilds.cache) {
      const data = this.client.db.getGuild(guildId);
      if (data.azkar?.enabled) this.start(guildId);
    }
  }
}

module.exports = AzkarScheduler;
