const { connect, connection, set} = require('mongoose');

const db_connect = async (req,res) => {
    return connect("mongodb://localhost:27017/session_with_redis-demo-database")
}

connection.on('connected', () => {
    console.log('database connected');
})

module.exports = db_connect