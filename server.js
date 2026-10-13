const express = require('express');
require('dotenv').config();
const db = require('./config/db'); 
const app = express();
const PORT = process.env.PORT || 3000;


const session = require('express-session');

app.use(session({
    secret: 'uni-club-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24 
    }
}));



app.use(express.urlencoded({ extended: true }));

const materialRoutes = require('./routes/materialRoutes');
const contactMeRoutes = require('./routes/contactMeRoutes')
const chatRoutes =require('./routes/chatRoutes')
const coursesRoutes =require('./routes//coursesRoutes')
const authRoutes = require('./routes/authRoutes');
const signOutRoutes = require('./routes/signOutRoutes')
const showAccRoutes = require('./routes/showAccRoutes')
const uniClubRoutes = require('./routes/uniClubRoutes');


app.set('view engine', 'ejs');


app.use(express.json());
app.use('/materials', materialRoutes);
app.use('/contactMe', contactMeRoutes);
app.use('/chat', chatRoutes);
app.use('/courses', coursesRoutes);
app.use('/auth', authRoutes);
app.use('/signout', signOutRoutes);
app.use('/profile', showAccRoutes);
app.use('/', uniClubRoutes);







app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT NOW() AS currentTime');
        res.send(`<h1>welcome to Uni-Club! </h1><p>connected succ: ${rows[0].currentTime}</p>`);
    } catch (err) {
        console.error(err);
        res.status(500).send('error with connect to dataBase');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
});
