const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('حظر عضو')
    .addUserOption((o) => o.setName('user').setDescription('العضو').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('السبب'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'بدون سبب';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ embeds: [errorEmbed('العضو غير موجود!')] });
    if (!member.bannable) return interaction.reply({ embeds: [errorEmbed('لا أستطيع حظر هذا العضو!')] });
    await member.ban({ reason });
    await interaction.reply({ embeds: [successEmbed(`🔨 تم حظر **${user.tag}**\nالسبب: ${reason}`)] });
  },
};
