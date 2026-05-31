const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('إرسال اقتراح')
    .addStringOption((o) => o.setName('idea').setDescription('فكرتك').setRequired(true))
    .addChannelOption((o) => o.setName('channel').setDescription('قناة الاقتراحات').addChannelTypes(ChannelType.GuildText)),
  async execute(interaction, client) {
    const idea = interaction.options.getString('idea');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const embed = {
      title: '💡 اقتراح جديد',
      description: idea,
      color: 0x5865f2,
      footer: { text: `من ${interaction.user.tag}` },
    };
    const msg = await channel.send({ embeds: [embed] });
    await msg.react('👍');
    await msg.react('👎');
    client.db.data.suggestions[msg.id] = { userId: interaction.user.id, idea };
    client.db.markDirty();
    await interaction.reply({ embeds: [successEmbed('✅ تم إرسال اقتراحك!')], ephemeral: true });
  },
};
