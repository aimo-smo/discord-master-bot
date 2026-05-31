const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('تفعيل الوضع البطيء')
    .addIntegerOption((o) => o.setName('seconds').setDescription('الثواني (0 للإيقاف)').setRequired(true).setMinValue(0).setMaxValue(21600))
    .addChannelOption((o) => o.setName('channel').setDescription('القناة').addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    await channel.setRateLimitPerUser(seconds);
    const msg = seconds === 0 ? `⏩ تم إيقاف الوضع البطيء في ${channel}` : `🐢 الوضع البطيء: **${seconds}** ثانية في ${channel}`;
    await interaction.reply({ embeds: [successEmbed(msg)] });
  },
};
