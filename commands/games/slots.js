const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatNumber, randomInt } = require('../../utils/helpers');

const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('ماكينة السلوت')
    .addIntegerOption((o) => o.setName('bet').setDescription('المبلغ').setRequired(true).setMinValue(10)),
  cooldown: 3,
  async execute(interaction, client) {
    const bet = interaction.options.getInteger('bet');
    const user = client.db.getUser(interaction.user.id);
    if (user.balance < bet) return interaction.reply({ embeds: [errorEmbed('رصيدك غير كافٍ!')] });

    const reels = [symbols[randomInt(0, 5)], symbols[randomInt(0, 5)], symbols[randomInt(0, 5)]];
    const display = reels.join(' | ');

    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      const multiplier = reels[0] === '💎' ? 10 : reels[0] === '7️⃣' ? 7 : 3;
      const win = bet * multiplier;
      user.balance += win;
      client.db.setUser(interaction.user.id, user);
      await interaction.reply({ embeds: [successEmbed(`🎰 ${display}\n🎉 جاكبوت! ربحت **${formatNumber(win)}**!`)] });
    } else if (reels[0] === reels[1] || reels[1] === reels[2]) {
      const win = Math.floor(bet * 1.5);
      user.balance += win - bet;
      client.db.setUser(interaction.user.id, user);
      await interaction.reply({ embeds: [successEmbed(`🎰 ${display}\n✨ ربحت **${formatNumber(win)}**!`)] });
    } else {
      user.balance -= bet;
      client.db.setUser(interaction.user.id, user);
      await interaction.reply({ embeds: [errorEmbed(`🎰 ${display}\n😢 خسرت **${formatNumber(bet)}**!`)] });
    }
  },
};
