const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { parseTime, formatDuration } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('كتم عضو')
    .addUserOption((o) => o.setName('user').setDescription('العضو').setRequired(true))
    .addStringOption((o) => o.setName('duration').setDescription('المدة (مثال: 10m, 1h)').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('السبب'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const durationStr = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'بدون سبب';
    const ms = parseTime(durationStr);
    if (!ms) return interaction.reply({ embeds: [errorEmbed('صيغة المدة غير صحيحة! (10m, 1h, 1d)')] });

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ embeds: [errorEmbed('العضو غير موجود!')] });
    await member.timeout(ms, reason);
    await interaction.reply({ embeds: [successEmbed(`🔇 تم كتم **${user.tag}** لمدة **${formatDuration(ms)}**`)] });
  },
};
