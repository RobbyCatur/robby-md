let { Presence } = require('@adiwajshing/baileys')
let { performance } = require('perf_hooks')
const simple = require('./lib/simple')
const util = require('util')
const moment = require('moment-timezone')

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

const more = String.fromCharCode(8206)
global.readMore = more.repeat(4001)

module.exports = {
    async handler(chatUpdate) {
        if (global.db.data == null) await loadDatabase()
        this.msgqueque = this.msgqueque || []
        // console.log(chatUpdate)
        if (!chatUpdate) return
        if (chatUpdate.messages.length > 1) console.log(chatUpdate.messages)
        let m = chatUpdate.messages[chatUpdate.messages.length - 1]
        if (!m) return
        //console.log(JSON.stringify(m, null, 4))
        try {
            m = simple.smsg(this, m) || m
            if (!m) return
            // console.log(m)
            m.exp = 0
            m.limit = false
            try {
                let user = global.db.data.users[m.sender]
                if (typeof user !== 'object') global.db.data.users[m.sender] = {}
                if (user) {
		    if (!isNumber(user.exp)) user.exp = 0
       		    if (!isNumber(user.limit)) user.limit = 10
        	    if (!isNumber(user.lastclaim)) user.lastclaim = 0
        	    if (!('registered' in user)) user.registered = false
        	    if (!user.registered) {
        	      if (!('name' in user)) user.name = this.getName(m.sender)
        	      if (!isNumber(user.age)) user.age = -1
       		      if (!isNumber(user.regTime)) user.regTime = -1
       		    }
        	    if (!isNumber(user.afk)) user.afk = -1
        	    if (!('afkReason' in user)) user.afkReason = ''
		    if (!('premium' in user)) user.premium = false
		    if (!isNumber(user.premiumTime)) user.premiumTime = 0
        	    if (!('banned' in user)) user.banned = false
        	    if (!isNumber(user.level)) user.level = 0
          	    if (!user.role) user.role = 'Beginner'
          	    if (!('autolevelup' in user)) user.autolevelup = false
                } else global.db.data.users[m.sender] = {
                    exp: 0,
         	    limit: 10,
          	    lastclaim: 0,
         	    registered: false,
	            name: this.getName(m.sender),
          	    age: -1,
          	    regTime: -1,
         	    afk: -1,
     	            afkReason: '',
		    premium: false,
		    premiumTime: 0,
        	    banned: false,
        	    level: 0,
        	    role: 'Beginner',
        	    autolevelup: false,
                }

                let chat = global.db.data.chats[m.chat]
     	        if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
      	        if (chat) {
          	  if (!('isBanned' in chat)) chat.isBanned = false
        	  if (!('welcome' in chat)) chat.welcome = false
        	  if (!('detect' in chat)) chat.detect = false
        	  if (!('sWelcome' in chat)) chat.sWelcome = ''
        	  if (!('sBye' in chat)) chat.sBye = ''
        	  if (!('sPromote' in chat)) chat.sPromote = ''
        	  if (!('sDemote' in chat)) chat.sDemote = ''
        	  if (!('delete' in chat)) chat.delete = true
        	  if (!('antiLink' in chat)) chat.antiLink = false
        	  if (!('antiSticker' in chat)) chat.antiSticker = false
        	  if (!('getmsg' in chat)) chat.getmsg = false
        	  if (!('simi' in chat)) chat.simi = false
        	  if (!('viewonce' in chat)) chat.viewonce = false
       	 	} else global.db.data.chats[m.chat] = {
         	  isBanned: false,
         	  welcome: false,
         	  detect: false,
         	  sWelcome: '',
         	  sBye: '',
         	  sPromote: '',
         	  sDemote: '',
         	  delete: true,
         	  antiLink: false,
         	  antiSticker: false,
         	  getmsg: false,
         	  simi: false,
         	  viewonce: false,
        }

                let settings = global.db.data.settings[this.user.jid]
                if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
                if (settings) {
                   if (!('anticall' in settings)) settings.anticall = false
       		   if (!('autoread' in settings)) settings.autoread = false
        	   if (!('nyimak' in settings)) settings.nyimak = false
       		   if (!('restrict' in settings)) settings.restrict = false
       		   if (!('self' in settings)) settings.self = false
       		   if (!('pconly' in settings)) settings.pconly = false
       		   if (!('gconly' in settings)) settings.gconly = false
       		   if (!('jadibot' in settings)) settings.jadibot = false
       		 } else global.db.data.settings[this.user.jid] = {
       		   anticall: false,
       		   autoread: false,
       		   nyimak: false,
        	   restrict: false,
       		   self: false,
       		   pconly: false,
        	   gconly: false,
        	   jadibot: false,
                }
            } catch (e) {
                console.error(e)
            }
               if (settings.nyimak) return
     	       if (!m.fromMe && setting.self) return
      	       if (settings.pconly && m.chat.endsWith('g.us')) return
     	       if (settings.gconly && !m.chat.endsWith('g.us')) return
    	       if (typeof m.text !== 'string') m.text = ''
               for (let name in global.plugins) {
                let plugin = global.plugins[name]
                if (!plugin) continue
                if (plugin.disabled) continue
                if (!plugin.all) continue
                if (typeof plugin.all !== 'function') continue
                try {
                    await plugin.all.call(this, m, chatUpdate)
                } catch (e) {
                    if (typeof e === 'string') continue
                    console.error(e)
                }
            }
            if (m.isBaileys) return
            m.exp += Math.ceil(Math.random() * 10)

            let usedPrefix
            let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

            global.prems = global.db.data.users[m.sender].premium ///JSON.parse(fs.readFileSync('./data/premium.json')) // Premium user has unlimited limit
            const isROwner = [global.conn.user.jid, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
            const isOwner = isROwner || m.fromMe
            if (!isOwner && db.data.settings.self) return // Saat mode self diaktifkan hanya owner yang dapat menggunakannya
            const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
            const isPrems = isROwner || db.data.users[m.sender].premium || false
            //let isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
            if (!isPrems && !m.isGroup && global.db.data.settings.groupOnly) return
            const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
            const participants = (m.isGroup ? groupMetadata.participants : []) || []
            const user = (m.isGroup ? participants.find(u => this.decodeJid(u.id) === m.sender) : {}) || {} // User Data
            const bot = (m.isGroup ? participants.find(u => this.decodeJid(u.id) == this.user.jid) : {}) || {} // Your Data
            const isAdmin = user && user?.admin || false // Is User Admin?
            const isBotAdmin = bot && bot?.admin || false // Are you Admin?
	    const isBlocked = this.blocklist.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != this.user.jid).includes(m.sender) // Is User Blocked?

            for (let name in global.plugins) {
                let plugin = global.plugins[name]
                if (!plugin) continue
                if (plugin.disabled) continue
                if (!setting.restrict) if (plugin.tags && plugin.tags.includes('admin')) continue
                const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
                let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
                let match = (_prefix instanceof RegExp ? // RegExp Mode?
                    [[_prefix.exec(m.text), _prefix]] :
                    Array.isArray(_prefix) ? // Array?
                        _prefix.map(p => {
                            let re = p instanceof RegExp ? // RegExp in Array?
                                p :
                                new RegExp(str2Regex(p))
                            return [re.exec(m.text), re]
                        }) :
                        typeof _prefix === 'string' ? // String?
                            [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                            [[[], new RegExp]]
                ).find(p => p[1])
                if (typeof plugin.before === 'function') if (await plugin.before.call(this, m, {
                    match,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
		    isBlocked,
                })) continue
                if (typeof plugin !== 'function') continue
                if ((usedPrefix = (match[0] || '')[0])) {
                    let noPrefix = m.text.replace(usedPrefix, '')
                    let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                    args = args || []
                    let _args = noPrefix.trim().split` `.slice(1)
                    let text = _args.join` `
                    command = (command || '').toLowerCase()
                    let fail = plugin.fail || global.dfail // When failed
                    let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                        plugin.command.test(command) :
                        Array.isArray(plugin.command) ? // Array?
                            plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                                cmd.test(command) :
                                cmd === command
                            ) :
                            typeof plugin.command === 'string' ? // String?
                                plugin.command === command :
                                false

                    if (!isAccept) continue
                    m.plugin = name
                    if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                        let chat = global.db.data.chats[m.chat]
                        let user = global.db.data.users[m.sender]
                        if (name != 'unbanchat.js' && chat && chat?.isBanned) return // Except this
                        if (name != 'unbanuser.js' && user && user?.banned) return
                    }
                    if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                        fail('owner', m, this)
                        continue
                    }
                    if (plugin.rowner && !isROwner) { // Real Owner
                        fail('rowner', m, this)
                        continue
                    }
                    if (plugin.owner && !isOwner) { // Owner UserJid
                        fail('owner', m, this)
                        continue
                    }
                    if (plugin.mods && !isMods) { // Moderator
                        fail('mods', m, this)
                        continue
                    }
                    if (plugin.premium && !isPrems) { // Premium
                        fail('premium', m, this)
                        continue
                    }
                    if (plugin.group && !m.isGroup) { // Group Only
                        fail('group', m, this)
                        continue
                    } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                        fail('botAdmin', m, this)
                        continue
                    } else if (plugin.admin && !isAdmin) { // User Admin
                        fail('admin', m, this)
                        continue
                    }
                    if (plugin.private && m.isGroup) { // Private Chat Only
                        fail('private', m, this)
                        continue
                    }
                    if (plugin.register == true && _user.registered == false) { // Need register?
                        fail('unreg', m, this)
                        continue
                    }
                    m.isCommand = true
                    let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
                    if (xp > 200) m.reply('Ngecit -_-') // Hehehe
                    else m.exp += xp
                    if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
                        this.send2Button(m.chat, `Limit anda habis, silahkan beli melalui *${usedPrefix}buy*`, '©Robby Catur', 'Buy', `${usedPrefix}buy`, 'Buy All', `${usedPrefix}buyall`, m)
                        continue // Limit habis
                    }
                    if (plugin.level > _user.level) {
                        this.reply(m.chat, `Diperlukan level *${plugin.level}* untuk menggunakan perintah ini. Level kamu ${_user.level}`, m)
                        continue // If the level has not been reached
                    }
                    let extra = {
                        match,
                        usedPrefix,
                        noPrefix,
                        _args,
                        args,
                        command,
                        text,
                        conn: this,
                        participants,
                        groupMetadata,
                        user,
                        bot,
                        isROwner,
                        isOwner,
                        isAdmin,
                        isBotAdmin,
                        isPrems,
                        chatUpdate,
			isBlocked,
                    }
                    try {
                        await plugin.call(this, m, extra)
                        if (!isPrems) m.limit = m.limit || plugin.limit || false
                    } catch (e) {
                        // Error occured
                        m.error = e
                        console.error(e)
                        if (e) {
                            let text = util.format(e)
                            for (let key of Object.values(global.APIKeys))
                                text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                            if (e.name)
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != this.user.jid)) {
                                let data = (await this.onWhatsApp(jid))[0] || {}
                                if (data.exists)
                                    m.reply(`*Plugin:* ${m.plugin}\n*Sender:* @${m.sender.split`@`[0]}\n*Chat:* ${m.chat}\n*Chat Name:* ${await this.getName(m.chat)}\n*Command:* ${usedPrefix}${command} ${args.join(' ')}\n\n\`\`\`${text}\`\`\``.trim(), data.jid, { mentions: [m.sender] })
                            }
                            m.reply(text)
                        }
                    } finally {
                        // m.reply(util.format(_user))
                        if (typeof plugin.after === 'function') {
                            try {
                                await plugin.after.call(this, m, extra)
                            } catch (e) {
                                console.error(e)
                            }
                        }
                        if (m.limit) m.reply(+ m.limit + ' Limit terpakai') 
                    }
                    break
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            // conn.sendPresenceUpdate('composing', m.chat) 
            //console.log(global.db.data.users[m.sender])
            let user, stats = global.db.data.stats
            if (m) {
                if (m.sender && (user = global.db.data.users[m.sender])) {
                    user.exp += m.exp
                    user.limit -= m.limit * 1
                }

                let stat
                if (m.plugin) {
                    let now = + new Date
                    if (m.plugin in stats) {
                        stat = stats[m.plugin]
                        if (!isNumber(stat.total)) stat.total = 1
                        if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1
                        if (!isNumber(stat.last)) stat.last = now
                        if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now
                    } else stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                    stat.total += 1
                    stat.last = now
                    if (m.error == null) {
                        stat.success += 1
                        stat.lastSuccess = now
                    }
                }
            }

            try {
                require('./lib/print')(m, this)
            } catch (e) {
                console.log(m, m.quoted, e)
            }
            if (setting.autoread) await this.chatRead(m.chat, m.isGroup ? m.sender : undefined, m.id || m.key.id).catch(() => { })
        }
    },

    async participantsUpdate({ jid, participants, action }) {
    let chat = global.db.data.chats[jid] || {}
    let text = ''
    switch (action) {
      case 'add':
      case 'remove':
        if (chat.welcome) {
          let groupMetadata = await this.groupMetadata(jid)
          for (let user of participants) {
            let pp = './src/avatar_contact.png'
            try {
              pp = await this.getProfilePicture(user)
            } catch (e) {
            } finally {
              text = (action === 'add' ? (chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!').replace('@subject', this.getName(jid)).replace('@desc', groupMetadata.desc) :
                (chat.sBye || this.bye || conn.bye || 'Bye, @user!')).replace('@user', '@' + user.split('@')[0])
              this.reply(jid, /*pp, 'pp.jpg',*/ text, null, false, {
                contextInfo: {
                  mentionedJid: [user]
                }
              })
            }
          }
        }
        break
      case 'promote':
        text = (chat.sPromote || this.spromote || conn.spromote || '@user ```is now Admin```')
      case 'demote':
        if (!text) text = (chat.sDemote || this.sdemote || conn.sdemote || '@user ```is no longer Admin```')
        text = text.replace('@user', '@' + participants[0].split('@')[0])
        if (chat.detect) m.reply(text)
        break
    }
  },
    async groupsUpdate(groupsUpdate, fromMe, m) {
        if (opts['self'] && m.fromMe) return
            console.log(m)
        // Ingfo tag orang yg update group
        for (let groupUpdate of groupsUpdate) {
            const id = groupUpdate.id
            const participant = groupUpdate.participants
            console.log('\n\n=============\n\n In Groups Update \n\n============\n\n'+ `Id: ${id}\nParticipants: ${participant}` + '\n\n==============================\n')
            if (!id) continue
            let chats = global.db.data.chats[id], text = ''
            if (!chats.detect) continue
            if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || conn.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
            if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || conn.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
            if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
            if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
            if (groupUpdate.announce == true) text = (chats.sAnnounceOn || this.sAnnounceOn || conn.sAnnounceOn || '```Group has been closed!')
            if (groupUpdate.announce == false) text = (chats.sAnnounceOff || this.sAnnounceOff || conn.sAnnounceOff || '```Group has been open!')
            if (groupUpdate.restrict == true) text = (chats.sRestrictOn || this.sRestrictOn || conn.sRestrictOn || '```Group has been all participants!')
            if (groupUpdate.restrict == false) text = (chats.sRestrictOff || this.sRestrictOff || conn.sRestrictOff || '```Group has been only admin!')
            //console.log('=============\n\ngroupsUpdate \n\n============\n\n' + await groupUpdate)
            if (!text) continue
            await this.sendButton(id, text, wm, 'Matikan Fitur', `.off detect`, global.ftroli, { contextInfo: { mentionedJid: this.parseMention(text) }, mentions: await this.parseMention(text) })
            //await this.sendMessage(id, { text, mentions: this.parseMention(text) })
        }
    },
    async delete({ remoteJid, fromMe, id, participant }) {
        if (fromMe) return
        let chats = Object.entries(conn.chats).find(([user, data]) => data.messages && data.messages[id])
        if (!chats) return
        let msg = JSON.parse(chats[1].messages[id])
        let chat = global.db.data.chats[msg.key.remoteJid] || {}
        if (chat.delete) return
        this.sendButton(msg.key.remoteJid, `
Terdeteksi @${m.participant.split`@`[0]} telah menghapus pesan

Sedang mengirim ulang pesan
`.trim(), m.message, {
      contextInfo: {
        mentionedJid: [m.participant]
      }
    })
        await this.delay(1000)
        this.copyNForward(msg.key.remoteJid, msg).catch(e => console.log(e, msg))
    }
}

global.dfail = async (type, m, conn) => {
    let msg = {
      rowner: '_*HANYA UNTUK OWNER!!!*_',
      owner: 'Maaf, hanya *Owner Bot* yang dapat menggunakan perintah ini',
      mods: 'Maaf, hanya bisa digunakan oleh *Moderator Bot!*',
      premium: 'Hanya untuk member _*Premium!*_, Silahkan hubungi owner untuk info lebih lanjut',
      group: 'Gunakan perintah ini di dalam *Group!*',
      private: 'Gunakan perintah ini di Chat Pribadi!',
      admin: 'Hanya untuk *Admin*',
      botAdmin: 'Untuk menggunakan fitur ini, silahkan jadikan bot sebagai admin terlebih dahulu!',
      unreg: 'Daftar dulu!\n\nContoh: #daftar Robby.16'
    }[type]
    if (msg) return conn.reply(m.chat, msg, m, { mentions: conn.parseMention(msg) })
}

let fs = require('fs')
let chalk = require('chalk')
const { default: fetch } = require('node-fetch')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright("Update 'handler.js'"))
    delete require.cache[file]
    if (global.reloadHandler) console.log(global.reloadHandler())
})
