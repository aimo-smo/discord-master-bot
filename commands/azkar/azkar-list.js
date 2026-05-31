const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('azkar-list')
    .setDescription('عرض قائمة الأذكار'),
  async execute(interaction, client) {
    const list = client.db.getAzkarList(interaction.guild.id);
    const custom = client.db.getGuild(interaction.guild.id).azkar?.custom || [];
    const customList = custom.map((z) => `\`${z.id}\` — ${z.text.substring(0, 50)}...`).join('\n') || 'لا توجد أذكار مخصصة';
    await interaction.reply({
      embeds: [infoEmbed('📿 قائمة الأذكار', `**الإجمالي:** ${list.length} ذكر\n\n**أذكار مخصصة:**\n${customList}`)],
      ephemeral: true,
    });
  },
};
