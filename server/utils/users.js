class Users {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room) {
    var user = {id, name, room};
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
  updateUser(id, info){
    var user = this.getUser(id);
    if (user) {
      user.info = info;
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
