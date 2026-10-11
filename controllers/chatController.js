const messageComing = async (req, res) =>{
    res.render('chat', { title: 'chat' });
};

module.exports = {
    messageComing
};