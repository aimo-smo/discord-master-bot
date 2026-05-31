const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-azkar-voice-channel')
    .setDescription('تحديد الروم الصوتي للأذكار')
    .addChannelOption((o) => o.setName('channel').setDescription('القناة').setRequired(true).addChannelTypes(ChannelType.GuildVoice))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel');
    const guildData = client.db.getGuild(interaction.guild.id);
    guildData.voiceAzkar.channelId = channel.id;
    client.db.setGuild(interaction.guild.id, guildData);
    await interaction.reply({ embeds: [successEmbed(`🎙️ روم الأذكار الصوتي: ${channel}`)] });
  },
};
