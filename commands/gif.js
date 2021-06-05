const { tenorAPIKEY } = require('../config.json');
const translate = require('../language/translate');
const querystring = require("querystring");
const fetch = require("node-fetch");

module.exports = {
	name: 'gif',
	description: null,
	aliases: ['randomgif', 'rastgelegif'],
	args: true,
	usage: null,
	guildOnly: false,
	permissions: null,
	run(message, args, client) {
		this.description = translate(message, 'commands.gif.description');
		this.usage = translate(message, 'commands.gif.usage');

		message.channel.send(translate(message, 'commands.gif.messages.loadingGIF'))
			.then(async (msg) => {
				const query = querystring.stringify({ q: args.join('+'), key: tenorAPIKEY });
				const gif = await fetch(`https://g.tenor.com/v1/search?${query}`).then((res) => res.json());
				if (gif) {
					const index = Math.floor(Math.random() * gif.results.length);
					msg.edit(gif.results[index].media[0].gif.url || translate(message, 'commands.gif.messages.noResultsFound'));
				} else {
					const index = Math.floor(Math.random() * gif.results.length);
					msg.edit(translate(message, 'commands.gif.messages.noResultsFound'));
				}
			}).catch((err) => {
				message.channel.send(translate(message, 'commands.gif.messages.noResultsFound'));
			});
	},
};
