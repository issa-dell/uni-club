const getUniClubHome = (req, res) => {
    res.render('uniClub', { 
        title:'uni-club',
        user: req.session.user 
    });
};


module.exports = {
    getUniClubHome
};