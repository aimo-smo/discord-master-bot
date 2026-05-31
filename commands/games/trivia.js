const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { shuffle } = require('../../utils/helpers');

const questions = [
  { q: 'ما هي عاصمة السعودية؟', a: ['الرياض', 'riyadh'] },
  { q: 'كم عدد أركان الإسلام؟', a: ['5', 'خمسة', 'خمس'] },
  { q: 'ما أطول نهر في العالم؟', a: ['النيل', 'nile'] },
  { q: 'في أي سنة هجرية بدأ التاريخ الهجري؟', a: ['622', '622م'] },
  { q: 'ما لغة البرمجة الأكثر استخداماً؟', a: ['javascript', 'جافاسكريبت', 'js'] },
  { q: 'كم planet في المجموعة الشمسية؟', a: ['8', 'ثمانية', 'ثمان'] },
  { q: 'ما اسم أطول سورة في القرآن؟', a: ['البقرة', 'al-baqarah'] },
  { q: 'ما هو H2O؟', a: ['ماء', 'water', 'الماء'] },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('لعبة أسئلة وأجوبة'),
  cooldown: 5,
  async execute(interaction, client) {
    const q = questions[Math.floor(Math.random() * questions.length)];
    client.activeGames.set(`trivia-${interaction.user.id}`, { ...q, channelId: interaction.channelId });
    await interaction.reply({ embeds: [successEmbed(`❓ **${q.q}**\n\nاستخدم \`/trivia-answer\` للإجابة.`)] });
  },
};
