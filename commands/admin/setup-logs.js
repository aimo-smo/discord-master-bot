const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-logs')
    .setDescription('تعيين قناة السجلات (Logs) لكل الأحداث')
    .addChannelOption((o) =>
      o.setName('channel').setDescription('قناة السجلات').setRequired(true).addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel');
    const guildData = client.db.getGuild(interaction.guild.id);
    guildData.logs = { enabled: true, all: channel.id };
    client.db.setGuild(interaction.guild.id, guildData);
    await interaction.reply({
      embeds: [successEmbed(`✅ **قناة السجلات:** ${channel}\n\nسيتم تسجيل: حذف/تعديل رسائل، دخول/خروج، حظر، إنشاء/حذف قنوات ورتب`)],
    });
  },
};
