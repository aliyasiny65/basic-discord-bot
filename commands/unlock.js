const Discord = require('discord.js');
const { Console } = require('console');
const translate = require('../language/translate');

module.exports = {
    name: "unlock",
    description: "Kanalın kilidini açar.",
    aliases: ["unlock", "kanalkilitac", "kanalkilitaç", "kanalkilitkaldır", "kanalkilitkaldir"],
    permissions: "MANAGE_CHANNELS",
    async run(message, args, client) {
        let channel = message.channel;
        try {
            message.guild.roles.cache.forEach(role => {
                channel.createOverwrite(role, {
                    SEND_MESSAGES: true,
                    ADD_REACTIONS: true
                });
            });
        } catch (e) {
            console.log(e);
        }
        message.channel.send(translate(message, 'commands.unlock.messages.successful'));
}};
