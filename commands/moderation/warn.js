const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed, warningEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('تحذير عضو')
    .addUserOption((o) => o.setName('user').setDescription('العضو').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('السبب').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const count = client.db.addWarning(interaction.guild.id, user.id, reason, interaction.user.id);
    await interaction.reply({ embeds: [warningEmbed(`⚠️ تحذير **${user.tag}**\nالسبب: ${reason}\nإجمالي التحذيرات: **${count}**`)] });
  },
};
