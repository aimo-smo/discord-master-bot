const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');

const categoryNames = {
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
  afk: '💤 AFK',
  poll: '📊 استطلاع',
  giveaway: '🎉 هبات',
};

function listCommands(client, category) {
  const cmds = [...client.commands.values()].filter((c) => c.category === category);
  return cmds.map((c) => `\`/${c.data.name}\` — ${c.data.description}`).join('\n') || 'لا توجد أوامر';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('عرض قائمة الأوامر والمساعدة')
    .addStringOption((o) =>
      o.setName('category').setDescription('الفئة').setRequired(false).addChoices(
        ...Object.entries(categoryNames).map(([value, name]) => ({ name, value }))
      )
    ),
  async execute(interaction, client) {
    const category = interaction.options.getString('category');

    if (category) {
      return interaction.reply({
        embeds: [infoEmbed(categoryNames[category] || category, listCommands(client, category))],
      });
    }

    const categories = {};
    for (const cmd of client.commands.values()) {
      categories[cmd.category] = (categories[cmd.category] || 0) + 1;
    }

    const desc = Object.entries(categories)
      .map(([cat, count]) => `**${categoryNames[cat] || cat}** — ${count} أمر`)
      .join('\n');

    const select = new StringSelectMenuBuilder()
      .setCustomId('help_menu')
      .setPlaceholder('اختر فئة لعرض أوامرها')
      .addOptions(
        Object.entries(categories).map(([value, count]) => ({
          label: (categoryNames[value] || value).replace(/^[^\s]+\s/, ''),
          description: `${count} أمر`,
          value,
          emoji: categoryNames[value]?.split(' ')[0] || '📁',
        }))
      );

    const row = new ActionRowBuilder().addComponents(select);

    const embed = infoEmbed(
      '🤖 بوت Discord المتكامل',
      `${desc}\n\n**إجمالي الأوامر:** ${client.commands.size}\n\nاستخدم القائمة أدناه أو \`/help category:<الفئة>\`\n\n⚙️ للإعداد: \`/setup\``
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
