const translate = require('../language/translate');
const db = require("wio.db");

module.exports = {
    name: "anket",
    description: "Anket yapar.", 
    aliases: ["anket", "oylama", "question"],
    permissions: null,
    run(message, args, client) {
        let prefix = db.fetch(`prefix_${message.guild.id}`)
        if(prefix === null) return prefix = '!c'
        const reactList = ["🇦", "🇧", "🇨", "🇩", "🇪"];
        let question = message.content.match(/\[.+]/gi);

        if (!question) {
            return message.channel.send(translate(message, 'commands.anket.messages.plsquestion', prefix));
        }

        question = question[0].toString()
            .replace(/^\[/, "")
            .replace(/\]$/, "")
            .trim()

        if (question.length < 4) {
            return message.channel.send(translate(message, 'commands.anket.messages.minquestioncharacter'));
        }

        const answers = message.content.match(/\{(.+?)}/gi);

        if (!answers || answers.length < 2) {
            return message.channel.send(translate(message, 'commands.anket.messages.plsoption', prefix));
        } else if (answers.length > 5) {
            return message.channel.send(translate(message, 'commands.anket.messages.maxoption'));
        }

        let embed = {
            color: 0x30b5f2,
            author: {
                name: message.author.tag,
                icon_url: message.author.displayAvatarURL()
            },
            title: (translate(message, 'commands.anket.messages.question')),
            description: (translate(message, 'commands.anket.messages.answer', question))
        };

        for (let i = 0; i < answers.length; i++) {
            embed.description += `${reactList[i]} ${answers[i].toString().replace(/^\{/, "").replace(/\}$/, "")}\n\n`
        }

        message.channel.send({ embed: embed })
            .then((msg) => {
                message.delete();
                for (let i = 0; i < answers.length; i++) {
                    msg.react(reactList[i]);
                }
            });
    }
};
