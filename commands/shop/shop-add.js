const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop-add')
    .setDescription('إضافة رتبة للمتجر')
    .addStringOption((o) => o.setName('name').setDescription('الاسم').setRequired(true))
    .addRoleOption((o) => o.setName('role').setDescription('الرتبة').setRequired(true))
    .addIntegerOption((o) => o.setName('price').setDescription('السعر').setRequired(true).setMinValue(1))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const guildData = client.db.getGuild(interaction.guild.id);
    if (!guildData.shop.roles) guildData.shop.roles = [];
    guildData.shop.roles.push({
      name: interaction.options.getString('name'),
      roleId: interaction.options.getRole('role').id,
      price: interaction.options.getInteger('price'),
    });
    client.db.setGuild(interaction.guild.id, guildData);
    await interaction.reply({ embeds: [successEmbed('✅ تم إضافة المنتج للمتجر!')] });
  },
};
