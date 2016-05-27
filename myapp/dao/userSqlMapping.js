var user = {
  insert:'INSERT INTO ff_users(Username, Phone_number,Password) VALUES(?,?,?)',
  update:'update ff_users set Username=?, Phone_number=? where Id=?',
  delete: 'delete from ff_users where Phone_number=?',
  queryById: 'select * from ff_users where Username=?',
  queryAll: 'select * from ff_users'
};

module.exports = user;
