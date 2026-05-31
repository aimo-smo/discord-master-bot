const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('إنشاء استطلاع')
    .addStringOption((o) => o.setName('question').setDescription('السؤال').setRequired(true))
    .addStringOption((o) => o.setName('option1').setDescription('خيار 1').setRequired(true))
    .addStringOption((o) => o.setName('option2').setDescription('خيار 2').setRequired(true))
    .addStringOption((o) => o.setName('option3').setDescription('خيار 3'))
    .addStringOption((o) => o.setName('option4').setDescription('خيار 4')),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const options = ['option1', 'option2', 'option3', 'option4']
      .map((k) => interaction.options.getString(k))
      .filter(Boolean);
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
    const desc = options.map((o, i) => `${emojis[i]} ${o}`).join('\n');
    const msg = await interaction.reply({ embeds: [{ title: `📊 ${question}`, description: desc }], fetchReply: true });
    for (let i = 0; i < options.length; i++) await msg.react(emojis[i]);
  },
};
