const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { formatNumber } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('شراء من المتجر')
    .addIntegerOption((o) => o.setName('item').setDescription('رقم المنتج').setRequired(true).setMinValue(1)),
  async execute(interaction, client) {
    const index = interaction.options.getInteger('item') - 1;
    const guildData = client.db.getGuild(interaction.guild.id);
    const items = guildData.shop?.roles || [];
    const item = items[index];
    if (!item) return interaction.reply({ embeds: [errorEmbed('منتج غير موجود!')] });

    const user = client.db.getUser(interaction.user.id);
    if (user.balance < item.price) return interaction.reply({ embeds: [errorEmbed('رصيدك غير كافٍ!')] });

    const role = interaction.guild.roles.cache.get(item.roleId);
    if (!role) return interaction.reply({ embeds: [errorEmbed('الرتبة غير موجودة!')] });

    user.balance -= item.price;
    client.db.setUser(interaction.user.id, user);
    await interaction.member.roles.add(role);
    await interaction.reply({ embeds: [successEmbed(`✅ اشتريت **${item.name}** بـ **${formatNumber(item.price)}**!`)] });
  },
};
