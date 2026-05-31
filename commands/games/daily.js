const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatNumber, cooldownRemaining, formatDuration, randomInt } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder().setName('daily').setDescription('استلام الراتب اليومي'),
  cooldown: 5,
  async execute(interaction, client) {
    const user = client.db.getUser(interaction.user.id);
    const remaining = cooldownRemaining(user.dailyLast, 86400000);
    if (remaining > 0) {
      return interaction.reply({ embeds: [errorEmbed(`⏳ انتظر **${formatDuration(remaining)}** للراتب التالي.`)] });
    }
    const amount = config.economy.dailyAmount + randomInt(0, 50);
    user.balance += amount;
    user.dailyLast = Date.now();
    client.db.setUser(interaction.user.id, user);
    await interaction.reply({ embeds: [successEmbed(`💰 استلمت **${formatNumber(amount)}** عملة!\nرصيدك: **${formatNumber(user.balance)}**`)] });
  },
};
