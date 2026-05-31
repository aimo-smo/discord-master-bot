const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('حذف رسائل')
    .addIntegerOption((o) => o.setName('amount').setDescription('العدد (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    await interaction.deferReply({ ephemeral: true });
    const deleted = await interaction.channel.bulkDelete(amount, true).catch(() => null);
    if (!deleted) return interaction.editReply({ embeds: [errorEmbed('فشل حذف الرسائل!')] });
    await interaction.editReply({ embeds: [successEmbed(`🗑️ تم حذف **${deleted.size}** رسالة.`)] });
  },
};
