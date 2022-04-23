let fetch = require('node-fetch')
  let handler = async (m, { conn }) => {
  	let res = await fetch(global.API('LeysCoder', '/api/fakta', {}, 'apikey'))
      let json = await res.json()
      let hasil = json.result
      let txt = `
*Fakta Unik:*
${hasil}
      `.trim()
      conn.reply(m.chat, txt, m)
      }
      handler.help = ['faktaunik']
      handler.tags = ['random']
      handler.command = /^(faktaunik)$/i
      module.exports = handler
