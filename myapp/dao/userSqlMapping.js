var user = {
  insert:'INSERT INTO ff_users(Username, Phone_number,Password) VALUES(?,?,?)',
  update:'update ff_users set Password=? where Id=?',
  delete: 'delete from ff_users where id=?',
  queryById: 'select * from ff_users where Username=?',
  queryAll: 'select * from ff_users'
};

module.exports = user;
