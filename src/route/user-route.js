const {Router} = require('express');
const { signup, signupProcess, homePage, login, loginprocess, logout } = require('../controllers/user-controller');

const userRouter = Router({mergeParams:true});


userRouter.get('/signup', signup);

userRouter.post('/signup', signupProcess);

userRouter.get('/homepage', homePage);

userRouter.get('/login', login);

userRouter.post('/login', loginprocess);

userRouter.get('/logout', logout);


module.exports = userRouter;