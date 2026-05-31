const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-azkar-role')
    .setDescription('تحديد رتبة منشن الأذكار')
    .addRoleOption((o) => o.setName('role').setDescription('الرتبة').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    const role = interaction.options.getRole('role');
    const guildData = client.db.getGuild(interaction.guild.id);
    guildData.azkar.roleId = role.id;
    guildData.azkar.mentionRole = true;
    client.db.setGuild(interaction.guild.id, guildData);
    await interaction.reply({ embeds: [successEmbed(`📿 رتبة الأذكار: ${role}`)] });
  },
};
