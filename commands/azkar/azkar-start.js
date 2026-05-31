const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('azkar-start')
    .setDescription('تشغيل الأذكار التلقائية')
    .addStringOption((o) =>
      o.setName('interval').setDescription('الفترة').addChoices(
        { name: 'كل ساعة', value: 'hourly' },
        { name: 'كل 3 ساعات', value: '3hours' },
        { name: 'يومياً', value: 'daily' }
      )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    const guildData = client.db.getGuild(interaction.guild.id);
    if (!guildData.azkar?.channelId) {
      return interaction.reply({ embeds: [errorEmbed('حدّد قناة الأذكار أولاً بـ `/set-azkar-channel`')] });
    }
    guildData.azkar.enabled = true;
    guildData.azkar.interval = interaction.options.getString('interval') || guildData.azkar.interval || 'hourly';
    client.db.setGuild(interaction.guild.id, guildData);
    client.azkarScheduler.start(interaction.guild.id);
    await interaction.reply({ embeds: [successEmbed('✅ تم تشغيل الأذكار التلقائية!')] });
  },
};
