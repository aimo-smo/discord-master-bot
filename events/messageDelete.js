const { Events } = require('discord.js');
const { getLogChannel } = require('../utils/guildSettings');
const { baseEmbed } = require('../utils/embeds');

module.exports = {
  name: Events.MessageDelete,
  async execute(message, client) {
    if (!message.guild || message.author?.bot) return;
    const channelId = getLogChannel(client, message.guild.id, 'messageDelete');
    const channel = channelId ? message.guild.channels.cache.get(channelId) : null;
    if (!channel) return;

    const embed = baseEmbed('🗑️ رسالة محذوفة', `**الكاتب:** ${message.author}\n**القناة:** ${message.channel}\n\n${message.content || '*لا يوجد محتوى*'}`);
    channel.send({ embeds: [embed] }).catch(() => {});
  },
};
