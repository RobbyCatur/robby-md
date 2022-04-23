function handler(m) {
  this.reply(m.chat, `
Follow me on https://instagram.com/robbycatur_3784
Lets be friends at https://www.facebook.com/profile.php?id=100028282582689
Chat me on wa.me/6282245409072
`.trim(), m)
  this.sendContact(m.chat, '6282245409072', 'Robby Catur', m)
}
handler.help = ['creator', 'owner']
handler.tags = ['info']
handler.command = /^(creator|owner)$/i

module.exports = handler
