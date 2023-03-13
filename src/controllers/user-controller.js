const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');

exports.signup = async (req,res,next) => {
    try {
        if(req.session.user) {
            res.redirect('/logout')
        }
        else {
            res.render("pages/signup", {
                isLoggedIn: false,
                "error": ""
            });
        }
    } catch (error) {
        next(error)
    }
}


exports.signupProcess = async (req,res,next) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if(first_name && last_name && email && password) {
            const checkUser = await userModel.findOne({email: email}).lean();
            if(!checkUser) {
                const newUser = await userModel.create(req.body);
                req.session.user = newUser._id;
                res.redirect('/homepage');
            } else {
                res.render("pages/signup", {
                    "error": "User from that email already exist",
                    isLoggedIn: false
                } )
            }
        }
        else {
            res.render("pages/signup", {
                isLoggedIn: false,
                "error": "please enter all the field"
            });
        }
    } catch (error) {
        next(error)
    }
}


exports.homePage = async (req,res,next) => {
    try {
        if(req.session.user) {
            const user = await userModel.findById(req.session.user).lean();
            res.render("pages/home", {
                name: user.first_name + " " + user.last_name,
                isLoggedIn: true
            })
        } else {
            res.redirect('/login');
        }
        
    } catch (error) {
        next(error)
    }
}

exports.login = async (req,res,next) => {
    try {
        if(req.session.user) {
            res.redirect('/logout');
        } else {
            res.render('pages/login', {
                "error": "",
                isLoggedIn: false
            })
        }
        
    } catch (error) {
        next(error)
    }
}


exports.loginprocess = async (req,res,next) => {
    try {
        const { email, password } = req.body;

        if(email && password) {
            const checkUser = await userModel.findOne({email:email}, '_id password').lean();

            if(checkUser === null) {
                res.render("pages/login", {
                    "error": 'please provide valid email',
                    isLoggedIn: false
                })
            }
            
            const validatePassword = await bcrypt.compare(password, checkUser.password);
            if(!validatePassword) {
                res.render('pages/login', {
                    "error": 'please enter correct password',
                    isLoggedIn: false
                })
            }

            req.session.user = checkUser._id;
            res.redirect('/homepage');
        } else {
            res.render('pages/login', {
                "error": 'please fill all the field',
                isLoggedIn: false
            })
        }
    } catch (error) {
        next(error)
    }
}


exports.logout = async (req,res,next) => {
    req.session.destroy();
    res.redirect('/login');
}
