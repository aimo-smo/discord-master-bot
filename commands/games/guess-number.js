const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guess-number')
    .setDescription('تخمين الرقم في لعبة التخمين')
    .addIntegerOption((o) => o.setName('number').setDescription('رقمك').setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute(interaction, client) {
    const game = client.activeGames.get(`guess-${interaction.user.id}`);
    if (!game) return interaction.reply({ embeds: [errorEmbed('ابدأ لعبة بـ `/guess` أولاً!')] });

    const num = interaction.options.getInteger('number');
    game.attempts++;
    if (num === game.number) {
      client.activeGames.delete(`guess-${interaction.user.id}`);
      const user = client.db.getUser(interaction.user.id);
      user.balance += 100;
      client.db.setUser(interaction.user.id, user);
      return interaction.reply({ embeds: [successEmbed(`🎉 صحيح! الرقم **${game.number}** في **${game.attempts}** محاولات. +100 عملة!`)] });
    }
    const hint = num < game.number ? '⬆️ أعلى' : '⬇️ أقل';
    await interaction.reply({ embeds: [errorEmbed(`${hint} — المحاولة ${game.attempts}`)] });
  },
};
