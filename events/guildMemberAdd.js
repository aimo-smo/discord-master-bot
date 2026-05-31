const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { getWelcome, getLogChannel } = require('../utils/guildSettings');
const { generateWelcomeImage } = require('../utils/welcome');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    const welcome = getWelcome(client, member.guild.id);
    if (!welcome.enabled || !welcome.channelId) return;

    const channel = member.guild.channels.cache.get(welcome.channelId);
    if (!channel) return;

    if (welcome.autoRoleId) {
      const role = member.guild.roles.cache.get(welcome.autoRoleId);
      if (role) await member.roles.add(role).catch(() => {});
    }

    const embed = new EmbedBuilder()
      .setColor(welcome.embedColor)
      .setTitle('👋 مرحباً بك!')
      .setDescription(
        `${welcome.mentionMember ? member : member.user.username} انضم إلى **${member.guild.name}**!\n\nأنت العضو رقم **${member.guild.memberCount}**`
      )
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setTimestamp();

    const files = [];
    if (welcome.imageEnabled) {
      try {
        const buffer = await generateWelcomeImage(member);
        files.push(new AttachmentBuilder(buffer, { name: 'welcome.png' }));
        embed.setImage('attachment://welcome.png');
      } catch {}
    }

    await channel.send({ content: welcome.mentionMember ? `${member}` : null, embeds: [embed], files });

    const logChannelId = getLogChannel(client, member.guild.id, 'memberJoin');
    const logChannel = logChannelId ? member.guild.channels.cache.get(logChannelId) : null;
    if (logChannel) logChannel.send({ embeds: [embed] }).catch(() => {});
  },
};
