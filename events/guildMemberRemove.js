const { Events, EmbedBuilder } = require('discord.js');
const { getWelcome, getLogChannel } = require('../utils/guildSettings');

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member, client) {
    const welcome = getWelcome(client, member.guild.id);
    const channelId = welcome.leaveChannelId || welcome.channelId;
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle('👋 وداعاً')
      .setDescription(`**${member.user.tag}** غادر السيرفر.\nالأعضاء الآن: **${member.guild.memberCount}**`)
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setTimestamp();

    await channel.send({ embeds: [embed] }).catch(() => {});

    const logChannelId = getLogChannel(client, member.guild.id, 'memberLeave');
    const logChannel = logChannelId ? member.guild.channels.cache.get(logChannelId) : null;
    if (logChannel) logChannel.send({ embeds: [embed] }).catch(() => {});
  },
};
