const db = require('../config/db');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const fs = require('fs'); 

const getAllmaterials = async (req, res) => { //get materials function
    try {
        const successMessage = req.query.success ? 'added succ' : null; //Has a new material been uploaded?
        const [rows] = await db.query('SELECT * FROM materials');
        res.render('materials/index', { successMessage: successMessage });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching materials from database');
    }
};

const showAllMaterials = async (req, res) => { //show the materials
    try {
        const [lows] = await db.execute('SELECT userRole FROM users WHERE userName = ?', [req.session.user.userName]);
        const userRole = lows[0].userRole; //get user role from DB
        const userSession = req.session.user.userName; //get username from the session
        const academyYears = req.query.academyYears; //het acamedy year from req (for search)

        if (academyYears) { //user search?
            const [rows] = await db.query('SELECT materials.*, users.userName FROM materials JOIN users ON materials.user_id = users.id WHERE academy_years = ?', [academyYears]);
            return res.render('showMaterials', {
                materials: rows,
                userSession: userSession,
                userRole: userRole
            });
        }

        const [rows] = await db.query('SELECT materials.*, users.userName FROM materials JOIN users ON materials.user_id = users.id');
        res.render('showMaterials', {
            materials: rows,
            userSession: userSession,
            userRole: userRole
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching materials from database');
    }
};

const renderNewmaterialForm = (req, res) => { //add material function
    res.render('materials/new'); 
};

const creatematerial = async (req, res) => { 
    try {
        const { title, academy_years, language, materialCourse } = req.body;
        
        if (!req.file) { //Verify the existence of a file
            return res.status(400).send("Error: Please upload a file for the material");
        }

        const fileExtension = path.extname(req.file.originalname).toLowerCase(); // get file extension
        if (fileExtension !== '.pdf') {

            fs.unlinkSync(req.file.path); // Delete the temporary file
            return res.status(400).send("Error: Please upload a PDF for the material");
        }

        const fileName = `${Date.now()}-${req.file.originalname}`; //a unique name to prevent name collisions
        
        const fileBuffer = fs.readFileSync(req.file.path); // read the temporary file storage by Multer

        const { error: uploadError } = await supabase.storage // Contact supabase
            .from('materials')
            .upload(fileName, fileBuffer, { //upload file
                contentType: req.file.mimetype,
                upsert: false
            });

        fs.unlinkSync(req.file.path); // delet the temporary file after send him to supabase (Freeing up space)

        if (uploadError) throw uploadError; //Stop the process if an error occurs (go to catch)

        const { data: publicUrlData } = supabase.storage
            .from('materials')
            .getPublicUrl(fileName); // getting a file url to store in a database

        const filePublicUrl = publicUrlData.publicUrl;

        await db.query(
            'INSERT INTO materials (title, file_path, language, academy_years, course_id, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, filePublicUrl, language, academy_years, materialCourse, req.session.user.id]
        );

        res.redirect('/materials?success=true');
    } catch (err) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path); //delet the temporary file
        }
        res.status(500).send('Error creating new material');
    }
};

const deletematerial = async (req, res) => {
    try {
        const materialId = req.params.id; 

        const [rows] = await db.execute(
            'SELECT materials.*, users.userName FROM materials JOIN users ON materials.user_id = users.id WHERE materials.id = ?', 
            [materialId]
        );
        
   

        const material = rows[0];
        
        const [lows] = await db.execute('SELECT userRole FROM users WHERE userName = ?', [req.session.user.userName]);
        
        const userRole = lows[0].userRole;          

        if (material.userName !== req.session.user.userName && userRole !== "admin") { //Verify that the matrial belongs to its owner or that the user is an admin.
            return res.status(403).send("You do not have permission to delete this material");
        }

        try {
            const filePath = material.file_path;
            
                let fileName = filePath;
                if (filePath.includes('/materials/')) {// get the real name of the file
                    fileName = filePath.split('/materials/').pop();
                } else {
                    fileName = filePath.split('/').pop();
                }

                fileName = decodeURIComponent(fileName); //URL decoding to get the real name before uploading this file

                const { error: storageErr } = await supabase.storage
                    .from('materials')
                    .remove([fileName]); //delet file from supabase

                if (storageErr) { //Ensuring there are no errors
                    console.error("Error deleting file from Supabase storage:", storageErr);
                } else {
                    console.log("File deleted successfully from Supabase storage");
                }
            }
        } catch (storageErr) {
            console.error("Exception during Supabase file deletion:", storageErr);
        }

        await db.execute('DELETE FROM materials WHERE id = ?', [materialId]); //delet the material from database

        res.redirect('/materials/list');

    } catch (err) {
        console.error("Server Error during deletion:", err);
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
