const { Events } = require('discord.js');
const config = require('../config');

const xpCooldowns = new Map();

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (!message.guild || message.author.bot) return;

    // AFK check
    const afkData = client.db.getAfk(message.author.id);
    if (afkData) {
      client.db.removeAfk(message.author.id);
      await message.reply(`🔔 عدت! (${afkData.message})`).catch(() => {});
    }

    const mentions = message.mentions.users.filter((u) => client.db.getAfk(u.id));
    for (const [, user] of mentions) {
      const data = client.db.getAfk(user.id);
      await message.reply(`💤 **${user.username}** AFK: ${data.message}`).catch(() => {});
    }

    // XP system
    const key = `${message.guild.id}-${message.author.id}`;
    if (xpCooldowns.has(key) && Date.now() - xpCooldowns.get(key) < config.economy.xpCooldown) return;
    xpCooldowns.set(key, Date.now());

    const { user, leveledUp } = client.db.addXp(message.author.id, config.economy.xpPerMessage);
    if (leveledUp) {
      await message.channel.send(`🎉 مبروك ${message.author}! وصلت للمستوى **${user.level}**`).catch(() => {});
      const guildData = client.db.getGuild(message.guild.id);
      const levelRole = guildData.levelRoles?.[user.level];
      if (levelRole) {
        const role = message.guild.roles.cache.get(levelRole);
        if (role) await message.member.roles.add(role).catch(() => {});
      }
    }

    // Anti-spam
    if (!config.protection.antiSpam.enabled) return;
    const guildData = client.db.getGuild(message.guild.id);
    const userId = message.author.id;
    const now = Date.now();
    if (!guildData.protection.spamUsers[userId]) guildData.protection.spamUsers[userId] = [];
    guildData.protection.spamUsers[userId].push(now);
    guildData.protection.spamUsers[userId] = guildData.protection.spamUsers[userId].filter(
      (t) => now - t < config.protection.antiSpam.interval
    );

    if (guildData.protection.spamUsers[userId].length >= config.protection.antiSpam.maxMessages) {
      if (config.protection.antiSpam.action === 'mute') {
        await message.member.timeout(config.protection.antiSpam.muteDuration, 'Anti-spam').catch(() => {});
      }
      guildData.protection.spamUsers[userId] = [];
      client.db.setGuild(message.guild.id, guildData);
    }
  },
};
