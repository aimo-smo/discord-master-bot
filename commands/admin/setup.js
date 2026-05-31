const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { getSetupStatus } = require('../../utils/guildSettings');

const labels = {
  token: '🔑 توكن البوت (.env)',
  welcomeChannel: '👋 قناة الترحيب',
  leaveChannel: '🚪 قناة المغادرة',
  autoRole: '🎭 الرتبة التلقائية',
  logsChannel: '📊 قناة السجلات',
  ticketCategory: '🎫 كاتيجوري التذاكر',
  ticketSupportRole: '🛠️ رتبة الدعم',
  ticketLog: '📋 سجل التذاكر',
  azkarChannel: '📿 قناة الأذكار',
  voiceAzkarChannel: '🎙️ روم الأذكار الصوتي',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('عرض حالة إعداد البوت وما ينقص')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const status = getSetupStatus(client, interaction.guild.id);
    const lines = Object.entries(labels).map(([key, label]) => {
      const ok = status[key];
      return `${ok ? '✅' : '❌'} ${label}`;
    });

    const missing = Object.entries(status).filter(([, v]) => !v).map(([k]) => labels[k]);
    const tips = [];
    if (!status.token) tips.push('• أنشئ ملف `.env` من `.env.example` وضع `DISCORD_TOKEN` و `CLIENT_ID` و `GUILD_ID`');
    if (!status.welcomeChannel) tips.push('• `/setup-welcome welcome:#القناة`');
    if (!status.logsChannel) tips.push('• `/setup-logs channel:#القناة`');
    if (!status.ticketCategory) tips.push('• `/ticket-setup channel:#لوحة category:#كاتيجوري`');
    if (!status.azkarChannel) tips.push('• `/set-azkar-channel` ثم `/azkar-start`');

    const desc = `${lines.join('\n')}\n\n**خطوات سريعة:**\n${tips.join('\n') || '✨ كل شيء جاهز!'}`;
    await interaction.reply({ embeds: [infoEmbed('⚙️ حالة الإعداد', desc)], ephemeral: true });
  },
};
