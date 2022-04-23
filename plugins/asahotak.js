let fetch = require('node-fetch')

let timeout = 20000
let poin = 500
let handler  = async (m, { conn, usedPrefix }) => {
    conn.asahotak = conn.asahotak ? conn.asahotak : {}
    let id = m.chat
    if (id in conn.asahotak) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.asahotak[id][0])
        throw false
    }
    let res = await fetch(`https://api.lolhuman.xyz/api/tebak/asahotak?apikey=c6670fc7e461b7623a8fdf9f`)
    if (res.status !== 200) throw await res.text()
    let json = await res.json()
    if (!json.status) throw json
    let caption = `
*「 Asah Otak 」*

Soal: "${json.result.pertanyaan}"

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik *${usedPrefix}aohint* untuk bantuan
Jawaban benar ${poin} XP
    `.trim()
    conn.asahotak[id] = [
      await conn.reply(m.chat, caption, m),
      json, poin,
      setTimeout(() => {
        if (conn.asahotak[id]) conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.jawaban}*`, '©Robby Catur', 'LANJUT', '.asahotak', m)
        delete conn.asahotak[id]
      }, timeout)
    ]
  }
  handler.help = ['asahotak']
  handler.tags = ['game']
  handler.command = /^asahotak/i
  
  module.exports = handler
