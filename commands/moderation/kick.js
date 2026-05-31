const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('طرد عضو')
    .addUserOption((o) => o.setName('user').setDescription('العضو').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('السبب'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'بدون سبب';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ embeds: [errorEmbed('العضو غير موجود!')] });
    if (!member.kickable) return interaction.reply({ embeds: [errorEmbed('لا أستطيع طرد هذا العضو!')] });
    await member.kick(reason);
    await interaction.reply({ embeds: [successEmbed(`👢 تم طرد **${user.tag}**\nالسبب: ${reason}`)] });
  },
};
