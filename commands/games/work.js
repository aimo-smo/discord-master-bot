const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatNumber, cooldownRemaining, formatDuration, randomInt } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder().setName('work').setDescription('العمل وكسب المال'),
  cooldown: 5,
  async execute(interaction, client) {
    const user = client.db.getUser(interaction.user.id);
    const remaining = cooldownRemaining(user.workLast, config.economy.workCooldown);
    if (remaining > 0) {
      return interaction.reply({ embeds: [errorEmbed(`⏳ انتظر **${formatDuration(remaining)}** قبل العمل مجدداً.`)] });
    }
    const jobs = ['مبرمج', 'طباخ', 'سائق', 'معلم', 'مهندس', 'تاجر', 'فنان'];
    const job = jobs[randomInt(0, jobs.length - 1)];
    const amount = randomInt(config.economy.workMin, config.economy.workMax);
    user.balance += amount;
    user.workLast = Date.now();
    client.db.setUser(interaction.user.id, user);
    await interaction.reply({ embeds: [successEmbed(`💼 عملت كـ **${job}** وربحت **${formatNumber(amount)}**!\nرصيدك: **${formatNumber(user.balance)}**`)] });
  },
};
