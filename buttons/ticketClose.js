const fs = require('fs');
const path = require('path');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { getTickets } = require('../utils/guildSettings');
const { generateTranscript } = require('../utils/transcript');

module.exports = {
  customId: 'ticket_close',
  async execute(interaction, client) {
    const ticket = client.db.getTicket(interaction.channel.id);
    if (!ticket) return interaction.reply({ content: '❌ هذه ليست تذكرة!', ephemeral: true });

    ticket.open = false;
    client.db.setTicket(interaction.channel.id, ticket);

    const transcript = await generateTranscript(interaction.channel);
    const transcriptPath = path.join(__dirname, '..', 'database', 'transcripts', `${interaction.channel.id}.html`);
    fs.mkdirSync(path.dirname(transcriptPath), { recursive: true });
    fs.writeFileSync(transcriptPath, transcript);

    const tickets = getTickets(client, interaction.guild.id);
    const logChannel = tickets.logChannelId ? interaction.guild.channels.cache.get(tickets.logChannelId) : null;
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setTitle('📋 Transcript — تذكرة مغلقة')
        .setDescription(`**المستخدم:** <@${ticket.userId}>\n**النوع:** ${ticket.type}\n**أغلقها:** ${interaction.user}`);
      await logChannel.send({ embeds: [embed], files: [{ attachment: transcriptPath, name: 'transcript.html' }] }).catch(() => {});
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_delete').setLabel('حذف التذكرة').setEmoji('🗑️').setStyle(ButtonStyle.Danger)
    );
    await interaction.reply({ content: '🔒 تم إغلاق التذكرة.', components: [row] });
    await interaction.channel.permissionOverwrites.edit(ticket.userId, { SendMessages: false }).catch(() => {});
  },
};
