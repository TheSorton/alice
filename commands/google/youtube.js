// Google Images
const https = require('https')
const config = require('../../config/config.json');
const { MessageEmbed } = require('discord.js');
const { track_message, is_message_tracked, MessageType }
  = require('../../utils/reaction_tracking.js').reaction_tracking;

module.exports = {
  run: async(client, message, args) => {
    try {
      if (!args[0]) return await message.reply('a search term is required.')

      const filter = (reaction, user) => {
        return ['⬅️', '➡️',  '❌' ].includes(reaction.emoji.name) && user.id === message.author.id;

      };

      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&order=relevance&type=video&videoDefinition=high&key=${config.google.apikey}&q=${args.join(' ')}`
      https.get(url, function(response) {
        var body = '';

        response.on('data', function(chunk){
          body += chunk;
        });
        response.on('end', function() {
          body = JSON.parse(body);
          size = body.items.length - 1
          if (body.items.length  === 0)  return message.reply("No results found.")
          let link = `https://youtu.be/${body.items[0].id.videoId}`
          i = 0

          message.channel.send(link).then(
            msg => msg.react('⬅️').then(
              msg.react('➡️').then(
                msg.react('❌').then(() => {
                  let collector =  msg.createReactionCollector(filter, { time: 60000, dispose: true });
                  collector.on('collect', reaction => {
                    if (reaction.emoji.name === '⬅️' && i > 0) {
                      --i;
                      reaction.message.edit(`https://youtu.be/${body.items[i].id.videoId}`)
                    }
                    else if (reaction.emoji.name === '➡️' && i < size) {
                      ++i;
                      reaction.message.edit(`https://youtu.be/${body.items[i].id.videoId}`)

                    }
                    else if (reaction.emoji.name === '❌') {
                      msg.delete();
                    }
                  });
                  collector.on('remove', reaction => {
                    if (reaction.emoji.name === '⬅️' &&  i > 0) {
                      --i;
                      reaction.message.edit(`https://youtu.be/${body.items[i].id.videoId}`)

                    }
                    else if (reaction.emoji.name === '➡️' && i < size) {
                      ++i;
                      reaction.message.edit(`https://youtu.be/${body.items[i].id.videoId}`)
                    }
                    else if (reaction.emoji.name === '❌') {
                      msg.delete();
                    }
                  });
                  collector.on('end', collected => {
                    if(!msg.deleted) msg.reactions.removeAll()
                  });

                }))))
        })

      }).on('error', (e) => {
        message.channel.send(`\`${e}\``)
      })
    }
    catch (error) {
      await message.channel.send(`\`${error}\``)
    }

  },
  name: 'yt',
  category: 'google',
  args: true,
  aliases: ['youtube'],
  description: 'Searches youtube',
  usage: '`yt <search-term>`'
}
