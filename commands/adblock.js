const { MessageEmbed } = require('discord.js');
const db = require('wio.db');
const translate = require('../language/translate');

module.exports = {
	name: "adblock",
	description: "Reklam koruma sistemi ayarı.",
	aliases: ["reklamkorumasi", "inviteblock", "reklamkoru", "reklamkor"],
	permissions: "MANAGE_GUILD",
	async run(message, args, client) {
		let isOpen = false;
		if (args[0] === "msil" || args[0] === "mdel") {
			await db.set(`reklamkor_${message.guild.id}`, 'msil');
			isOpen = true;
		} else if (args[0] === "ban") {
			await db.set(`reklamkor_${message.guild.id}`, 'ban');
			isOpen = true;
		} else if (args[0] === "kick") {
			await db.set(`reklamkor_${message.guild.id}`, 'kick');
			isOpen = true;
		} else if (args[0] === "off" || args[0] === "kapat" || args[0] === "kapali") {
			try {
				await db.delete(`reklamkor_${message.guild.id}`);
			} catch (err) {
				return message.channel.send(translate(message, 'commands.adblock.messages.ztnkapali'));
			}
		} else {
			return message.channel.send(translate(message, 'commands.adblock.messages.gecersizislm'));
		}
		
		if (isOpen) {
			let embed = new MessageEmbed()
				.setColor(0x30b5f2)
				.setDescription(translate(message, 'commands.adblock.messages.opened'));
			message.channel.send(embed);
		} else {
			let embed = new MessageEmbed()
				.setColor(0x30b5f2)
				.setDescription(translate(message, 'commands.adblock.messages.closed'));
			message.channel.send(embed);
		}
	}
};