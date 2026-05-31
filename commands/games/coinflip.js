const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatNumber, randomInt } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('رمي العملة')
    .addIntegerOption((o) => o.setName('bet').setDescription('المبلغ').setRequired(true).setMinValue(10)),
  cooldown: 3,
  async execute(interaction, client) {
    const bet = interaction.options.getInteger('bet');
    const user = client.db.getUser(interaction.user.id);
    if (user.balance < bet) return interaction.reply({ embeds: [errorEmbed('رصيدك غير كافٍ!')] });

    const side = Math.random() < 0.5 ? 'وجه' : 'كتابة';
    const win = Math.random() < 0.5;
    if (win) {
      user.balance += bet;
      client.db.setUser(interaction.user.id, user);
      await interaction.reply({ embeds: [successEmbed(`🪙 **${side}** — ربحت **${formatNumber(bet)}**!`)] });
    } else {
      user.balance -= bet;
      client.db.setUser(interaction.user.id, user);
      await interaction.reply({ embeds: [errorEmbed(`🪙 خسرت **${formatNumber(bet)}**!`)] });
    }
  },
};
