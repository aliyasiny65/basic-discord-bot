const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const translate = require('../language/translate');

module.exports = {
    name: "withdraw",
    description: null,
    aliases: ["bankadançek", "bankadanal", "bankadanparaçek", "bankadancek", "bankadanparacek", "paracek", "paraçek", "bankacek", "bankaçek"],
    permissions: null,
   async run(message, args, bot) {
        let user = message.author;
        let member2 = await db.fetch(`bank_${user.id}`)
        if (args.join(' ').toLocaleLowerCase() == 'all') {
        let money = await db.fetch(`bank_${user.id}`)
        let embed = new MessageEmbed()
          .setColor(0x30b5f2)
          .setDescription(translate(message, 'commands.withdraw.messages.notmoney'));
        if (!money) return message.channel.send(embed)
        db.subtract(`bank_${user.id}`, money)
        db.add(`money_${user.id}`, money)
        let embed5 = new MessageEmbed()
          .setColor(0x30b5f2)
          .setDescription(translate(message, 'commands.withdraw.messages.allmoneytransfersuccess'));
        message.channel.send(embed5)
        } else {
        let embed2 = new MessageEmbed() 
          .setColor(0x30b5f2)
          .setDescription(translate(message, 'commands.withdraw.messages.plstransferamount'));
          if (!args[0]) {
            return message.channel.send(embed2)
        };
        let embed6 = new MessageEmbed()
           .setColor(0x30b5f2)
           .setDescription(translate(message, 'commands.withdraw.messages.insufficientamount'));
          if(isNaN(args[0])) {
            return message.channel.send(embed6)
        };
        let embed3 = new MessageEmbed()
            .setColor(0x30b5f2)
            .setDescription(translate(message, 'commands.withdraw.messages.minamount'));
          if (message.content.includes('-')) {
            return message.channel.send(embed3)
        };
        let embed4 = new MessageEmbed()
             .setColor(0x30b5f2)
             .setDescription(translate(message, 'commands.withdraw.messages.insufficientamount'));
          if (member2 < args[0]) {
            return message.channel.send(embed4)
        };
        let embed5 = new MessageEmbed()
             .setColor(0x30b5f2)
             .setDescription(translate(message, 'commands.withdraw.messages.transfersuccess', args[0]));
       message.channel.send(embed5)
       db.subtract(`bank_${user.id}`, args[0])
       db.add(`money_${user.id}`, args[0])
    };
}};
