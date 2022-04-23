let fetch = require('node-fetch')
const moment = require('moment-timezone')

let handler = async (m, { conn }) => {
  m.reply('Proses')
  let me = conn.user.name
  const time = moment.tz('Asia/Jakarta').format('HH')
  if (time >= 18) throw `Udah malem bang, waktunya tidur bukan ngocok`
  let res = await fetch(`https://api.lolhuman.xyz/api/asupan?apikey=c6670fc7e461b7623a8fdf9f`)
  let json = await res.json()
  let vid = json.result
  conn.sendFile(m.chat, vid, 'vid.mp4', `Asupan untukmu from ${me}`, m)
  }
  handler.help = ['asupan']
  handler.tags = ['random']
  handler.command = /^asupan$/i
  module.exports = handler
