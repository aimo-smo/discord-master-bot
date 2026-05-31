const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatNumber, cooldownRemaining, formatDuration, randomInt } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('محاولة سرقة لاعب آخر')
    .addUserOption((o) => o.setName('target').setDescription('الهدف').setRequired(true)),
  cooldown: 5,
  async execute(interaction, client) {
    const target = interaction.options.getUser('target');
    if (target.id === interaction.user.id) return interaction.reply({ embeds: [errorEmbed('لا يمكنك سرقة نفسك!')] });
    if (target.bot) return interaction.reply({ embeds: [errorEmbed('لا يمكن سرقة البوت!')] });

    const user = client.db.getUser(interaction.user.id);
    const victim = client.db.getUser(target.id);
    const remaining = cooldownRemaining(user.robLast, config.economy.robCooldown);
    if (remaining > 0) {
      return interaction.reply({ embeds: [errorEmbed(`⏳ انتظر **${formatDuration(remaining)}**.`)] });
    }
    if (victim.balance < 50) return interaction.reply({ embeds: [errorEmbed('الهدف لا يملك مالاً كافياً!')] });

    user.robLast = Date.now();
    const success = Math.random() < config.economy.robSuccessRate;
    if (success) {
      const stolen = randomInt(config.economy.robMin, Math.min(config.economy.robMax, victim.balance));
      user.balance += stolen;
      victim.balance -= stolen;
      client.db.setUser(interaction.user.id, user);
      client.db.setUser(target.id, victim);
      await interaction.reply({ embeds: [successEmbed(`🦹 نجحت! سرقت **${formatNumber(stolen)}** من ${target}!`)] });
    } else {
      const fine = randomInt(20, 80);
      user.balance = Math.max(0, user.balance - fine);
      client.db.setUser(interaction.user.id, user);
      await interaction.reply({ embeds: [errorEmbed(`🚔 فشلت! دفعت غرامة **${formatNumber(fine)}**.`)] });
    }
  },
};
