const { SlashCommandBuilder } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-reciter')
    .setDescription('اختيار القارئ للأذكار الصوتية')
    .addStringOption((o) =>
      o.setName('reciter').setDescription('القارئ').setRequired(true).addChoices(
        { name: 'الافتراضي', value: 'default' }
      )
    ),
  async execute(interaction, client) {
    const reciter = interaction.options.getString('reciter');
    const guildData = client.db.getGuild(interaction.guild.id);
    guildData.voiceAzkar.reciter = reciter;
    client.db.setGuild(interaction.guild.id, guildData);
    await interaction.reply({ embeds: [successEmbed(`🎤 القارئ: **${reciter}**`)] });
  },
};
