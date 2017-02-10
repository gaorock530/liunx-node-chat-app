class Users {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room, color='') {
    var user = {id, name, room, color};
    this.users.push(user);
    return user;
  }
  removeUser (id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }
  getUser (id) {
    return this.users.filter((user) => user.id === id)[0];
  }
  updateUser(id, update){
    var user = this.getUser(id);
    if (user) {
      user[update.name] = update.value;
    }
    return user;
  }
  getUserList (room) {
    var users = this.users.filter((user) => user.room === room);
    var userList = users.map((user) => user.name);
    return userList;
  }
}

module.exports = {Users};
