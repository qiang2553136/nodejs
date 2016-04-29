var archive = {
  insert:'INSERT INTO fenfen_archive( archive_title, archive_content) VALUES(?,?)',
  update:'update fenfen_archive set archive_title=?, archive_content=? where archive_id=?',
  delete: 'delete from fenfen_archive where archive_id=?',
  queryById: 'select * from fenfen_archive where archive_id=?',
  queryAll: 'select * from fenfen_archive'
};

module.exports = archive;
