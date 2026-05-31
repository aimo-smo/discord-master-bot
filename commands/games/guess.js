const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { randomInt } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guess')
    .setDescription('لعبة تخمين الرقم (1-100)'),
  cooldown: 5,
  async execute(interaction, client) {
    const number = randomInt(1, 100);
    client.activeGames.set(`guess-${interaction.user.id}`, { number, attempts: 0, channelId: interaction.channelId });
    await interaction.reply({
      embeds: [successEmbed('🎯 **لعبة التخمين!**\nخمّن رقم بين **1** و **100**.\nاستخدم `/guess-number <رقم>` للتخمين.')],
    });
  },
};
