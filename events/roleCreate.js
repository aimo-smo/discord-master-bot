const { Events } = require('discord.js');
const { getLogChannel } = require('../utils/guildSettings');
const { baseEmbed } = require('../utils/embeds');

module.exports = {
  name: Events.GuildRoleCreate,
  async execute(role, client) {
    const channelId = getLogChannel(client, role.guild.id, 'roleCreate');
    const log = channelId ? role.guild.channels.cache.get(channelId) : null;
    if (!log) return;
    log.send({ embeds: [baseEmbed('➕ رتبة جديدة', `**${role.name}**`)] }).catch(() => {});
  },
};
