const fetch = require('node-fetch')
let handler = async (m, { conn, args }) => {
  m.reply('Proses')
  let res = await fetch('https://hadi-api.herokuapp.com/api/tiktok/?url=' + args[0])
  let json = await res.json()
  let vid = json.result.video.nowm
  if (!json.result.video.nowm) throw `Link download tidak ditemukan ಥ_ಥ`
  let me = conn.user.name
  conn.sendFile(m.chat, vid, 'tiktok.mp4', `${me} Tiktok Downloader V2`, m)
}
handler.help = ['tiktok2', 'tik2', 'tt2']
handler.tags = ['downloader']
handler.command = /^(tt2|tik2|tiktok2)$/i
module.exports = handler
