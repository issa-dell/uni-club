const db = require('../config/db');



const sayHelloFromCourses = async(req,res)=>{
    res.render('courses', { title: 'Courses' })
}




const getAllCourses = async(req,res) =>{
    try{
        const [rows] = await db.query('SELECT * FROM courses')
        res.render('courses',{courses: rows})
    } catch(err){
        console.error(err);
        res.status(500).send('Error fetching materials from database');
    }
}






module.exports = {
    sayHelloFromCourses,
    getAllCourses,
};