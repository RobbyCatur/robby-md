const hx = require('hxz-api')

let handler = async (m, { conn, args }) => {
  if (!(args[0])) throw `Masukkan link Instagram yang ingin didownload!`
     else m.reply('Proses')
  hx.igdl(args[0]).then(async (r) => {
  let me = conn.user.name
  let txt = `
${me} Instagram downloader
`.trim()
  for (let i = 0; i < r.medias.length; i++) {
    conn.sendFile(m.chat, r.medias[i].url, '', txt, m)
    }
  })
}
handler.help = ['ig']
handler.tags = ['downloader']
handler.command = /^ig$/i

handler.limit = false

module.exports = handler
