const Discord = require('discord.js');
const translate = require('../language/translate');

module.exports = {
    name: "slowmode",
    description: "Yavaş mod ayarlar.",
    aliases: ["slowmode", "yavaşmod", "yavaşmod-ayarla", "yavasmod"],
    permissions: "MANAGE_CHANNELS",
    run(message, args, client) {
        const sure = parseInt(args[0]);
        if (isNaN(sure)) return message.channel.send(translate(message, 'commands.slowmode.messages.wrongargs'));
        var args = message.content.substr(1).split(/ +/);
        var command = args[1].toLowerCase();
        if (args[1] < 0) return message.channel.send(translate(message, 'commands.slowmode.messages.wrongargs'))
        if (args[1] != null) {
            message.channel.setRateLimitPerUser(args[1], "sebep");
            message.channel.send(new Discord.MessageEmbed().setDescription(translate(message, 'commands.slowmode.messages.successful', args[1])).setColor(0x30b5f2));
        }
    }
};