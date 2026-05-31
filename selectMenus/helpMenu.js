const { infoEmbed } = require('../utils/embeds');

module.exports = {
  customId: 'help_menu',
  async execute(interaction, client) {
    const category = interaction.values[0];
    const cmds = [...client.commands.values()].filter((c) => c.category === category);
    const names = {
      games: '🎮 ألعاب',
      economy: '💰 اقتصاد',
      moderation: '🛡️ إدارة',
      tickets: '🎫 تذاكر',
      azkar: '📿 أذكار',
      'voice-azkar': '🎙️ أذكار صوتية',
      music: '🎵 موسيقى',
      shop: '🛒 متجر',
      utility: '🔧 عام',
      admin: '⚙️ إعدادات',
    };
    const list = cmds.map((c) => `\`/${c.data.name}\` — ${c.data.description}`).join('\n') || 'لا توجد أوامر';
    await interaction.reply({ embeds: [infoEmbed(names[category] || category, list)], ephemeral: true });
  },
};
