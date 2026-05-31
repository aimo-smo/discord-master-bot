const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  customId: 'ticket_remove',
  async execute(interaction) {
    const modal = new ModalBuilder().setCustomId('ticket_remove_modal').setTitle('إزالة عضو من التذكرة');
    const input = new TextInputBuilder()
      .setCustomId('user_id')
      .setLabel('معرف العضو (User ID)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);
    modal.addComponents(new ActionRowBuilder().addComponents(input));
    await interaction.showModal(modal);
  },
};
