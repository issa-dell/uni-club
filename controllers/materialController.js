const db = require('../config/db');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const getAllmaterials = async (req, res) => {
    try {
        const successMessage = req.query.success ? 'added succ' : null;
        const [rows] = await db.query('SELECT * FROM materials');
        res.render('materials/index', { successMessage: successMessage });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching materials from database');
    }
};

const showAllMaterials = async (req, res) => {
    try {
        const [lows] = await db.execute('SELECT userRole FROM users WHERE userName = ?', [req.session.user.userName]);
        const userRole = lows[0].userRole;
        const userSession = req.session.user.userName;
        const academyYears = req.query.academyYears;

        if (academyYears) {
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

const renderNewmaterialForm = (req, res) => {
    res.render('materials/new'); 
};

const creatematerial = async (req, res) => {
    try {
        const { title, academy_years, language, materialCourse } = req.body;
        
        if (!req.file) {
            return res.status(400).send("Error: Please upload a file for the material");
        }

        const fileExtension = path.extname(req.file.originalname).toLowerCase(); 
        if (fileExtension !== '.pdf') {
            return res.status(400).send("Error: Please upload a PDF for the material");
        }

        const fileName = `${Date.now()}-${req.file.originalname}`;
        const { error: uploadError } = await supabase.storage
            .from('materials')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
            .from('materials')
            .getPublicUrl(fileName);

        const filePublicUrl = publicUrlData.publicUrl;

        await db.query(
            'INSERT INTO materials (title, file_path, language, academy_years, course_id, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, filePublicUrl, language, academy_years, materialCourse, req.session.user.id]
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

        const [rows] = await db.execute(
            'SELECT materials.*, users.userName FROM materials JOIN users ON materials.user_id = users.id WHERE materials.id = ?', 
            [materialId]
        );
        
        if (rows.length === 0) {
            return res.status(404).send("Material not found");
        }

        const material = rows[0]; // تعريف متغير material هنا بوضوح

        const [lows] = await db.execute('SELECT userRole FROM users WHERE userName = ?', [req.session.user.userName]);
        if (lows.length === 0) {
            return res.status(403).send("Unauthorized user");
        }
        const userRole = lows[0].userRole;          

        if (material.userName !== req.session.user.userName && userRole !== "admin") {
            return res.status(403).send("You do not have permission to delete this material");
        }

        try {
            const filePath = material.file_path || material.file_url; 
            
            if (filePath) {
                let fileName = filePath;
                if (filePath.includes('/materials/')) {
                    fileName = filePath.split('/materials/').pop();
                } else {
                    fileName = filePath.split('/').pop();
                }

                fileName = decodeURIComponent(fileName);
                console.log("Attempting to delete file from Supabase exact name:", fileName);

                const { error: storageErr } = await supabase.storage
                    .from('materials')
                    .remove([fileName]);

                if (storageErr) {
                    console.error("Error deleting file from Supabase storage:", storageErr);
                } else {
                    console.log("File deleted successfully from Supabase storage");
                }
            }
        } catch (storageErr) {
            console.error("Exception during Supabase file deletion:", storageErr);
        }

        await db.execute('DELETE FROM materials WHERE id = ?', [materialId]);

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
