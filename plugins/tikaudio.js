let handler = async (m, { conn, args }) => {
  m.reply('Proses')
  conn.sendFile(m.chat, (`https://api.lolhuman.xyz/api/tiktokmusic?apikey=c6670fc7e461b7623a8fdf9f&url=` + args[0]), '', '', m)
  } 
  handler.command = /^tik(tok)?(audio|mp3)|tt(audio|mp3)$/i
  module.exports = handler
