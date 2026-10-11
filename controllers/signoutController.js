const signOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Could not log out.');
        }
        
        res.clearCookie('connect.sid'); 
        res.redirect('/auth/login');
    });
};

module.exports = {
    signOut,
};