const { Events } = require('discord.js');
const { getLogChannel } = require('../utils/guildSettings');
const { baseEmbed } = require('../utils/embeds');

module.exports = {
  name: Events.ChannelDelete,
  async execute(channel, client) {
    if (!channel.guild) return;
    const channelId = getLogChannel(client, channel.guild.id, 'channelDelete');
    const log = channelId ? channel.guild.channels.cache.get(channelId) : null;
    if (!log) return;
    log.send({ embeds: [baseEmbed('➖ قناة محذوفة', `**${channel.name}**`)] }).catch(() => {});
  },
};
