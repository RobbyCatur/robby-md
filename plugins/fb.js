let fetch = require('node-fetch')

let handler = async (m, { conn, args }) => {
	m.reply('Proses')
        let me = conn.user.name
	let res = await fetch(`https://masgimenz.my.id/facebook/?url=` + args[0])
	//if (res.status !== 200) throw `Coba Lagi`
	let json = await res.json()
	//if (!json.result) throw `Media tidak ditemukan atau postingan mungkin diprivate`
	let url = json.videoUrl
	if (url) await conn.sendFile(m.chat, url, 'fb.mp4', `${me} Facebook Downloader`, m)
	else throw 'Link download tidak ditemukan'
	}

handler.help = ['fb', 'fbdl', 'facebook']
handler.tags = ['downloader']
handler.command = /^(fb|fbdl|facebook)$/i
handler.limit = true
module.exports = handler
