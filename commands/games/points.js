const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('points')
    .setDescription('عرض نقاطك أو نقاط عضو')
    .addUserOption((o) => o.setName('user').setDescription('العضو')),
  async execute(interaction, client) {
    const user = interaction.options.getUser('user') || interaction.user;
    const data = client.db.getUser(user.id);
    await interaction.reply({
      embeds: [infoEmbed(`⭐ نقاط ${user.username}`, `المستوى: **${data.level}**\nXP: **${data.xp}**\n💰 الرصيد: **${data.balance}**`)],
    });
  },
};
