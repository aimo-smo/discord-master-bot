require('dotenv').config();

module.exports = {
  // ═══════════════════════════════════════
  //  إعدادات أساسية — ضعها في ملف .env
  // ═══════════════════════════════════════
  token: process.env.DISCORD_TOKEN || '',
  clientId: process.env.CLIENT_ID || '',
  guildId: process.env.GUILD_ID || '',

  prefix: '!',

  colors: {
    primary: 0x5865f2,
    success: 0x57f287,
    error: 0xed4245,
    warning: 0xfee75c,
    gold: 0xf1c40f,
  },

  economy: {
    startingBalance: 500,
    dailyAmount: 250,
    workMin: 50,
    workMax: 200,
    workCooldown: 3600000,
    robSuccessRate: 0.35,
    robMin: 20,
    robMax: 150,
    robCooldown: 7200000,
    xpPerMessage: 5,
    xpCooldown: 60000,
    levelMultiplier: 100,
  },

  tickets: {
    categoryId: null,
    supportRoleId: null,
    logChannelId: null,
    types: {
      support: { label: 'دعم فني', emoji: '🛠️', description: 'مساعدة عامة ومشاكل' },
      purchase: { label: 'شراء', emoji: '💳', description: 'طلبات الشراء والدفع' },
      deal: { label: 'تعامل', emoji: '🤝', description: 'تعاملات وتبادلات' },
    },
  },

  welcome: {
    enabled: true,
    channelId: null,
    leaveChannelId: null,
    autoRoleId: null,
    mentionMember: true,
    embedColor: 0x5865f2,
    imageEnabled: true,
    imageBackground: '#1a1a2e',
    imageTextColor: '#ffffff',
  },

  logs: {
    enabled: true,
    messageDelete: null,
    messageEdit: null,
    memberJoin: null,
    memberLeave: null,
    roleUpdate: null,
    ban: null,
    kick: null,
    channelCreate: null,
    channelDelete: null,
    roleCreate: null,
    roleDelete: null,
  },

  protection: {
    antiSpam: { enabled: true, maxMessages: 5, interval: 5000, action: 'mute', muteDuration: 600000 },
    antiRaid: { enabled: true, maxJoins: 5, interval: 10000, action: 'lockdown' },
  },

  azkar: {
    enabled: false,
    channelId: null,
    roleId: null,
    interval: 'hourly',
    mentionRole: true,
    embedHeader: '📿 ذكر',
    embedColor: 0x2ecc71,
    playVoiceOnSend: false,
    morningHour: 6,
    eveningHour: 18,
  },

  voiceAzkar: {
    enabled: false,
    channelId: null,
    volume: 0.5,
    reciter: 'default',
    autoReconnect: true,
    startHour: 0,
    stopHour: 24,
  },

  shop: { roles: [], colors: [], perks: [] },

  database: {
    path: './database/data.json',
    autoSaveInterval: 30000,
  },

  music: { maxQueueSize: 50, defaultVolume: 0.5 },

  afk: { enabled: true, defaultMessage: 'أنا بعيد مؤقتاً' },

  owners: [],
};
