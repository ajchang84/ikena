// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'capstone'
    },
    pool: {
      min: 1,
      max: 10
    },
    debug: false
  },
  production: {
      client: 'pg',
      connection: process.env.DATABASE_URL,
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
  },
  test: {
    client: 'pg',
    connection: {
      database: 'project2_app_test'
    },
    // debug: true
  },

};
