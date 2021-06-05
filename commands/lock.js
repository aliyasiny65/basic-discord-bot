const Discord = require('discord.js');
const { Console } = require('console');
const translate = require('../language/translate');

module.exports = {
    name: "lock",
    description: "Kanalı kilitler.",
    aliases: ["lock", "kilitle", "kanalıkilitle", "kilit", "kanalkilit"],
    permissions: "MANAGE_CHANNELS",
    async run(message, args, client) {
        let channel = message.channel;
        try {
            message.guild.roles.cache.forEach(role => {
                channel.createOverwrite(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            console.log(e);
            message.channel.send(translate(message, 'commands.lock.message.error'))
        }
        message.channel.send(translate(message, 'commands.lock.messages.successful'));
}};