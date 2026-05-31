const { EmbedBuilder } = require('discord.js');
const config = require('../config');

function baseEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(config.colors.primary)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

function successEmbed(description) {
  return baseEmbed('✅ نجاح', description).setColor(config.colors.success);
}

function errorEmbed(description) {
  return baseEmbed('❌ خطأ', description).setColor(config.colors.error);
}

function warningEmbed(description) {
  return baseEmbed('⚠️ تحذير', description).setColor(config.colors.warning);
}

function infoEmbed(title, description) {
  return baseEmbed(title, description);
}

module.exports = { baseEmbed, successEmbed, errorEmbed, warningEmbed, infoEmbed };
