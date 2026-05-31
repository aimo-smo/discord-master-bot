const { Events } = require('discord.js');
const config = require('../config');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    if (!config.protection.antiRaid.enabled) return;
    const guildData = client.db.getGuild(member.guild.id);
    const now = Date.now();
    guildData.protection.raidJoins.push(now);
    guildData.protection.raidJoins = guildData.protection.raidJoins.filter(
      (t) => now - t < config.protection.antiRaid.interval
    );
    if (guildData.protection.raidJoins.length >= config.protection.antiRaid.maxJoins) {
      if (config.protection.antiRaid.action === 'lockdown') {
        for (const [, channel] of member.guild.channels.cache.filter((c) => c.isTextBased())) {
          await channel.permissionOverwrites.edit(member.guild.roles.everyone, { SendMessages: false }).catch(() => {});
        }
      }
      guildData.protection.raidJoins = [];
    }
    client.db.setGuild(member.guild.id, guildData);
  },
};
