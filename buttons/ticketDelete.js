const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  customId: 'ticket_delete',
  async execute(interaction, client) {
    const ticket = client.db.getTicket(interaction.channel.id);
    if (!ticket) return interaction.reply({ content: '❌ ليست تذكرة!', ephemeral: true });
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageChannels) && ticket.userId !== interaction.user.id) {
      return interaction.reply({ content: '❌ لا تملك صلاحية!', ephemeral: true });
    }
    client.db.deleteTicket(interaction.channel.id);
    await interaction.reply({ content: '🗑️ جاري حذف التذكرة...' });
    await interaction.channel.delete().catch(() => {});
  },
};
