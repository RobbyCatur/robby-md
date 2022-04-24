const ds = require('dandi-api')
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
	if (!args[0]) throw `Link tiktoknya mana`
        else m.reply('Proses')
 // if (!isOwner) throw `Maaf, sementara fitur ini dinonaktifkan dulu karena terdapat bug`
  ds.Tiktok(args[0]).then(r => {
    let me = conn.user.name
    conn.sendFile(m.chat, r.no_wm, '', `${me} Tiktok Downloader`, m)
    })
//  if (res.status !== 200) throw `Server error!`
//  let json = await res.json()
//  if (!json.status) throw json
//  let url = json.result.nowatermark
//  let txt = `
//  ${me} Tiktok Downloader
//   `
//   await conn.sendFile(m.chat, url, 'tiktok.mp4', txt.trim(), m)
}
handler.help = ['tiktok', 'tt', 'tik'].map(v => v + ' <url>')
handler.tags = ['downloader']

handler.command = /^(tt|tik(tok)?)$/i
handler.limit = false
module.exports = handler
