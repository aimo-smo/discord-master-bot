const { Events } = require('discord.js');
const { getLogChannel } = require('../utils/guildSettings');
const { baseEmbed } = require('../utils/embeds');

module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember, client) {
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    if (oldRoles.size === newRoles.size) return;

    const added = newRoles.filter((r) => !oldRoles.has(r.id));
    const removed = oldRoles.filter((r) => !newRoles.has(r.id));
    if (added.size === 0 && removed.size === 0) return;

    const channelId = getLogChannel(client, newMember.guild.id, 'roleUpdate');
    const log = channelId ? newMember.guild.channels.cache.get(channelId) : null;
    if (!log) return;

    let desc = `**العضو:** ${newMember.user.tag}\n`;
    if (added.size) desc += `**أُضيفت:** ${added.map((r) => r.name).join(', ')}\n`;
    if (removed.size) desc += `**أُزيلت:** ${removed.map((r) => r.name).join(', ')}`;

    log.send({ embeds: [baseEmbed('🎭 تغيير رتبة', desc)] }).catch(() => {});
  },
};
