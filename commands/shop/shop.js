const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { infoEmbed, successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatNumber } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('عرض المتجر'),
  async execute(interaction, client) {
    const guildData = client.db.getGuild(interaction.guild.id);
    const items = guildData.shop?.roles || [];
    if (items.length === 0) {
      return interaction.reply({ embeds: [infoEmbed('🛒 المتجر', 'المتجر فارغ. استخدم `/shop-add` لإضافة منتجات (Admin).')] });
    }
    const list = items.map((item, i) => `${i + 1}. **${item.name}** — ${formatNumber(item.price)} عملة (${item.roleId})`).join('\n');
    await interaction.reply({ embeds: [infoEmbed('🛒 المتجر', list + '\n\nاستخدم `/buy <رقم>` للشراء')] });
  },
};
