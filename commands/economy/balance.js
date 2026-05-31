const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { formatNumber } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('عرض رصيدك أو رصيد عضو')
    .addUserOption((o) => o.setName('user').setDescription('العضو').setRequired(false)),
  async execute(interaction, client) {
    const user = interaction.options.getUser('user') || interaction.user;
    const data = client.db.getUser(user.id);
    await interaction.reply({
      embeds: [infoEmbed(`💰 رصيد ${user.username}`, `💵 المحفظة: **${formatNumber(data.balance)}**\n🏦 البنك: **${formatNumber(data.bank)}**\n📊 المستوى: **${data.level}** | XP: **${data.xp}**`)],
    });
  },
};
