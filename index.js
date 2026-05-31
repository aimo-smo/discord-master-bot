const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const config = require('./config');
const { loadCommands, loadEvents, loadHandlers, matchPrefixHandler } = require('./utils/handlers');
const db = require('./utils/database');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildInvites,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember],
});

client.commands = new Collection();
client.buttons = new Collection();
client.buttonsPrefix = [];
client.selectMenus = new Collection();
client.selectMenusPrefix = [];
client.cooldowns = new Collection();
client.db = db;
client.config = config;
client.activeGames = new Map();

loadCommands(client);
loadEvents(client);
loadHandlers(client, 'buttons');
loadHandlers(client, 'selectMenus');

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      const cooldownKey = `${interaction.user.id}-${command.data.name}`;
      const cooldownAmount = command.cooldown || 3;
      if (client.cooldowns.has(cooldownKey)) {
        const expires = client.cooldowns.get(cooldownKey);
        if (Date.now() < expires) {
          const remaining = Math.ceil((expires - Date.now()) / 1000);
          return interaction.reply({
            content: `⏳ انتظر **${remaining}** ثانية قبل استخدام الأمر مجدداً.`,
            ephemeral: true,
          });
        }
      }
      client.cooldowns.set(cooldownKey, Date.now() + cooldownAmount * 1000);
      setTimeout(() => client.cooldowns.delete(cooldownKey), cooldownAmount * 1000);

      await command.execute(interaction, client);
    } else if (interaction.isButton()) {
      let handler = client.buttons.get(interaction.customId);
      if (!handler) handler = matchPrefixHandler(client.buttonsPrefix, interaction.customId);
      if (handler) await handler.execute(interaction, client);
    } else if (interaction.isStringSelectMenu()) {
      let handler = client.selectMenus.get(interaction.customId);
      if (!handler) handler = matchPrefixHandler(client.selectMenusPrefix, interaction.customId);
      if (handler) await handler.execute(interaction, client);
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === 'ticket_add_modal') {
        const userId = interaction.fields.getTextInputValue('user_id');
        await interaction.channel.permissionOverwrites.edit(userId, {
          ViewChannel: true,
          SendMessages: true,
        });
        await interaction.reply({ content: `✅ تم إضافة <@${userId}>`, ephemeral: true });
      } else if (interaction.customId === 'ticket_remove_modal') {
        const userId = interaction.fields.getTextInputValue('user_id');
        await interaction.channel.permissionOverwrites.delete(userId);
        await interaction.reply({ content: `✅ تم إزالة <@${userId}>`, ephemeral: true });
      }
    }
  } catch (error) {
    console.error(`[Interaction Error] ${interaction.customId || interaction.commandName}:`, error);
    const reply = { content: '❌ حدث خطأ أثناء تنفيذ العملية.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply).catch(() => {});
    } else {
      await interaction.reply(reply).catch(() => {});
    }
  }
});

if (!config.token) {
  console.error('❌ DISCORD_TOKEN مفقود!');
  console.error('   1. انسخ .env.example إلى .env');
  console.error('   2. ضع توكن البوت و CLIENT_ID و GUILD_ID');
  process.exit(1);
}

if (!config.clientId || !config.guildId) {
  console.warn('⚠️ CLIENT_ID أو GUILD_ID مفقود — شغّل npm run deploy بعد إكمال .env');
}

client.login(config.token).catch((err) => {
  console.error('❌ فشل تسجيل الدخول:', err.message);
  process.exit(1);
});

console.log('🚀 جاري تشغيل البوت...');
