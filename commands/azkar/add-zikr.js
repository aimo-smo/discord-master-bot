const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-zikr')
    .setDescription('إضافة ذكر مخصص')
    .addStringOption((o) => o.setName('text').setDescription('نص الذكر').setRequired(true))
    .addStringOption((o) => o.setName('reference').setDescription('المرجع'))
    .addStringOption((o) => o.setName('image').setDescription('رابط صورة'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    const text = interaction.options.getString('text');
    const reference = interaction.options.getString('reference') || '';
    const image = interaction.options.getString('image') || null;
    client.db.addZikr(interaction.guild.id, { text, reference, image });
    await interaction.reply({ embeds: [successEmbed('✅ تم إضافة الذكر!')] });
  },
};
