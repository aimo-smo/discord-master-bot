const { SlashCommandBuilder } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('stop-azkar').setDescription('إيقاف الأذكار الصوتية'),
  async execute(interaction, client) {
    client.voiceAzkar.stop(interaction.guild.id);
    await interaction.reply({ embeds: [successEmbed('⏹️ تم إيقاف التشغيل.')] });
  },
};
