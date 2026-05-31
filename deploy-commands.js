require('dotenv').config();
const { REST, Routes } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./utils/handlers');
const { Collection } = require('discord.js');

if (!config.token) {
  console.error('❌ DISCORD_TOKEN مفقود! أنشئ ملف .env من .env.example');
  process.exit(1);
}
if (!config.clientId) {
  console.error('❌ CLIENT_ID مفقود! أضفه في ملف .env');
  process.exit(1);
}
if (!config.guildId) {
  console.error('❌ GUILD_ID مفقود! أضف معرف السيرفر في ملف .env');
  process.exit(1);
}

const client = { commands: new Collection() };
loadCommands(client);

const commands = [...client.commands.values()].map((c) => c.data.toJSON());
const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log(`📡 جاري تسجيل ${commands.length} أمر في السيرفر ${config.guildId}...`);
    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
    console.log('✅ تم تسجيل الأوامر بنجاح!');
  } catch (error) {
    console.error('❌ فشل تسجيل الأوامر:', error.message);
    process.exit(1);
  }
})();
