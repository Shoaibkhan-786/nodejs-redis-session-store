const express = require('express');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
var bodyParser = require('body-parser');

const db_connect = require('./utils/db_connection')(session);
const indexRouter = require('./route/user-route');

const app = express();
const port = 8000;

app.use(express.static("public"));
app.set('views', 'src/views')
app.set('view engine', 'ejs');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('trust proxy', 1); // enable this if you run behind a proxy (e.g. nginx)
const RedisStore = connectRedis(session)

//Configure redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

//Configure session middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret$%^134',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
}))


app.use(indexRouter);

db_connect.
then(() => {
    app.listen(port, () => {
        console.log(`server is up and running on port ${port}`);
    });
})
.catch(() => {
    console.log('something went wrong while connecting database');
})

