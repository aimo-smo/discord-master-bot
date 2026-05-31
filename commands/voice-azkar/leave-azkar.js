const { SlashCommandBuilder } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('leave-azkar').setDescription('مغادرة الروم الصوتي'),
  async execute(interaction, client) {
    client.voiceAzkar.leave(interaction.guild.id);
    await interaction.reply({ embeds: [successEmbed('👋 غادرت الروم الصوتي.')] });
  },
};
