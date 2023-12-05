const { config } = require("./src/configs/db.config")

require("dotenv").config()


module.exports={
    client:"mysql2",
    connection:{
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.MIGRATION_DB,
    },
    migrations :{
        tableName:process.env.MIGRATION_DB,
        directory:process.env.MIGRATION_DIR,
    },
    seeds:{
        directory:process.env.SEEDS_DIR
    },
    pool:{
        min:Number(process.env.DB_POOL_MIN),
        max:Number(process.env.DB_POOL_MAX)
    },
    acquireConnectionTimeout:Number(process.env.DB_TIMEOUT)
}