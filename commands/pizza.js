const db = require("wio.db");
const Discord = require("discord.js");
module.exports = {
    name: "pizza",
    description: null,
    aliases: ["pizzayap"],
    permissions: null,
    async run(message, args, client) {
    if(!args[0]) return;
    if(args[0] < 1) return;
    if(args[0] > 100) return;
    if(!args[1]) return;
    if(args[1] < 1) return;
    if(args[1] > 100) return;
    let language;
		if (await db.fetch('lang_' + message.guild.id)) {
			language = await db.fetch('lang_' + message.guild.id);
		} else {
			language = 'tr_TR';
		};
    const pizzamsj = require(`../languages/${language}.json`).commands.pizza.messages.pizzamessages;
		let randompizzamessages = pizzamsj[Math.floor(Math.random() * pizzamsj.length + 1)];

    let embed31 = new Discord.MessageEmbed()
    .setColor(0x30b5f2)
    .setDescription(randompizzamessages)
    message.channel.send(embed31)
}};
