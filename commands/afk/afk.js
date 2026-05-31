const { SlashCommandBuilder } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('تفعيل وضع AFK')
    .addStringOption((o) => o.setName('message').setDescription('رسالتك')),
  async execute(interaction, client) {
    const message = interaction.options.getString('message') || config.afk.defaultMessage;
    client.db.setAfk(interaction.user.id, message);
    await interaction.reply({ embeds: [successEmbed(`💤 AFK: ${message}`)] });
  },
};
