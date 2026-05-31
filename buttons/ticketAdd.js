const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  customId: 'ticket_add',
  async execute(interaction) {
    const modal = new ModalBuilder().setCustomId('ticket_add_modal').setTitle('إضافة عضو للتذكرة');
    const input = new TextInputBuilder()
      .setCustomId('user_id')
      .setLabel('معرف العضو (User ID)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);
    modal.addComponents(new ActionRowBuilder().addComponents(input));
    await interaction.showModal(modal);
  },
};

module.exports.handleModal = async (interaction) => {
  const userId = interaction.fields.getTextInputValue('user_id');
  await interaction.channel.permissionOverwrites.edit(userId, {
    ViewChannel: true,
    SendMessages: true,
  });
  await interaction.reply({ content: `✅ تم إضافة <@${userId}>`, ephemeral: true });
};
