const db = require('../config/db');
const getAllInfo = async(req,res) =>{
    try{
    const username = req.params.username;
    const [rows] = await db.query('SELECT * FROM users where userName = ?',[username])
    const userData = rows[0]
    const userId = userData.id
    const userName = userData.userName
    const accDate = userData.created_at
    const userRole = userData.userRole
    res.render('showInfo',{
        userName : userName,
        userId : userId,
        userRole: userRole,
        accDate : accDate,
    })
    if (rows.length === 0) {
        return res.status(404).send('User not found');
    }

    } catch (err){
        console.error(err);
        res.status(500).send('Server Error');
    }
}
module.exports = {
    getAllInfo,
};