const Discord = require('discord.js');
const client = new Discord.Client()
const config = require("./config.json")
const Shard = new Discord.ShardingManager('./index.js', {
    totalShards: 2,
    token: ("token")
});

Shard.on('shardCreate', shard => { 
console.log(`${shard.id+1} ID'li Shard Başlatıldı ve Kullanıma Hazır.`)
const webhook = new Discord.WebhookClient("webhook ID","webhook TOKEN")

let embed = new Discord.MessageEmbed()
    .setDescription(`${shard.id+1} ID'li shard bağlanıyor.`)
webhook.send(embed)

setTimeout(() => {
const webhook = new Discord.WebhookClient("Webhook ID","Webhook TOKEN")

let embed = new Discord.MessageEmbed()
    .setDescription(`${shard.id+1} idli shard başarıyla bağlandı!`)
webhook.send(embed)
}, 9000)
});

setTimeout(() => {
Shard.broadcastEval("process.exit()");
}, 860000);
Shard.spawn();
