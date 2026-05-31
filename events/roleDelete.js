const { Events } = require('discord.js');
const { getLogChannel } = require('../utils/guildSettings');
const { baseEmbed } = require('../utils/embeds');

module.exports = {
  name: Events.GuildRoleDelete,
  async execute(role, client) {
    const channelId = getLogChannel(client, role.guild.id, 'roleDelete');
    const log = channelId ? role.guild.channels.cache.get(channelId) : null;
    if (!log) return;
    log.send({ embeds: [baseEmbed('➖ رتبة محذوفة', `**${role.name}**`)] }).catch(() => {});
  },
};
