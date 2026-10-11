const db = require('../config/db');
const path = require('path');
const fs = require('fs');

const getAllmaterials = async (req, res) => {
    try {
        const successMessage = req.query.success ? 'added succ' : null;
        const [rows] = await db.query('SELECT * FROM materials');
        res.render('materials/index',{successMessage : successMessage});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching materials from database');
    }
};

const showAllMaterials =  async (req,res)=>{
    try{
        const [lows] = await db.execute('SELECT userRole FROM users WHERE userName =?',[req.session.user.userName]);
        const userRole =lows[0].userRole 
        const userSession =req.session.user.userName
        const academyYears = req.query.academyYears
        if(academyYears){
            const [rows] = await db.query('SELECT materials.*, users.userName FROM materials JOIN users ON materials.user_id = users.id WHERE 	academy_years = ?',[academyYears]);
            return res.render('showMaterials', {
            materials: rows,
            userSession: userSession,
            userRole: userRole

        })
        }else{
            console.log('false')
        }
        
        const [rows] = await db.query('SELECT materials.*, users.userName FROM materials JOIN users ON materials.user_id = users.id');
 
        res.render('showMaterials', {
            materials: rows,
            userSession: userSession,
            userRole: userRole

        })
    }catch (err){
        console.error(err);
        res.status(500).send('Error fetching materials from database');
    }
};

const renderNewmaterialForm = (req, res) => {
    res.render('materials/new'); 
};

const creatematerial = async (req, res) => {
    try {
        const { title, academy_years, language, materialCourse } = req.body;
        if(!req.file){
            res.status(400).send("Error:Please upload a file for the material")
        }
        const file_path =`/uploads/${req.file.filename}`;
        const fileExtension = path.extname(req.file.originalname).toLowerCase(); 
        if (fileExtension !== '.pdf') {
            return res.status(400).send("Error: Please upload a PDF for the material");
        }
        await db.query(
            'INSERT INTO materials (title, file_path, language, academy_years, course_id, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, file_path, language, academy_years,materialCourse,req.session.user.id]
        );

        res.redirect('/materials?success=true');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating new material');
    }
};



const deletematerial = async (req, res) => {
    try {
        const materialId = req.params.id;

        const [rows] = await db.execute('SELECT materials.*, users.userName FROM materials JOIN users ON materials.user_id = users.id WHERE materials.id = ?',[materialId]);
        const [lows] = await db.execute('SELECT userRole FROM users WHERE userName =?',[req.session.user.userName]);
        const userRole =lows[0].userRole        
        if (rows.length > 0) {
            const material = rows[0];

            if(material.userName !=req.session.user.userName &&userRole !="admin"){
                return res.status(403).send("You do not have permission deleted this materilas")
            }
            const filePath = path.join(__dirname, '../public', material.file_path);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); 
            }

            await db.execute('DELETE FROM materials WHERE id = ?', [materialId]);
        }

        res.redirect('/materials/list');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error during deletion');
    }
};







module.exports = {
    getAllmaterials,
    renderNewmaterialForm,
    creatematerial,
    deletematerial,
    showAllMaterials,

};