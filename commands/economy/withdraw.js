const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatNumber } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('سحب من البنك')
    .addIntegerOption((o) => o.setName('amount').setDescription('المبلغ').setRequired(true).setMinValue(1)),
  async execute(interaction, client) {
    const amount = interaction.options.getInteger('amount');
    const user = client.db.getUser(interaction.user.id);
    if (user.bank < amount) return interaction.reply({ embeds: [errorEmbed('رصيد البنك غير كافٍ!')] });
    user.bank -= amount;
    user.balance += amount;
    client.db.setUser(interaction.user.id, user);
    await interaction.reply({ embeds: [successEmbed(`💵 سحبت **${formatNumber(amount)}** من البنك.`)] });
  },
};
