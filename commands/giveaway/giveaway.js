const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('بدء هبة')
    .addStringOption((o) => o.setName('prize').setDescription('الجائزة').setRequired(true))
    .addIntegerOption((o) => o.setName('winners').setDescription('عدد الفائزين').setRequired(true).setMinValue(1).setMaxValue(10))
    .addIntegerOption((o) => o.setName('duration').setDescription('المدة بالدقائق').setRequired(true).setMinValue(1))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    const prize = interaction.options.getString('prize');
    const winners = interaction.options.getInteger('winners');
    const duration = interaction.options.getInteger('duration') * 60000;
    const ends = Date.now() + duration;

    const embed = {
      title: '🎉 هبة!',
      description: `**الجائزة:** ${prize}\n**الفائزون:** ${winners}\n**ينتهي:** <t:${Math.floor(ends / 1000)}:R>\n\nاضغط 🎉 للمشاركة!`,
      color: 0xf1c40f,
    };
    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    await msg.react('🎉');

    client.db.data.giveaways[msg.id] = { prize, winners, ends, channelId: interaction.channel.id, guildId: interaction.guild.id, participants: [] };
    client.db.markDirty();

    setTimeout(async () => {
      const fetched = await msg.fetch().catch(() => null);
      if (!fetched) return;
      const reaction = fetched.reactions.cache.get('🎉');
      const users = reaction ? await reaction.users.fetch() : new Map();
      const participants = [...users.values()].filter((u) => !u.bot);
      const shuffled = participants.sort(() => Math.random() - 0.5).slice(0, winners);
      const winList = shuffled.map((u) => u.toString()).join(', ') || 'لا أحد';
      await interaction.channel.send({ content: `🎉 **${prize}** — الفائزون: ${winList}` });
      delete client.db.data.giveaways[msg.id];
      client.db.markDirty();
    }, duration);
  },
};
