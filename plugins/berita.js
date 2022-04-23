let axios = require('axios')

let handler = async (m, { conn }) => {
	
	m.reply('Proses')
	  
	  axios.get(`https://docs-jojo.herokuapp.com/api/news`).then((res) => {
		let result = res.data.articles.map(res => `*Judul*: ${res.title}\n*Author*: ${res.author}\n*Publish*: ${res.publishedAt}\n*Spoiler*: ${res.description}\n*URL*: ${res.url}`).join('\n\n================================\n   *PEMBATAS* *PEMBATAS* *PEMBATAS*\n================================\n\n').trim()
		let pala = `*BREAKING NEWS*\n\n`
		m.reply(pala+result)
		})
		}
		handler.help = ['berita', 'news']
		handler.tags = ['internet']
		handler.command = /^berita|news$/i
        module.exports = handler
