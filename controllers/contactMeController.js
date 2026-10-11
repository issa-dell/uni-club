const goToContact = async(req,res) =>{
    res.render('contactMe', { title: 'Contact Me' });
}
module.exports = {
    goToContact,
}