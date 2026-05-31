const { SlashCommandBuilder } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('التحكم بصوت الأذكار')
    .addNumberOption((o) => o.setName('level').setDescription('0.0 - 1.0').setRequired(true).setMinValue(0).setMaxValue(1)),
  async execute(interaction, client) {
    const level = interaction.options.getNumber('level');
    client.voiceAzkar.setVolume(interaction.guild.id, level);
    await interaction.reply({ embeds: [successEmbed(`🔊 مستوى الصوت: **${Math.round(level * 100)}%**`)] });
  },
};
