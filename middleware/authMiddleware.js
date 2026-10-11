const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.isLoggedIn) {
        return next(); 
    }
    res.redirect('/auth/login');
};
module.exports = isAuthenticated;