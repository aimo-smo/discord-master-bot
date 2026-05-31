const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatNumber, randomInt } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('الروليت')
    .addIntegerOption((o) => o.setName('bet').setDescription('المبلغ').setRequired(true).setMinValue(10))
    .addStringOption((o) =>
      o.setName('color').setDescription('اللون').setRequired(true).addChoices(
        { name: '🔴 أحمر', value: 'red' },
        { name: '⚫ أسود', value: 'black' },
        { name: '🟢 أخضر', value: 'green' }
      )
    ),
  cooldown: 3,
  async execute(interaction, client) {
    const bet = interaction.options.getInteger('bet');
    const color = interaction.options.getString('color');
    const user = client.db.getUser(interaction.user.id);
    if (user.balance < bet) return interaction.reply({ embeds: [errorEmbed('رصيدك غير كافٍ!')] });

    const roll = randomInt(0, 36);
    const isGreen = roll === 0;
    const isRed = !isGreen && roll % 2 === 0;
    const result = isGreen ? 'green' : isRed ? 'red' : 'black';
    const names = { red: '🔴 أحمر', black: '⚫ أسود', green: '🟢 أخضر' };

    if (result === color) {
      const multiplier = color === 'green' ? 14 : 2;
      const win = bet * multiplier;
      user.balance += win;
      client.db.setUser(interaction.user.id, user);
      await interaction.reply({ embeds: [successEmbed(`🎰 الرقم **${roll}** (${names[result]}) — ربحت **${formatNumber(win)}**!`)] });
    } else {
      user.balance -= bet;
      client.db.setUser(interaction.user.id, user);
      await interaction.reply({ embeds: [errorEmbed(`🎰 الرقم **${roll}** (${names[result]}) — خسرت **${formatNumber(bet)}**!`)] });
    }
  },
};
