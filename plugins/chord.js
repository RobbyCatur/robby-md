let fetch = require('node-fetch')

let handler = async (m, { conn, text }) => {
  m.reply('Proses')
  let res = await fetch('https://docs-jojo.herokuapp.com/api/chord?q=' + text )
  let json = await res.json()
  let result = json.result
  if (!json.result) throw `Chord ${text} tidak ditemukan`
  let teks = `
  Chord gitar ${text}
${result}
`.trim()

  m.reply(teks)
  }
  handler.help = ['chord']
  handler.tags = ['internet']
  handler.command = /^chord$/i
  module.exports = handler