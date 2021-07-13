const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const translate = require('../language/translate');

module.exports = {
  name: "balance",
  description: null,
  aliases: ["param", "cüzdan", "cuzdan", "wallet", "cuzdanım", "cüzdanim", "cuzdanim"],
  permissions: null,
  async run(message, args, client) {
    let user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        r =>
          r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
      ) ||
      message.guild.members.cache.find(
        r => r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
      ) ||
      message.member;

    let bal = db.fetch(`money_${user.id}`);
    if (bal === null) bal = 0;
    let bank = await db.fetch(`bank_${user.id}`);
    if (bank === null) bank = 0;

    if (user) {
      let embed = new MessageEmbed()
        .setColor(0x30b5f2)
        .setDescription(translate(message, 'commands.balance.messages.balancemessage', user.user.username, bal, bank));
      message.channel.send(embed);
    } else {
      return message.channel.send(translate(message, 'commands.balance.messages.memberpls'));;
    }
  }
};
