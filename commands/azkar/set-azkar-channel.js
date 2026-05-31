const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-azkar-channel')
    .setDescription('تحديد قناة الأذكار النصية')
    .addChannelOption((o) => o.setName('channel').setDescription('القناة').setRequired(true).addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel');
    const guildData = client.db.getGuild(interaction.guild.id);
    guildData.azkar.channelId = channel.id;
    client.db.setGuild(interaction.guild.id, guildData);
    await interaction.reply({ embeds: [successEmbed(`📿 قناة الأذكار: ${channel}`)] });
  },
};
