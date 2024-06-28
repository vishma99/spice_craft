const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static("public"));

// Set up the connection to database
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "spicecraft (2)",
});

// Connect to the database
db.connect(function (err) {
  if (err) {
    console.log(err);
  }
  console.log("connected");
});
// login

app.post("/register", (req, res) => {
  const sql =
    "INSERT INTO registercustomer(`name`,`email`,`contactNumber`,`address`,`username`,`password`) VALUES(?)";
  const values = [
    req.body.name,
    req.body.email,
    req.body.contactNumber,
    req.body.address,
    req.body.username,
    req.body.password,
  ];
  db.query(sql, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// signup
app.post("/login", (req, res) => {
  const sql =
    "SELECT * FROM registercustomer WHERE `username` = ? AND `password` = ?";

  db.query(sql, [req.body.username, req.body.password], (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      return res.json("success");
    } else {
      return res.json("fail");
    }
  });
});

// file upload

const storage = multer.diskStorage({
  destination: (req, res, cd) => {
    return cd(null, "public/image");
  },
  filename: (req, file, cd) => {
    return cd(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const sql =
    "INSERT INTO product(`product_name`,`price`,`discription`,`photo`) VALUES(?)";
  const values = [
    req.body.name,
    req.body.price,

    req.body.discription,
    req.file.filename,
  ];
  db.query(sql, [values], (err, data) => {
    if (err) return res.json({ error: "error signup query" });

    return res.json({ Status: "Success" });
  });
});

//  inquiry
app.post("/inquiry", upload.single("file"), (req, res) => {
  const sql =
    "INSERT INTO inquiry(`name`,`contractNumber`,`email`,`message`) VALUES(?)";
  const values = [
    req.body.name,
    req.body.contractNumber,

    req.body.email,
    req.body.message,
  ];
  db.query(sql, [values], (err, data) => {
    if (err) return res.json({ error: "error signup query" });

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
app.get("/card", (req, res) => {
  const sql = "SELECT * FROM product";
  db.query(sql, (err, result) => {
    if (err) return res.json("Error");
    return res.json(result);
  });
});

// add to card
app.get("/card/:productId", (req, res) => {
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

//add to cart
app.post("/addtocart", (req, res) => {
  const {
    customerId,
    productId,
    quantity,
    name,
    price,
    size,
    photo,
    description,
  } = req.body;
  const sqlCheck = "SELECT * FROM cart WHERE customerId = ? AND productId = ?";
  const sqlInsert =
    "INSERT INTO cart (customerId, productId, quantity, name, price, size, photo, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const sqlUpdate =
    "UPDATE cart SET quantity = quantity + ? WHERE customerId = ? AND productId = ?";

  db.query(sqlCheck, [customerId, productId], (err, result) => {
    if (err) {
      console.error("Error checking cart:", err);
      return res.status(500).json({ error: "Error checking cart" });
    }
    if (result.length > 0) {
      db.query(
        sqlUpdate,
        [quantity, customerId, productId],
        (err, updateResult) => {
          if (err) {
            console.error("Error updating cart:", err);
            return res.status(500).json({ error: "Error updating cart" });
          }
          return res.json({
            success: true,
            message: "Cart updated successfully",
          });
        }
      );
    } else {
      db.query(
        sqlInsert,
        [
          customerId,
          productId,
          quantity,
          name,
          price,
          size,
          photo,
          description,
        ],
        (err, insertResult) => {
          if (err) {
            console.error("Error adding to cart:", err);
            return res.status(500).json({ error: "Error adding to cart" });
          }
          return res.json({
            success: true,
            message: "Item added to cart successfully",
          });
        }
      );
    }
  });
});

//get from cart

app.get("/cart/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const sql = "SELECT * FROM cart WHERE customerId = ?";
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error("Error fetching cart items:", err);
      return res.status(500).json({ error: "Error fetching cart items" });
    }
    return res.json(result);
  });
});

//add to cart

// app.get('/addtocart', (req, res) => {
//   const productId = req.params.productId;
//   const sql = "SELECT * FROM product WHERE productId = ?";
// })

// display

app.get('/registercustomerAdmin', (req, res)=>{
    const sql = "SELECT * FROM registercustomer";
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
        })
    })

    app.get('/productAdmin', (req, res)=>{
      const sql = "SELECT * FROM product";
      db.query(sql, (err, data)=> {
          if(err) return res.json(err);
          return res.json(data);
          })
      })
      app.get('/orderAdmin', (req, res)=>{
        const sql = "SELECT * FROM cart";
        db.query(sql, (err, data)=> {
            if(err) return res.json(err);
            return res.json(data);
            })
        })
        app.get('/inquiryAdmin', (req, res)=>{
          const sql = "SELECT * FROM inquiry";
          db.query(sql, (err, data)=> {
              if(err) return res.json(err);
              return res.json(data);
              })
          })

app.listen(8088, () => {
  console.log("listening");
});


//admin
// Add Route to Delete a User Account
app.delete('/registercustomerAdmin/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  const sql = 'DELETE FROM registercustomer WHERE customerId = ?';
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Error deleting user' });
    }
    return res.json({ success: true, message: 'User deleted successfully' });
  });
});

// Modify Route to Add a Product
app.post('/addproduct', upload.single('file'), (req, res) => {
  const sql = 'INSERT INTO product(`product_name`,`price`,`description`,`photo`) VALUES(?)';
  const values = [
    req.body.name,
    req.body.price,
    req.body.description,
    req.file.filename,
  ];
  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({ error: 'Error adding product' });
    }
    return res.json({ success: true, message: 'Product added successfully' });
  });
});
