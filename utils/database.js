const fs = require('fs');
const path = require('path');
const config = require('../config');

class Database {
  constructor() {
    this.path = path.resolve(config.database.path);
    this.data = this.load();
    this.dirty = false;
    this.ensureStructure();
    this.startAutoSave();
    this.setupGracefulShutdown();
  }

  load() {
    try {
      if (fs.existsSync(this.path)) {
        return JSON.parse(fs.readFileSync(this.path, 'utf8'));
      }
    } catch (err) {
      console.error('[Database] فشل تحميل البيانات:', err.message);
    }
    return this.getDefaultData();
  }

  getDefaultData() {
    return {
      users: {},
      guilds: {},
      tickets: {},
      azkar: { custom: [], settings: {} },
      shop: { purchases: {} },
      giveaways: {},
      polls: {},
      suggestions: {},
      invites: {},
      afk: {},
      warnings: {},
      levels: {},
    };
  }

  ensureStructure() {
    const defaults = this.getDefaultData();
    for (const key of Object.keys(defaults)) {
      if (!this.data[key]) this.data[key] = defaults[key];
    }
    this.markDirty();
  }

  markDirty() {
    this.dirty = true;
  }

  save() {
    try {
      const dir = path.dirname(this.path);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2), 'utf8');
      this.dirty = false;
    } catch (err) {
      console.error('[Database] فشل حفظ البيانات:', err.message);
    }
  }

  startAutoSave() {
    setInterval(() => {
      if (this.dirty) this.save();
    }, config.database.autoSaveInterval);
  }

  setupGracefulShutdown() {
    const shutdown = () => {
      this.save();
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('uncaughtException', (err) => {
      console.error('[Fatal]', err);
      this.save();
    });
    process.on('unhandledRejection', (err) => {
      console.error('[Unhandled Rejection]', err);
    });
  }

  // ─── Users ───
  getUser(userId) {
    if (!this.data.users[userId]) {
      this.data.users[userId] = {
        balance: config.economy.startingBalance,
        bank: 0,
        xp: 0,
        level: 1,
        dailyLast: 0,
        workLast: 0,
        robLast: 0,
        inventory: [],
      };
      this.markDirty();
    }
    return this.data.users[userId];
  }

  setUser(userId, data) {
    this.data.users[userId] = { ...this.getUser(userId), ...data };
    this.markDirty();
  }

  // ─── Guilds ───
  getGuild(guildId) {
    if (!this.data.guilds[guildId]) {
      this.data.guilds[guildId] = {
        welcome: {
          enabled: true,
          channelId: null,
          leaveChannelId: null,
          autoRoleId: null,
          mentionMember: true,
          imageEnabled: true,
        },
        logs: { enabled: true, all: null },
        tickets: { supportRoleId: null, logChannelId: null },
        ticketCategoryId: null,
        azkar: { enabled: false, channelId: null, roleId: null, interval: 'hourly', custom: [] },
        voiceAzkar: { channelId: null, volume: 0.5, reciter: 'default', enabled: false },
        protection: { spamUsers: {}, raidJoins: [] },
        shop: { roles: [], colors: [], perks: [] },
        levelRoles: {},
        ticketCounter: 0,
      };
      this.markDirty();
    }
    return this.data.guilds[guildId];
  }

  setGuild(guildId, data) {
    this.data.guilds[guildId] = { ...this.getGuild(guildId), ...data };
    this.markDirty();
  }

  // ─── Tickets ───
  getTicket(channelId) {
    return this.data.tickets[channelId] || null;
  }

  setTicket(channelId, data) {
    this.data.tickets[channelId] = data;
    this.markDirty();
  }

  deleteTicket(channelId) {
    delete this.data.tickets[channelId];
    this.markDirty();
  }

  // ─── Azkar ───
  getAzkarList(guildId) {
    const guild = this.getGuild(guildId);
    const custom = guild.azkar?.custom || [];
    const defaults = require('../database/azkar-default.json');
    return [...defaults, ...custom];
  }

  addZikr(guildId, zikr) {
    const guild = this.getGuild(guildId);
    if (!guild.azkar.custom) guild.azkar.custom = [];
    guild.azkar.custom.push({ id: Date.now().toString(), ...zikr });
    this.setGuild(guildId, guild);
    return guild.azkar.custom;
  }

  removeZikr(guildId, zikrId) {
    const guild = this.getGuild(guildId);
    guild.azkar.custom = (guild.azkar.custom || []).filter((z) => z.id !== zikrId);
    this.setGuild(guildId, guild);
  }

  // ─── Warnings ───
  addWarning(guildId, userId, reason, modId) {
    const key = `${guildId}-${userId}`;
    if (!this.data.warnings[key]) this.data.warnings[key] = [];
    this.data.warnings[key].push({ reason, modId, date: Date.now() });
    this.markDirty();
    return this.data.warnings[key].length;
  }

  getWarnings(guildId, userId) {
    return this.data.warnings[`${guildId}-${userId}`] || [];
  }

  // ─── AFK ───
  setAfk(userId, message) {
    this.data.afk[userId] = { message, since: Date.now() };
    this.markDirty();
  }

  removeAfk(userId) {
    delete this.data.afk[userId];
    this.markDirty();
  }

  getAfk(userId) {
    return this.data.afk[userId] || null;
  }

  // ─── Levels ───
  addXp(userId, amount) {
    const user = this.getUser(userId);
    user.xp += amount;
    const needed = user.level * config.economy.levelMultiplier;
    let leveledUp = false;
    while (user.xp >= needed) {
      user.xp -= needed;
      user.level++;
      leveledUp = true;
    }
    this.setUser(userId, user);
    return { user, leveledUp };
  }
}

module.exports = new Database();
