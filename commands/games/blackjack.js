const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');
const { formatNumber } = require('../../utils/helpers');

function cardValue(card) {
  if (['J', 'Q', 'K'].includes(card.rank)) return 10;
  if (card.rank === 'A') return 11;
  return parseInt(card.rank);
}

function handValue(hand) {
  let total = hand.reduce((s, c) => s + cardValue(c), 0);
  let aces = hand.filter((c) => c.rank === 'A').length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

function newDeck() {
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const suits = ['♠', '♥', '♦', '♣'];
  const deck = [];
  for (const s of suits) for (const r of ranks) deck.push({ rank: r, suit: s });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function displayHand(hand) {
  return hand.map((c) => `${c.rank}${c.suit}`).join(' ');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('لعبة البلاك جاك')
    .addIntegerOption((o) => o.setName('bet').setDescription('المبلغ').setRequired(true).setMinValue(10)),
  cooldown: 5,
  async execute(interaction, client) {
    const bet = interaction.options.getInteger('bet');
    const user = client.db.getUser(interaction.user.id);
    if (user.balance < bet) return interaction.reply({ embeds: [errorEmbed('رصيدك غير كافٍ!')] });

    const deck = newDeck();
    const player = [deck.pop(), deck.pop()];
    const dealer = [deck.pop(), deck.pop()];

    client.activeGames.set(interaction.user.id, { deck, player, dealer, bet, channelId: interaction.channelId });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('bj_hit').setLabel('سحب').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('bj_stand').setLabel('وقف').setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      content: `🃏 **بلاك جاك** — رهان: **${formatNumber(bet)}**\n👤 أنت: ${displayHand(player)} (${handValue(player)})\n🤖 الموزع: ${dealer[0].rank}${dealer[0].suit} ?`,
      components: [row],
    });
  },
};

module.exports.cardValue = cardValue;
module.exports.handValue = handValue;
module.exports.displayHand = displayHand;
