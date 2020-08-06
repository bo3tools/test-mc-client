/* jshint node: true, esversion: 8 */

const mineflayer = require("mineflayer");
const Item = require("prismarine-item")("1.16");

const argv = process.argv.slice(2);
if (argv.length == 0 || argv.length > 2) {
    console.log("Usage: node index.js <host:port> <username>");
    process.exit(1);
}

function parseArguments(args) {
    const server = args[0].split(":");
    return {
        host: server[0],
        port: server[1] ? parseInt(server[1]) : 25565,
        username: args[1] || "Player"
    };
}

const {host, port, username} = parseArguments(argv);
const bot = mineflayer.createBot({host, port, username});

console.log(`Connecting to ${host}:${port} as ${username}...`);

bot.on("chat", (username, message) => {
    if (username === bot.username || !message.startsWith("!")) {
        return;
    }

    const args = message.split(" ").slice(1);
    
    if (message.startsWith("!say")) {
        bot.chat(args.join(" "));
    }
});

bot.on("entityUpdate", (entity) => {
    if (entity.objectType == "Item") {
        const droppedItem = Item.fromNotch(entity.metadata[7]);
        bot.chat(`I see a ${droppedItem.displayName} x${droppedItem.count} on the ground`);
    }
});