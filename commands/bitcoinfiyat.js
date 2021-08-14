const Discord = require('discord.js');
const translate = require('../language/translate');
const snekfetch = require("snekfetch");

module.exports = {
	name: 'btcfiyat',
	description: null,
	aliases: ['bitcoinfiyat'],
    permissions: null,
  async run(message, args, bot) {
    snekfetch.get("https://blockchain.info/ticker").then((body) => {
        message.channel.send({
            embed: {
                title: translate(message, 'commands.btcfiyat.messages.title'),
                description: translate(message, 'commands.btcfiyat.messages.embeddescription'),
                color: 0x30b5f2,
                fields: Object.keys(body.body).map((c) => {
                    return {
                        name: c,
                        value: "**Fiyat**: " + body.body[c].symbol + body.body[c].buy + "\n**Satış Değeri**: " + body.body[c].symbol + body.body[c].sell,
                        inline: true
                    }
                })
            }
        })
    }).catch((error) => {
        message.channel.send({
            embed: {
                title: "Error!",
                color: 0x30b5f2,
                description: "Bitcoin fiyatlarını alırken beklenmeyen bir hata oluştu."
            }
        })
        console.error("Bitcoin Bilgisi alınırken hata oluştu!", error.message)     
  });
}};
