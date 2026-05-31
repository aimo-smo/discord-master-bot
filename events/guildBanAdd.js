const { Events } = require('discord.js');
const { getLogChannel } = require('../utils/guildSettings');
const { baseEmbed } = require('../utils/embeds');

module.exports = {
  name: Events.GuildBanAdd,
  async execute(ban, client) {
    const channelId = getLogChannel(client, ban.guild.id, 'ban');
    const channel = channelId ? ban.guild.channels.cache.get(channelId) : null;
    if (!channel) return;
    const embed = baseEmbed('🔨 حظر', `**العضو:** ${ban.user.tag}\n**السبب:** ${ban.reason || 'غير محدد'}`);
    channel.send({ embeds: [embed] }).catch(() => {});
  },
};
