const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-autorole')
    .setDescription('تعيين الرتبة التلقائية للأعضاء الجدد')
    .addRoleOption((o) => o.setName('role').setDescription('الرتبة').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const role = interaction.options.getRole('role');
    const guildData = client.db.getGuild(interaction.guild.id);
    guildData.welcome = guildData.welcome || {};
    guildData.welcome.autoRoleId = role.id;
    client.db.setGuild(interaction.guild.id, guildData);
    await interaction.reply({ embeds: [successEmbed(`✅ الرتبة التلقائية: ${role}`)] });
  },
};
