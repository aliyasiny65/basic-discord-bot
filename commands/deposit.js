const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const translate = require('../language/translate');

module.exports = {
    name: "deposit",
    description: null,
    aliases: ["bankayaparaaktar", "bankadepola", "bankayabiriktir", "bankayaparakoy", "bankayakoy", "bankakoy"],
    permissions: null,
   async run(message, args, bot) {
        let user = message.author;
        let member = db.fetch(`money_${user.id}`)
        if (args[0] == 'all') {
            let money = await db.fetch(`money_${user.id}`)
            let embedbank = new MessageEmbed()
                .setColor(0x30b5f2)
                .setDescription(translate(message, 'commands.deposit.messages.nottransferredmoney'));
        if (!money) return message.channel.send(embedbank)

            db.subtract(`money_${user.id}`, money)
            db.add(`bank_${user.id}`, money)
            let sembed = new MessageEmbed()
                .setColor(0x30b5f2)
                .setDescription(translate(message, 'commands.deposit.messages.successfullyallmoneytransferred'));
            message.channel.send(sembed)
            } else {
            let nottransferamountembed = new MessageEmbed()
                .setColor(0x30b5f2)
                .setDescription(translate(message, 'commands.deposit.messages.plstransferamount'));
            if (!args[0]) {
            return message.channel.send(nottransferamountembed)
          };
            let walletnotmoneyamount = new MessageEmbed()
                .setColor(0x30b5f2) 
                .setDescription(translate(message, 'commands.deposit.messages.walletnotmoneyamount'));

            if(isNaN(args[0])) {
                return message.channel.send(walletnotmoneyamount)
          };
            let banktransferamountmin = new MessageEmbed()
                .setColor(0x30b5f2)
                .setDescription(translate(message, 'commands.deposit.messages.banktransferamountmin'));

            if (message.content.includes('-')) {
                return message.channel.send(banktransferamountmin)
          };
            let embedaq = new MessageEmbed()
                .setColor(0x30b5f2)
                .setDescription(translate(message, 'commands.deposit.messages.banktransferamountmin'));

            if (member < args[0]) {
                return message.channel.send(embedaq)
          };

            let basarili = new MessageEmbed()
                .setColor(0x30b5f2)
                .setDescription(translate(message, 'commands.deposit.messages.successfullytransferred', args[0]));
            message.channel.send(basarili)
            db.subtract(`money_${user.id}`, args[0])
            db.add(`bank_${user.id}`, args[0])
        }
  }};
