module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    const VoiceAzkarManager = require('../utils/voiceAzkar');
    const AzkarScheduler = require('../utils/azkarScheduler');

    client.voiceAzkar = new VoiceAzkarManager(client);
    client.azkarScheduler = new AzkarScheduler(client);
    client.azkarScheduler.startAll();

    console.log(`✅ ${client.user.tag} متصل ويعمل!`);
    console.log(`📊 ${client.guilds.cache.size} سيرفر | ${client.commands.size} أمر`);
    client.user.setActivity('🎮 /help | بوت متكامل', { type: 3 });
  },
};
