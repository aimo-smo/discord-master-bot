const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatNumber } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('إيداع في البنك')
    .addIntegerOption((o) => o.setName('amount').setDescription('المبلغ').setRequired(true).setMinValue(1)),
  async execute(interaction, client) {
    const amount = interaction.options.getInteger('amount');
    const user = client.db.getUser(interaction.user.id);
    if (user.balance < amount) return interaction.reply({ embeds: [errorEmbed('رصيدك غير كافٍ!')] });
    user.balance -= amount;
    user.bank += amount;
    client.db.setUser(interaction.user.id, user);
    await interaction.reply({ embeds: [successEmbed(`🏦 أودعت **${formatNumber(amount)}** في البنك.`)] });
  },
};
