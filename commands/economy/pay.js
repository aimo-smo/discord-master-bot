const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatNumber } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('تحويل مال لعضو')
    .addUserOption((o) => o.setName('user').setDescription('العضو').setRequired(true))
    .addIntegerOption((o) => o.setName('amount').setDescription('المبلغ').setRequired(true).setMinValue(1)),
  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    if (target.id === interaction.user.id) return interaction.reply({ embeds: [errorEmbed('لا يمكنك التحويل لنفسك!')] });

    const sender = client.db.getUser(interaction.user.id);
    if (sender.balance < amount) return interaction.reply({ embeds: [errorEmbed('رصيدك غير كافٍ!')] });

    const receiver = client.db.getUser(target.id);
    sender.balance -= amount;
    receiver.balance += amount;
    client.db.setUser(interaction.user.id, sender);
    client.db.setUser(target.id, receiver);
    await interaction.reply({ embeds: [successEmbed(`💸 حوّلت **${formatNumber(amount)}** إلى ${target}!`)] });
  },
};
