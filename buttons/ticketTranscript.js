const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { generateTranscript } = require('../utils/transcript');

module.exports = {
  customId: 'ticket_transcript',
  async execute(interaction) {
    const transcript = await generateTranscript(interaction.channel);
    const filePath = path.join(__dirname, '..', 'database', 'transcripts', `${interaction.channel.id}.html`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, transcript);
    await interaction.reply({ content: '📋 Transcript:', files: [{ attachment: filePath, name: 'transcript.html' }], ephemeral: true });
  },
};
