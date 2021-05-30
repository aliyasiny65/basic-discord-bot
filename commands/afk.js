const Discord = require('discord.js');
const db = require('wio.db');
const translate = require('../language/translate');

module.exports = {
    name: "afk",
    description: "AFK modunu açar.",
    aliases: ["afk"],
    permissions: null,
    async run(message, args, client) {
        const afkkisi = db.fetch(`afkkisiid_${message.author.id}_${message.guild.id}`);
        const afksebep = args.slice(0).join(' ');;

        if (!args[0]) {
            let kisi = message.guild.members.cache.get(message.author.id);
            let kisiisim = kisi.displayName;

            db.set(`afksebep_${message.author.id}_${message.guild.id}`, "Sebep yok");
            db.set(`afkkisiid_${message.author.id}_${message.guild.id}`, message.author.id);
            db.set(`afkkisiisim_${message.author.id}_${message.guild.id}`, kisiisim);
            let sebep = db.fetch(`afksebep_${message.author.id}_${message.guild.id}`);

            const afkembed = new Discord.MessageEmbed()
                .setDescription(translate(message, 'commands.afk.messages.success', message.author, afksebep))
                .setColor(0x30b5f2)
                .setFooter('Crypon')
            message.channel.send(afkembed).then((msg) => {
              msg.delete({ timeout: 5000 });
            });
            message.member.setNickname(`[AFK] ` + kisiisim);
        };
        if (args[0]) {
            let afksebep = args.join(' ');
            let kisi = message.guild.members.cache.get(message.author.id);
            let kisiisim = kisi.displayName;

            db.set(`afksebep_${message.author.id}_${message.guild.id}`, afksebep);
            db.set(`afkkisiid_${message.author.id}_${message.guild.id}`, message.author.id);
            db.set(`afkkisiisim_${message.author.id}_${message.guild.id}`, kisiisim);
            let sebep = db.fetch(`afksebep_${message.author.id}_${message.guild.id}`);


            const afkembed2 = new Discord.MessageEmbed()
                .setDescription(translate(message, 'commands.afk.messages.success', message.author, afksebep))
                .setColor(0x30b5f2)
                .setFooter('Crypon')
            message.channel.send(afkembed2)
            message.member.setNickname(`[AFK] ` + kisiisim).then((msg) => {
            msg.delete({ timeout: 5000 });
          })};
    }};
