const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, infoEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('تشغيل موسيقى (رابط YouTube)')
    .addStringOption((o) => o.setName('query').setDescription('رابط أو اسم الأغنية').setRequired(true)),
  async execute(interaction) {
    await interaction.reply({
      embeds: [infoEmbed('🎵 الموسيقى', '⚠️ أضف ملفات MP3 في `assets/music/` وفعّل `@discordjs/voice`.\n\nللتشغيل الكامل، ثبّت `play-dl` أو `@distube/ytdl-core`.\n\nاستخدم `/join-azkar` للأذكار الصوتية.')],
    });
  },
};
