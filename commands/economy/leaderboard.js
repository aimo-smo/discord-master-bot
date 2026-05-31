const { SlashCommandBuilder } = require('discord.js');
const { infoEmbed } = require('../../utils/embeds');
const { formatNumber } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('لوحة المتصدرين')
    .addStringOption((o) =>
      o.setName('type').setDescription('النوع').addChoices(
        { name: '💰 الرصيد', value: 'balance' },
        { name: '📊 المستوى', value: 'level' }
      )
    ),
  async execute(interaction, client) {
    const type = interaction.options.getString('type') || 'balance';
    const users = Object.entries(client.db.data.users)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => (type === 'level' ? b.level - a.level || b.xp - a.xp : b.balance - a.balance))
      .slice(0, 10);

    const medals = ['🥇', '🥈', '🥉'];
    const lines = await Promise.all(
      users.map(async (u, i) => {
        const member = await interaction.guild.members.fetch(u.id).catch(() => null);
        const name = member?.user.username || u.id;
        const val = type === 'level' ? `Lv.${u.level}` : formatNumber(u.balance);
        return `${medals[i] || `${i + 1}.`} **${name}** — ${val}`;
      })
    );

    await interaction.reply({
      embeds: [infoEmbed(`🏆 المتصدرين (${type === 'level' ? 'المستوى' : 'الرصيد'})`, lines.join('\n') || 'لا توجد بيانات')],
    });
  },
};
