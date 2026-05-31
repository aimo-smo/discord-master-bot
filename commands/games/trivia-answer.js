const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia-answer')
    .setDescription('الإجابة على سؤال التrivia')
    .addStringOption((o) => o.setName('answer').setDescription('إجابتك').setRequired(true)),
  async execute(interaction, client) {
    const game = client.activeGames.get(`trivia-${interaction.user.id}`);
    if (!game) return interaction.reply({ embeds: [errorEmbed('لا يوجد سؤال نشط! استخدم `/trivia`.')] });

    const answer = interaction.options.getString('answer').toLowerCase().trim();
    const correct = game.a.some((a) => a.toLowerCase() === answer);
    client.activeGames.delete(`trivia-${interaction.user.id}`);

    if (correct) {
      const user = client.db.getUser(interaction.user.id);
      user.balance += 75;
      client.db.setUser(interaction.user.id, user);
      return interaction.reply({ embeds: [successEmbed('✅ إجابة صحيحة! +75 عملة')] });
    }
    await interaction.reply({ embeds: [errorEmbed(`❌ خطأ! الإجابة: **${game.a[0]}**`)] });
  },
};
