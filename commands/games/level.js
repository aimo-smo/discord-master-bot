const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('عرض مستوى XP')
    .addUserOption((o) => o.setName('user').setDescription('العضو').setRequired(false)),
  async execute(interaction, client) {
    const user = interaction.options.getUser('user') || interaction.user;
    const data = client.db.getUser(user.id);
    const needed = data.level * config.economy.levelMultiplier;
    const progress = Math.floor((data.xp / needed) * 100);
    const bar = '█'.repeat(Math.floor(progress / 10)) + '░'.repeat(10 - Math.floor(progress / 10));
    await interaction.reply({
      embeds: [infoEmbed(`📊 مستوى ${user.username}`, `المستوى: **${data.level}**\nXP: **${data.xp}** / **${needed}**\n${bar} ${progress}%`)],
    });
  },
};
