const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const translate = require('../language/translate');

module.exports = {
    name: "banner",
    description: null, 
    aliases: ["ubanner", "mbanner", "userbanner", "memberbanner"],
    permissions: null,
    async run(message, args, client) {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

    let uid = user.id


    let response = fetch(`https://discord.com/api/v8/users/${uid}`, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${client.token}`
        }
    })

    let receive = ''
    let banner = 'https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif'

    response.then(a => {
        if (a.status !== 404) {
            a.json().then(data => {
                receive = data['banner']

                if (receive !== null) {

                    let response2 = fetch(`https://cdn.discordapp.com/banners/${uid}/${receive}.gif`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bot ${client.token}`
                        }
                    })
                    let statut = ''
                    response2.then(b => {
                        statut = b.status
                        banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.gif?size=1024`
                        if (statut === 415) {
                            banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.png?size=1024`
                        }

                    })
                }
            })
        }
    });

    setTimeout(() => {
        if (!receive) return message.channel.send(translate(message, 'commands.banner.error404banner'));
        let embed = new MessageEmbed()
            .setColor(0x30b5f2)
            .setImage(banner)
        message.channel.send(embed)
    }, 1000);
}};
