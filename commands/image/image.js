// Google Images
const tiny = require('tiny-json-http')
const config = require('../../config/config.json');
const { MessageEmbed } = require('discord.js');
const { embedData } = require('../../utils/embedData')

module.exports = {
    run: async(client, message, args) => {

        let url = `https://www.googleapis.com/customsearch/v1?key=${config.google.apikey}&cx=${config.google.cx}&safe=high&searchType=image&q=${args.join(' ')}}`
        tiny.get({url}, function _get(err, response) {
            if (err) {
                console.log(err)
            }
            else {
                embedID = null
                var body =  response.body;
                console.log(body.items[0].image)
                const embed = new MessageEmbed()
                .setAuthor(`${message.author.tag} searched for ${args.join(' ')}`)
                .setImage(body.items[0].link)
                .setDescription(`[${body.items[0].title}](${body.items[0].image.contextLink})`)

                message.channel.send({ embed })
                .then(msg => msg.react('⬅️').then(msg.react('➡️').then(msg.react('❌'))).then(embedData.storeEmbed(msg)))
                i = 0

                client.on('messageReactionAdd', async (reaction, user) => {
                    if (user.bot) return;
                    if (embedData.isReactionOnImageCmdEmbed(reaction.message)) {
                        if (user.id === message.author.id)  {
                            if (reaction._emoji.name === '➡️') {
                                i = i + 1;

                                updateEmbed = new MessageEmbed(embed)
                                .setImage(body.items[i].link)
                                .setDescription(`[${body.items[i].title}](${body.items[i].image.contextLink})`)

                                await reaction.message.edit(updateEmbed)
                            }
                            else if (reaction._emoji.name === '⬅️' && i > 0) {
                                --i;

                                updateEmbed = new MessageEmbed(embed)
                                .setImage(body.items[i].link)
                                .setDescription(`[${body.items[i].title}](${body.items[i].image.contextLink})`)

                                await reaction.message.edit(updateEmbed)
                            }
                            else if (reaction._emoji.name === '❌') {
                                await reaction.message.delete()
                            }
                        }
                    }
                    else {
                        reaction.message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    }
                })

                client.on('messageReactionRemove', async (reaction, user) => {
                    if (user.bot) return;
                    if (embedData.isReactionOnImageCmdEmbed(reaction.message)) {
                        if (user.id === message.author.id)  {
                            if (reaction._emoji.name === '➡️') {
                                i = i + 1;

                                updateEmbed = new MessageEmbed(embed)
                                .setImage(body.items[i].link)
                                .setDescription(`[${body.items[i].title}](${body.items[i].image.contextLink})`)

                                await reaction.message.edit(updateEmbed)
                            }
                            else if (reaction._emoji.name === '⬅️' && i > 0) {
                                --i;

                                updateEmbed = new MessageEmbed(embed)
                                .setImage(body.items[i].link)
                                .setDescription(`[${body.items[i].title}](${body.items[i].image.contextLink})`)

                                await reaction.message.edit(updateEmbed)
                            }
                            else if (reaction._emoji.name === '❌') {
                                await reaction.message.delete()
                            }
                        }
                    }
                    else {
                        reaction.message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    }
                })
            }
        });
    },
    name: 'image',
    category: 'image',
    args: true,
    aliases: ['google'],
    description: 'Searches Google for images',
    usage: '`image <search-term>`'
}
