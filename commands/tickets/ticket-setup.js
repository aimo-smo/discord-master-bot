const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const config = require('../../config');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('إعداد لوحة التذاكر')
    .addChannelOption((o) => o.setName('channel').setDescription('قناة اللوحة').setRequired(true))
    .addChannelOption((o) => o.setName('category').setDescription('كاتيجوري التذاكر').setRequired(true))
    .addRoleOption((o) => o.setName('support-role').setDescription('رتبة فريق الدعم'))
    .addChannelOption((o) => o.setName('log-channel').setDescription('قناة سجل التذاكر'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel');
    const category = interaction.options.getChannel('category');
    const supportRole = interaction.options.getRole('support-role');
    const logChannel = interaction.options.getChannel('log-channel');

    const guildData = client.db.getGuild(interaction.guild.id);
    guildData.ticketCategoryId = category.id;
    guildData.tickets = guildData.tickets || {};
    if (supportRole) guildData.tickets.supportRoleId = supportRole.id;
    if (logChannel) guildData.tickets.logChannelId = logChannel.id;
    client.db.setGuild(interaction.guild.id, guildData);

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle('🎫 نظام التذاكر')
      .setDescription('اختر نوع التذكرة من الأزرار أدناه:\n\n🛠️ **دعم فني** — مساعدة عامة\n💳 **شراء** — طلبات الشراء\n🤝 **تعامل** — تعاملات وتبادلات');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_support').setLabel('دعم فني').setEmoji('🛠️').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('ticket_purchase').setLabel('شراء').setEmoji('💳').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('ticket_deal').setLabel('تعامل').setEmoji('🤝').setStyle(ButtonStyle.Secondary)
    );

    await channel.send({ embeds: [embed], components: [row] });

    let msg = '✅ تم إعداد لوحة التذاكر!';
    if (supportRole) msg += `\n🛠️ رتبة الدعم: ${supportRole}`;
    if (logChannel) msg += `\n📋 سجل التذاكر: ${logChannel}`;

    await interaction.reply({ embeds: [successEmbed(msg)], ephemeral: true });
  },
};
