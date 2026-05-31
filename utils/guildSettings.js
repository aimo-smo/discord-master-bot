const config = require('../config');

function getWelcome(client, guildId) {
  const g = client.db.getGuild(guildId);
  const w = g.welcome || {};
  return {
    enabled: w.enabled ?? config.welcome.enabled,
    channelId: w.channelId ?? config.welcome.channelId,
    leaveChannelId: w.leaveChannelId ?? config.welcome.leaveChannelId,
    autoRoleId: w.autoRoleId ?? config.welcome.autoRoleId,
    mentionMember: w.mentionMember ?? config.welcome.mentionMember,
    imageEnabled: w.imageEnabled ?? config.welcome.imageEnabled,
    embedColor: w.embedColor ?? config.welcome.embedColor,
  };
}

function getLogChannel(client, guildId, type) {
  const g = client.db.getGuild(guildId);
  if (!g.logs?.enabled && g.logs?.enabled !== undefined) return null;
  if (g.logs?.all) return g.logs.all;
  if (g.logs?.[type]) return g.logs[type];
  return config.logs[type] || null;
}

function getTickets(client, guildId) {
  const g = client.db.getGuild(guildId);
  const t = g.tickets || {};
  return {
    supportRoleId: t.supportRoleId ?? config.tickets.supportRoleId,
    logChannelId: t.logChannelId ?? config.tickets.logChannelId,
    categoryId: g.ticketCategoryId ?? config.tickets.categoryId,
  };
}

function getSetupStatus(client, guildId) {
  const welcome = getWelcome(client, guildId);
  const tickets = getTickets(client, guildId);
  const g = client.db.getGuild(guildId);

  return {
    token: !!config.token,
    welcomeChannel: !!welcome.channelId,
    leaveChannel: !!welcome.leaveChannelId,
    autoRole: !!welcome.autoRoleId,
    logsChannel: !!(g.logs?.all || config.logs.messageDelete),
    ticketCategory: !!tickets.categoryId,
    ticketSupportRole: !!tickets.supportRoleId,
    ticketLog: !!tickets.logChannelId,
    azkarChannel: !!g.azkar?.channelId,
    voiceAzkarChannel: !!g.voiceAzkar?.channelId,
  };
}

module.exports = { getWelcome, getLogChannel, getTickets, getSetupStatus };
