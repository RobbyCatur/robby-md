const roles = {
  /*
  'Role Name': <Minimal Level To Obtain this Role>
  */
  'Tidak Ada Role': 0,
  'Pemula': 10,
  'Junior': 20,
  'Senior': 30,
  'Pengguna Sejati': 40,
  'Master': 50,
  'Grand Master': 60,
  'Sepuh': 70,
  'Tetua': 80,
  'Sang Legendaris': 90,
  'Penguasa': 1000
}

module.exports = {
  before(m) {
    let user = global.db.data.users[m.sender]
    let level = user.level
    let role = (Object.entries(roles).sort((a, b) => b[1] - a[1]).find(([,minLevel]) => level >= minLevel) || Object.entries(roles)[0])[0]
    user.role = role
    return true
  }
}
