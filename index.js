const Discord = require('discord.js');
const BodyParser = require('body-parser');
const Express = require('express');
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages] });
const app = Express();
app.use(BodyParser.json());
app.post('/singularity/webhook', (req, res) => {
	const body = req.body;
	if (body.repository.id == 517267215) {
		if (req.headers['x-github-event'] !== 'push') return res.status(200).end();
		else {
			const commits = req.body.commits;
			let chunks = new Array(),
				embeds = new Array();
			if (commits.length*2 > 24) {
				for (let i = 0; i < commits.length; i += 12) {
					chunks.push(commits.slice(i, i + 12));
				}
			}
			else chunks.push(commits);
			for (let wow = 0; wow < chunks.length; wow += 1) {
				const chunk = chunks[wow];
				const embed = new Object({
					title: 'Commit payload',
					footer: {
						iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', 
						text: 'bouncytorch/singularity'
					},
					timestamp: new Date()
				});
				let fields = new Array();
				for (let i = 0; i < chunk.length; i += 1) {
					const commit = chunk[i];
					const message = commit.message;
					console.log(message.match(/(.*)(?=\n\n)|(.*)(?=\\n\\n)/));
					let match, desc;
					if (message.match(/(.*)(?=\n\n)|(.*)(?=\\n\\n)/) == null) {
						match = message;
						fields.push({
							name: '\u200b',
							value: `[\`${commit.id.substring(0, 7)}\`](${commit.url}) **${message}**`
						});	
					}
					else {
						match = message.match(/(.*)(?=\n\n)|(.*)(?=\\n\\n)/)[0];
						desc = message.replace(/(.*)(\n\n)|(.*)(\\n\\n)/, '');
						fields.push({
							name: '\u200b',
							value: `[\`${commit.id.substring(0, 7)}\`](${commit.url}) **${match}**`
						},
						{
							name: 'Description',
							value: `\u200b${desc}`
						});	
					}
					
				}
				embed.fields = fields;
				embeds.push(embed);
			}
			if (commits.length == 1) client.channels.cache.get('998945440189919232').send({ embeds: embeds, content: `\`bouncytorch/singularity\` **${body.ref.replace(/(.*)(?<=\/)/, '')}**: ${commits.length} new commit.` });
			else client.channels.cache.get('998945440189919232').send({ embeds: embeds, content: `\`bouncytorch/singularity\` **${body.ref.replace(/(.*)(?<=\/)/, '')}**: ${commits.length} new commits.` });
			res.status(204).end();
		} 
	}
	else return res.status(403).end();
});
app.get('*', (req, res) => {
	res.send('fuck off').end();
});
client.login(process.env.TOKEN).then(() => console.log('d'));
app.listen(process.env.PORT, () => console.log('dee'));