const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-zikr')
    .setDescription('حذف ذكر مخصص')
    .addStringOption((o) => o.setName('id').setDescription('معرف الذكر').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    const id = interaction.options.getString('id');
    const guildData = client.db.getGuild(interaction.guild.id);
    const exists = (guildData.azkar.custom || []).some((z) => z.id === id);
    if (!exists) return interaction.reply({ embeds: [errorEmbed('الذكر غير موجود!')] });
    client.db.removeZikr(interaction.guild.id, id);
    await interaction.reply({ embeds: [successEmbed('🗑️ تم حذف الذكر.')] });
  },
};
