const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');




// const app = express();
app.use(cors())
 app.use(express.json());

 app.use(express.static('public'));

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
// login 

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
// signup
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
// file upload

const storage = multer.diskStorage({
  destination: (req, res, cd) =>{
    return cd(null, 'public/image')
  },
  filename: (req, file, cd)=>{

    return cd(null, `${Date.now()}_${file.originalname}`)
  }
});
const upload = multer({storage});


app.post('/upload',upload.single('file'), (req, res) => {
  const sql = "INSERT INTO product(`product_name`,`price`,`discription`,`photo`) VALUES(?)";
  const values = [
    req.body.name,
    req.body.price,
    
    req.body.discription,
    req.file.filename
  ];
  db.query(sql,[values], (err, data) => {
    if (err) 
      return res.json({ error: "error signup query" });
    
    return res.json({ Status: "Success" });
  });

});

// app.post('/upload',upload.single('image'), (req, res) => {
// const image = req.file.filename;
// const sql = "UPDATE product SET photo = ?";
// db.query(sql, [image],(err, result)=>{
//   if(err) return res.json({Message: "Error"});
//   return res.json({Status: "Success"});
// })
// })



// shop page
app.get('/card', (req, res) => {
  const sql = "SELECT * FROM product";
  db.query(sql,(err,result)=>{
    if(err) return res.json("Error");
    return res.json(result);
  })
})

// add to card 
app.get('/card/:productId', (req, res) => {
  const productId = req.params.productId;
  const sql = "SELECT * FROM product WHERE productId = ?";
  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ error: "Error fetching product" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json(result[0]); // Assuming productId is unique, return the first row
  });
});



// display

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