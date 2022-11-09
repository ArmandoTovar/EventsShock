require('dotenv').config();

module.exports = {
  client: 'mssql',
  connection: {
    server: 'localhost',
    user: 'root',
    password: '123456',
    database: 'STOCK',
  },
};
