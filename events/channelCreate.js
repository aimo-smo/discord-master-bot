const { Events } = require('discord.js');
const { getLogChannel } = require('../utils/guildSettings');
const { baseEmbed } = require('../utils/embeds');

module.exports = {
  name: Events.ChannelCreate,
  async execute(channel, client) {
    if (!channel.guild) return;
    const channelId = getLogChannel(client, channel.guild.id, 'channelCreate');
    const log = channelId ? channel.guild.channels.cache.get(channelId) : null;
    if (!log) return;
    log.send({ embeds: [baseEmbed('➕ قناة جديدة', `**${channel.name}**`)] }).catch(() => {});
  },
};
