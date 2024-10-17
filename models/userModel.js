// models/userModel.js
class User {
  constructor(id, username, password, fullname, email, tel) {
    this.id = id
    this.username = username
    this.password = password
    this.fullname = fullname
    this.email = email
    this.tel = tel
  }
}

module.exports = User