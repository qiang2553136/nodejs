var user = {
  insert:'INSERT INTO ff_users( username, Phone_number) VALUES(?,?)',
  update:'update ff_users set username=?, Phone_number=? where Id=?',
  delete: 'delete from ff_users where Id=?',
  queryById: 'select * from ff_users where Id=?',
  queryAll: 'select * from ff_users'
};

module.exports = user;
