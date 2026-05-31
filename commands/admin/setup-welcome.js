const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-welcome')
    .setDescription('إعداد قنوات الترحيب والمغادرة والرتبة التلقائية')
    .addChannelOption((o) =>
      o.setName('welcome').setDescription('قناة الترحيب').setRequired(true).addChannelTypes(ChannelType.GuildText)
    )
    .addChannelOption((o) =>
      o.setName('leave').setDescription('قناة المغادرة').addChannelTypes(ChannelType.GuildText)
    )
    .addRoleOption((o) => o.setName('autorole').setDescription('الرتبة التلقائية للجدد'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const guildData = client.db.getGuild(interaction.guild.id);
    guildData.welcome = guildData.welcome || {};
    guildData.welcome.enabled = true;
    guildData.welcome.channelId = interaction.options.getChannel('welcome').id;

    const leave = interaction.options.getChannel('leave');
    if (leave) guildData.welcome.leaveChannelId = leave.id;

    const role = interaction.options.getRole('autorole');
    if (role) guildData.welcome.autoRoleId = role.id;

    client.db.setGuild(interaction.guild.id, guildData);

    let msg = `✅ **قناة الترحيب:** ${interaction.options.getChannel('welcome')}`;
    if (leave) msg += `\n✅ **قناة المغادرة:** ${leave}`;
    if (role) msg += `\n✅ **الرتبة التلقائية:** ${role}`;

    await interaction.reply({ embeds: [successEmbed(msg)] });
  },
};
