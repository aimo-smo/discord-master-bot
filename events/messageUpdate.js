const { Events } = require('discord.js');
const { getLogChannel } = require('../utils/guildSettings');
const { baseEmbed } = require('../utils/embeds');

module.exports = {
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage, client) {
    if (!newMessage.guild || newMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const channelId = getLogChannel(client, newMessage.guild.id, 'messageEdit');
    const channel = channelId ? newMessage.guild.channels.cache.get(channelId) : null;
    if (!channel) return;

    const embed = baseEmbed(
      '✏️ رسالة معدّلة',
      `**الكاتب:** ${newMessage.author}\n**القناة:** ${newMessage.channel}\n\n**قبل:** ${oldMessage.content || '*فارغ*'}\n**بعد:** ${newMessage.content || '*فارغ*'}`
    );
    channel.send({ embeds: [embed] }).catch(() => {});
  },
};
