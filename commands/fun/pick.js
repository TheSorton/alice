const config = require('../../config/config.json')
const { cleanEveryone, cleanHere } = require('../../utils/sanitize.js').sanitize;

module.exports = {
  run: async(client, message) => {
    try {
      let args = message.content.slice(6).split(', ');
      let out = args.map(arg => cleanEveryone(cleanHere(arg)));

      if (!out[0]) return await message.reply('what did you want me to pick?')
      if (!out[1]) return await message.reply('too few arguments. You need at least two.');

      await message.reply(`I pick **${out[Math.floor(Math.random() * out.length)]}**`)
    }
    catch (error) {
      await message.channel.send(`\`${error}\``)
    }
  },
  name: 'pick',
  category: 'fun',
  args: true,
  description: 'Picks from given choices',
  usage: '`pick <choice1>, <choice2>, [choice3], [choice4], ...`'
}
