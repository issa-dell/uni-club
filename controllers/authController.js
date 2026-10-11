const db = require('../config/db');
const bcrypt = require('bcrypt');

const getRegisterPage = (req, res) => {
    res.render('register', { title: 'Register' });
};

const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const [existingUsers] = await db.execute('SELECT * FROM users WHERE userName = ?', [username]);

        if (existingUsers.length > 0) {
            return res.render('register', { 
                title: 'new acc', 
                errorMessage: 'this user name is already used'
            });
        }
        
        const digitCount = (password.match(/\d/g) || []).length;
        if(password.length <8 || digitCount <3){
            return res.render('register',{
                title: 'register',
                errorPassword: 'set a password 8 char with 3 number'
            })
        }



        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        res.redirect('login')






    } catch (err) {
        console.error(err);
        res.status(500).send('error with login');
    }
};


const getLoginPage = (req, res) => {
    res.render('login', { title: 'Login' });
};

const loginUser = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const [rows] = await db.execute('SELECT * FROM users WHERE userName = ?', [userName]);
        const user = rows[0];

        if (rows.length === 0) {
            return res.render('login',{
                title: 'login',
                errorUserNotFound: 'user not fond'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send('password incorrect');
        }


        req.session.user = {
            id: user.id,
            userName: user.userName,
        };
        req.session.isLoggedIn = true;


        req.session.save((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving session');
        }
        res.redirect('/uni-club');
        });



        

    } catch (err) {
        console.error(err);
        res.status(500).send('error with login');
    }
};




module.exports = {
    getRegisterPage,
    registerUser,
    getLoginPage,
    loginUser,
};