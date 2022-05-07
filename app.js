const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const ejs = require('ejs')
const mysql = require('mysql')
const app = express()


//creating database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'userinfo'
})
connection.connect(function(error){
    if (!error) console.log('Database Connected')
    else console.log(error)
})

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//route for user index page
app.get('/',(req, res) => {
    let sql = "SELECT * FROM userinfo.projects"
    let query = connection.query(sql, (err, rows) =>{
        if (err) console.log('connection unsuccessful');
        else console.log('query ran')
        res.render('user_index', {
            title : 'CRUD Project',
            projects : rows
        })
    })
});

//set add route
app.get('/add', (req,res) =>{
    res.render('user_add', {
        title : 'Add new projects'
    })
})

//post used to  change data
app.post('/save', (req,res) => {
    let data = {
        project_title: req.body.projectTitle,
        project_description: req.body.description,
        project_start_dt: req.body.start,
        project_due_dt: req.body.due
    }
    let sql = "INSERT INTO userinfo.projects SET ?"
    let query = connection.query(sql, data, (err, results) =>{
        if(err) throw err
        res.redirect('/')
    })
})

//delete route
app.get('/delete/:userId',(req,res)=> {
    const userId = req.params.userId
    let sql = `DELETE FROM userinfo.projects WHERE id = ${userId}`
    let query = connection.query(sql, (err, result) =>{
        if (err) throw err
        //redirect to home after deletion
       res.redirect('/')
    })
})

//edit page
app.get('/edit/:userId',(req,res)=> {
    const userId = req.params.userId
    let sql = `SELECT * FROM userinfo.projects WHERE id = ${userId}`
    let query = connection.query(sql, (err, result) =>{
        if (err) throw err
        res.render('user_edit', {
            title: 'Edit page',
            projects: result[0]

        })
    })
})

//update page
app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update userinfo.projects SET project_title='"+req.body.projectTitle+"', project_description='"+req.body.description+"', project_start_dt='"+req.body.start+"', project_due_dt= '"+req.body.due+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      //update page redirected to home
      res.redirect('/');
    });
});

//dealing with the notes table

//view notes route
app.get('/view-notes',(req,res) => {
    let sql = "SELECT * FROM userinfo.notes"
    let query = connection.query(sql, (err, rows) =>{
        if (err) throw err
        else console.log("notes page successful");
        res.render('page_w_notes',{
            title: 'View Notes',
            notes: rows
        })
    }) 
})

//update notes
app.post('/update-notes', (req,res) =>{
    const userId = req.body.id
    let sql = "update userinfo.notes SET note='"+req.body.note+"', active_date='"+req.body.date+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      //update page redirected to notes page
      res.redirect('/view-notes');
    });
})


//add notes route
app.get('/add-notes', (req,res)=> {
    res.render('notes', {
        title: 'Add a note'
    })
})

//post to change notes data
app.post('/save-notes', (req,res) => {
        let data = {
            id: req.body.noteId,
            note: req.body.note,
            active_date: req.body.date,
            project_id: req.body.projectId
        }
    let sql = `INSERT INTO userinfo.notes SET ?`
    let query = connection.query(sql, data, (err, results) =>{
        if(err) throw err
        res.redirect('/view-notes')
    })
})

app.get('/add-notes/:referenceId',(req,res) => {
    const referenceId = req.params.referenceId
    let sql = `SELECT * FROM userinfo.notes WHERE project_id= ${referenceId}`
    let query = connection.query(sql, (err, rows) =>{
        if (err) throw err
        else console.log("notes page successful");
        res.render('notes',{
            title: 'View Notes',
            notes: rows
        })
    }) 
})

app.get('/see-notes/:referenceId',(req,res) => {
    const referenceId = req.params.referenceId
    let sql = `SELECT * FROM userinfo.notes WHERE project_id= ${referenceId}`
    let query = connection.query(sql, (err, rows) =>{
        if (err) throw err
        else console.log("notes page successful");
        res.render('page_w_notes',{
            title: 'View Notes',
            notes: rows
        })
    }) 
})

//delete note route
app.get('/delete-note/:userId',(req,res)=> {
    const userId = req.params.userId
    let sql = `DELETE FROM userinfo.notes WHERE id = ${userId}`
    let query = connection.query(sql, (err, result) =>{
        if (err) throw err
        //redirect to notes page after deletion
       res.redirect('/view-notes')
    })
})
//edit note
app.get('/edit-note/:userId',(req,res)=> {
    const userId = req.params.userId
    let sql = `SELECT * FROM userinfo.notes WHERE id = ${userId}`
    let query = connection.query(sql, (err, result) =>{
        if (err) throw err
        res.render('edit_note', {
            title: 'Edit page',
            notes: result[0]

        })
    })
})


//server listening
app.listen (3000, () => {
    console.log('Server is running at port 3000')
})
