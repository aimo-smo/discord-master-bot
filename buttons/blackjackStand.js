const { displayHand, handValue } = require('../commands/games/blackjack');
const { formatNumber } = require('../utils/helpers');

function dealerPlay(game) {
  while (handValue(game.dealer) < 17) game.dealer.push(game.deck.pop());
}

module.exports = {
  customId: 'bj_stand',
  async execute(interaction, client) {
    const game = client.activeGames.get(interaction.user.id);
    if (!game) return interaction.reply({ content: '❌ لا توجد لعبة!', ephemeral: true });

    dealerPlay(game);
    const pVal = handValue(game.player);
    const dVal = handValue(game.dealer);
    client.activeGames.delete(interaction.user.id);

    const user = client.db.getUser(interaction.user.id);
    let result;
    if (dVal > 21 || pVal > dVal) {
      user.balance += game.bet;
      result = `🎉 فزت! +**${formatNumber(game.bet)}**`;
    } else if (pVal === dVal) {
      result = '🤝 تعادل!';
    } else {
      user.balance -= game.bet;
      result = `😢 خسرت **${formatNumber(game.bet)}**`;
    }
    client.db.setUser(interaction.user.id, user);
    await interaction.update({
      content: `${result}\n👤 ${displayHand(game.player)} (${pVal})\n🤖 ${displayHand(game.dealer)} (${dVal})`,
      components: [],
    });
  },
};
