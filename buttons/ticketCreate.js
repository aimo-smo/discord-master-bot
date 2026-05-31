const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const config = require('../config');
const { getTickets } = require('../utils/guildSettings');

const typeLabels = { support: '🛠️ دعم فني', purchase: '💳 شراء', deal: '🤝 تعامل' };

async function createTicket(interaction, client, type) {
  const guildData = client.db.getGuild(interaction.guild.id);
  const existing = Object.values(client.db.data.tickets).find(
    (t) => t.userId === interaction.user.id && t.guildId === interaction.guild.id && t.open
  );
  if (existing) {
    return interaction.reply({ content: '❌ لديك تذكرة مفتوحة بالفعل!', ephemeral: true });
  }

  guildData.ticketCounter = (guildData.ticketCounter || 0) + 1;
  client.db.setGuild(interaction.guild.id, guildData);

  const tickets = getTickets(client, interaction.guild.id);

  const channel = await interaction.guild.channels.create({
    name: `ticket-${guildData.ticketCounter}`,
    type: ChannelType.GuildText,
    parent: tickets.categoryId || null,
    permissionOverwrites: [
      { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      ...(tickets.supportRoleId
        ? [{ id: tickets.supportRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }]
        : []),
    ],
  });

  client.db.setTicket(channel.id, {
    userId: interaction.user.id,
    guildId: interaction.guild.id,
    type,
    open: true,
    createdAt: Date.now(),
  });

  const embed = new EmbedBuilder()
    .setColor(config.colors.primary)
    .setTitle(`${typeLabels[type] || '🎫 تذكرة'}`)
    .setDescription(`مرحباً ${interaction.user}!\nسيتم الرد عليك قريباً.\n\nاستخدم الأزرار أدناه لإدارة التذكرة.`);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_close').setLabel('إغلاق').setEmoji('🔒').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('ticket_transcript').setLabel('Transcript').setEmoji('📋').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('ticket_add').setLabel('إضافة عضو').setEmoji('➕').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('ticket_remove').setLabel('إزالة عضو').setEmoji('➖').setStyle(ButtonStyle.Secondary)
  );

  await channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
  await interaction.reply({ content: `✅ تم إنشاء تذكرتك: ${channel}`, ephemeral: true });
}

module.exports = {
  customIdPrefix: 'ticket_',
  async execute(interaction, client) {
    const type = interaction.customId.replace('ticket_', '');
    if (['support', 'purchase', 'deal'].includes(type)) {
      return createTicket(interaction, client, type);
    }
  },
};
