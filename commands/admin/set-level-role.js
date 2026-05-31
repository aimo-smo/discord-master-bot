const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-level-role')
    .setDescription('ربط رتبة بمستوى XP')
    .addIntegerOption((o) => o.setName('level').setDescription('المستوى').setRequired(true).setMinValue(1))
    .addRoleOption((o) => o.setName('role').setDescription('الرتبة').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const level = interaction.options.getInteger('level');
    const role = interaction.options.getRole('role');
    const guildData = client.db.getGuild(interaction.guild.id);
    if (!guildData.levelRoles) guildData.levelRoles = {};
    guildData.levelRoles[level] = role.id;
    client.db.setGuild(interaction.guild.id, guildData);
    await interaction.reply({ embeds: [successEmbed(`✅ المستوى **${level}** ← ${role}`)] });
  },
};
