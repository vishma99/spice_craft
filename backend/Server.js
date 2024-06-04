const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require('cors');



// const app = express();
app.use(cors())
 app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: '',
    database:'spicecraft'
});


db.connect(function (err){
    if(err) {
      console.log(err);}
    console.log("connected");
    
})

app.post('/register', (req, res) => {
  const sql = "INSERT INTO registercustomer(`name`,`email`,`contactNumber`,`address`,`username`,`password`) VALUES(?)";
  const values = [
    req.body.name,
    req.body.email,
    req.body.contactNumber,
    req.body.address,
    req.body.username,
    req.body.password
  ]
  db.query(sql, [values],(err,data)=>{
    if(err) return res.json(err);
    return res.json(data);
  })
})
app.post('/login', (req, res) => {
  const sql = "SELECT * FROM registercustomer WHERE `username` = ? AND `password` = ?";

  db.query(sql, [req.body.username,req.body.password],(err,data)=>{
    if(err) return res.json(err);
    if(data.length > 0 ){
      return res.json("success");
    }
    else{
      return res.json("fail");
    }
  })
})





// app.get('/registercustomer', (req, res)=>{
//     const sql = "SELECT * FROM registercustomer";
//     db.query(sql, (err, data)=> {
//         if(err) return res.json(err);
//         return res.json(data);
//         })
//     })


// app.get('/',(re,res)=> {
//     return res.json("from back end");
// })






app.listen(8088, ()=>{
    console.log("listening");
})