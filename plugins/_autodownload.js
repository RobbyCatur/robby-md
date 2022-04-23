const { ytIdRegex, servers, yta, ytv } = require('../lib/y2mate')
const ds = require('dandi-api')
const hx = require('hxz-api')
const fetch = require('node-fetch')

let handler = m => m

handler.before = async function (m, { isOwner }) {
  
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  if (chat.isBanned || user.banned || !chat.download || m.isBaileys) return
  
  if (/https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)/i.test(m.text)) {
    hx.igdl(m.text.match(/https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/.*/i)[0].split(/\n| /i)[0]).then(async (r) => {
      for (let i = 0; i < r.medias.length; i++) {
      conn.sendFile(m.chat, r.medias[i].url, '', `${conn.user.name} Instagram downloader`, m)
              }
          })
      }
   
   if (ytIdRegex.test(m.text) || ytIdRegex.test(m.selectedButtonId)) {
        let yt = false
        let usedServer = servers[0]
        for (let i in servers) {
            let server = servers[i]
            try {
                yt = await yta(m.text.match(ytIdRegex\/.*/i)[0].split(/\n| /i)[0]), server)
                yt2 = await ytv(m.text.match(ytIdRegex\/.*/i)[0].split(/\n| /i)[0]), server)
                usedServer = server
                break
            } catch (e) {
               // m.reply(`Server ${server} error!${servers.length >= i + 1 ? '' : '\nmencoba server lain...'}`)
            }
        }
         if (yt === false) return m.reply(eror)
         if (yt2 === false) return m.reply(eror)
        let { thumb, title, filesizeF } = yt
        await this.send2ButtonLoc(m.chat, thumb, `
*Judul:* ${title}
*Size Audio:* ${filesizeF}
*Size Video:* ${yt2.filesizeF}
*Server:* ${usedServer}
`.trim(), '© Robby Catur', 'MP3', `.yta ${m.text.match(ytIdRegex.*/i)[0].split(/\n| /i)[0])}`, 'MP4', `.ytv ${m.text.match(ytIdRegex.*/i)[0].split(/\n| /i)[0])}`)
    }
    
    if (/https?:\/\/(fb\.watch|(www\.|web\.|m\.)?facebook\.com)/i.test(m.text)) {
      let res = await fetch('https://masgimenz.my.id/facebook/?url=' + m.text.match(/https?:\/\/(fb\.watch|(www\.|web\.|m\.)?facebook\.com)\/.*/i)[0].split(/\n| /i)[0]
      let json = await res.json()
      let url = json.videoUrl
      await this.sendFile(m.chat, url, 'fb.mp4', `${conn.user.name} Facebook downloader\nFro?m ${args[0]}`, m)
      }
      
  return !0
    
}

module.exports = handler
