const fs = require('fs');
const path = require('path');

function loadHandlers(client, dirName) {
  const dir = path.join(__dirname, '..', dirName);
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'));
  for (const file of files) {
    const handler = require(path.join(dir, file));
    if (handler.customId && handler.execute) {
      client[dirName].set(handler.customId, handler);
    } else if (handler.customIdPrefix && handler.execute) {
      client[`${dirName}Prefix`].push(handler);
    }
  }
}

function loadCommands(client) {
  const commandsDir = path.join(__dirname, '..', 'commands');
  const categories = fs.readdirSync(commandsDir);

  for (const category of categories) {
    const catPath = path.join(commandsDir, category);
    if (!fs.statSync(catPath).isDirectory()) continue;

    const files = fs.readdirSync(catPath).filter((f) => f.endsWith('.js'));
    for (const file of files) {
      const command = require(path.join(catPath, file));
      if (command.data && command.execute) {
        client.commands.set(command.data.name, { ...command, category });
      }
    }
  }
}

function loadEvents(client) {
  const eventsDir = path.join(__dirname, '..', 'events');
  const files = fs.readdirSync(eventsDir).filter((f) => f.endsWith('.js'));

  for (const file of files) {
    const event = require(path.join(eventsDir, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

function matchPrefixHandler(handlers, customId) {
  return handlers.find((h) => customId.startsWith(h.customIdPrefix));
}

module.exports = { loadHandlers, loadCommands, loadEvents, matchPrefixHandler };
