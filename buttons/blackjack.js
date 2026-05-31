const { displayHand, handValue } = require('../commands/games/blackjack');
const { formatNumber } = require('../utils/helpers');

module.exports = {
  customId: 'bj_hit',
  async execute(interaction, client) {
    const game = client.activeGames.get(interaction.user.id);
    if (!game) return interaction.reply({ content: '❌ لا توجد لعبة نشطة!', ephemeral: true });

    game.player.push(game.deck.pop());
    const val = handValue(game.player);
    if (val > 21) {
      client.activeGames.delete(interaction.user.id);
      const user = client.db.getUser(interaction.user.id);
      user.balance -= game.bet;
      client.db.setUser(interaction.user.id, user);
      return interaction.update({ content: `💥 تجاوزت 21! خسرت **${formatNumber(game.bet)}**`, components: [] });
    }
    await interaction.update({
      content: `🃏 أنت: ${displayHand(game.player)} (${val})\n🤖 الموزع: ${game.dealer[0].rank}${game.dealer[0].suit} ?`,
    });
  },
};
