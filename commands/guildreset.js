const discord = require('discord.js');

module.exports = {
	name: 'guildreset',
	description: null,
	aliases: ['guild-reset', "guildnuke", "guild-nuke", "sunucu-reset", "sunucureset", "sunucu-sıfırla", "sunucusıfırla"],
	guildOnly: true,
	permissions: "ADMINISTRATOR",
	async run(message, args, client) {
        if(message.guild === null) {
            return
        };

        if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
            return message.channel.send(translate(message, 'commands.guildreset.notmepermissionlol'));
        };
            const channels = message.guild.channels.cache.filter(ch => ch.type !== 'category');
            channels.forEach(async (channel) => {
                if(channel.deletable) {
                    await channel.clone().catch(e => console.log(e))
                    await channel.delete().catch(e => console.log(e))
                }
            });
    }};
