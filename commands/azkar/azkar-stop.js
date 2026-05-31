const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('azkar-stop')
    .setDescription('إيقاف الأذكار التلقائية')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    const guildData = client.db.getGuild(interaction.guild.id);
    guildData.azkar.enabled = false;
    client.db.setGuild(interaction.guild.id, guildData);
    client.azkarScheduler.stop(interaction.guild.id);
    await interaction.reply({ embeds: [successEmbed('⏹️ تم إيقاف الأذكار التلقائية.')] });
  },
};
