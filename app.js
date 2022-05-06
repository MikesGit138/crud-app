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

//set save route
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

//add notes route
app.get('/add-notes', (req,res)=> {
    res.render('notes', {
        title: 'Add a note'
    })
})

//save-notes page
// app.post('/save-notes', (req,res) => {
//     const projectId = req.params.project_id
//     let data = {
//         note: req.body.note,
//         active_date: req.body.date,
//         // project_id: req.body.noteid
//     }
//     let sql = "UPDATE userinfo.notes SET note='"+req.body.note+"', active_date='"+req.body.date+"' WHERE project_id='"+projectId+"' "
//     let query = connection.query(sql, data, (err, results) =>{
//         if(err) throw err
//         res.redirect('/')
//     })
// })



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

//server listening
app.listen (3000, () => {
    console.log('Server is running at port 3000')
})
