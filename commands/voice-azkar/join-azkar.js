const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join-azkar')
    .setDescription('انضمام البوت للروم الصوتي للأذكار'),
  async execute(interaction, client) {
    const guildData = client.db.getGuild(interaction.guild.id);
    const channelId = guildData.voiceAzkar?.channelId;
    if (!channelId) return interaction.reply({ embeds: [errorEmbed('حدّد الروم بـ `/set-azkar-voice-channel`')] });
    await client.voiceAzkar.join(interaction.guild, channelId);
    await interaction.reply({ embeds: [successEmbed('🎙️ انضممت للروم الصوتي!')] });
  },
};
