const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const ejs = require('ejs')
const mysql = require('mysql')
const { userInfo } = require('os')
const { constants } = require('buffer')
const app = express()

// app.get('/', (req, res) => {
//     res.send('CRUD APP')
// })


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
    // })
        res.render('user_index', {
            title : 'CRUD Project',
            projects : rows
        })
    })
});

app.get('/add', (req,res) =>{
    res.render('user_add', {
        title : 'Add new projects'
    })
})

// app.post('/save', (req,res) => {
//     let data = {
//         pro_title: req.body.projectTitle,
//         pro_description: req.body.description,
//         pro_start: req.body.start,
//         pro_due: req.body.due
//     }
//     let sql = "INSERT INTO projects SET ?"
//     let query = connection.query(sql, data, (err, results) =>{
//         if(err) throw err
//         res.redirect('/')
//     })
// })

//server listening
app.listen (3000, () => {
    console.log('Server is running at port 3000')
})
