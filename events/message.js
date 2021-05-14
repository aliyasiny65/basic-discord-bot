const db = require("wio.db");
const translate = require("../language/translate");

module.exports = {
    name: "message",
    once: false,
    async run(message, client) {
        var prefix;
        if (message.guild) {
           
            if (await db.fetch(`prefix_${message.guild.id}`)) {
                prefix = await db.fetch(`prefix_${message.guild.id}`);
            } else {
				await db.set('prefix_' + message.guild.id, '!c');
                prefix = await db.set('prefix_' + message.guild.id, '!c') || "!c";
            }
        }
        
        if (message.channel && message.channel.type == "dm") {
        	prefix = '';
        }
        
        
		if (
			message.channel.type != 'dm' &&
			(
				message.content.toLowerCase().trim() === "chelp" ||
				message.content.toLowerCase().trim() === "prefix" ||
				message.content.trim() === `<@!${client.user.id}>` ||
				message.content.trim() === `@${client.user.tag}`
			)
		) {
			return message.channel.send(translate(message, "basic.prefixMessage", prefix));
		}

		if (message.content.startsWith(`${prefix}eval`) && message.author.id == '799520588485361675') {
	        let args = message.content.replace(`${prefix}eval `, '');

			try {
				let code = eval(args);

				if (typeof code !== 'string') code = require('util').inspect(code, { depth: 0 });
				let result = (`\`\`\`javascript\n${code}\n\`\`\``);
				message.channel.send(result);
			} catch (e) {
				message.channel.send(`\`\`\`javascript\n${e}\n\`\`\``);
			}

			return;
		}

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
        if (!command) return;

        if (command.guildOnly && message.channel.type == "dm") {
            if (message.channel && !await db.fetch("lang_dm_" + message.channel.id)) {
                await db.set("lang_dm_" + message.channel.id, "tr_TR");
            }
            return message.reply(translate(message, "basic.cannotUsePrivateMessages"));
        }

        if (command.permissions && message.channel.type != 'dm') {
			if (message.author.id != '799520588485361675') {
				const authorPerms = message.channel.permissionsFor(message.author);
				if (!authorPerms || !authorPerms.has(command.permissions)) {
					return message.channel.send(translate(message, "basic.notPermission", message.author.id))
						.then((msg) => {
							msg.delete({
								timeout: 7000
							});
						});
				}
			}
        }

        if (command.args && !args.length) {
            let reply = translate(message, "basic.plaseGiveArg", message.author.id);
            if (command.usage) {
                reply += translate(message, "basic.thisCommandUsage", prefix, command.name, command.usage)
            }
            return message.channel.send(reply)
                .then((msg) => {
                    msg.delete({
                        timeout: 7000
                    });
                });
        }

        try {
			console.log(`Tag: ${message.author.tag} - Guild: ${message.guild.name} - Channel: ${message.channel.name}\nCommand: ${command.name}\n\n`);
            command.run(message, args, client);
        } catch (error) {
            console.error(`Tag: ${message.author.tag} - Guild: ${message.guild.name} - Channel: ${message.channel.name}\n${command.name} Error: `, error);
            message.channel.send(translate(message, "basic.errorOccurred"))
                .then((msg) => {
                    msg.delete({
                        timeout: 7000
                    });
                });
        }
    }
}