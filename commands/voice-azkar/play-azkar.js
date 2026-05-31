const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('play-azkar').setDescription('تشغيل الأذكار الصوتية'),
  async execute(interaction, client) {
    if (!client.voiceAzkar.connections.has(interaction.guild.id)) {
      return interaction.reply({ embeds: [errorEmbed('البوت غير متصل! استخدم `/join-azkar`')] });
    }
    client.voiceAzkar.play(interaction.guild.id);
    await interaction.reply({ embeds: [successEmbed('▶️ جاري تشغيل الأذكار...')] });
  },
};
