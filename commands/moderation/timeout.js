const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { parseTime, formatDuration } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('عزل مؤقت لعضو')
    .addUserOption((o) => o.setName('user').setDescription('العضo').setRequired(true))
    .addStringOption((o) => o.setName('duration').setDescription('المدة').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('السبب'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const ms = parseTime(interaction.options.getString('duration'));
    if (!ms) return interaction.reply({ embeds: [errorEmbed('صيغة المدة غير صحيحة!')] });
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ embeds: [errorEmbed('العضو غير موجود!')] });
    await member.timeout(ms, interaction.options.getString('reason') || 'Timeout');
    await interaction.reply({ embeds: [successEmbed(`⏱️ تم عزل **${user.tag}** لمدة **${formatDuration(ms)}**`)] });
  },
};
