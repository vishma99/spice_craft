/* eslint-disable no-undef */
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// const upload = multer({ storage: multer.memoryStorage() });

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const bodyParser = require('body-parser');
const { SessionsClient } = require('@google-cloud/dialogflow');
const port = 5000;

app.use(bodyParser.json());

const projectId = 'your-project-id'; // Replace with your Dialogflow project ID
const sessionClient = new SessionsClient({ projectId });

app.post('/api/dialogflow', async (req, res) => {
  const { text } = req.body;
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, 'unique-session-id');

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: 'en-US',
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json(result);
  } catch (error) {
    console.error('Error sending message to Dialogflow:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

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
  database: "spicecraft",
});

// Connect to the database
db.connect(function (err) {
  if (err) {
    console.log(err);
  }
  console.log("connected");
});
// login

// app.post("/register", (req, res) => {
//   const sql =
//     "INSERT INTO registercustomer(`name`,`email`,`contactNumber`,`address`,`username`,`password`) VALUES(?)";
//   const values = [
//     req.body.name,
//     req.body.email,
//     req.body.contactNumber,
//     req.body.address,
//     req.body.username,
//     req.body.password,
//   ];
//   db.query(sql, [values], (err, data) => {
//     if (err) return res.json(err);
//     return res.json(data);
//   });
// });

app.post("/register", async (req, res) => {
  const { name, email, contactNumber, address, username, password } = req.body;

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql =
      "INSERT INTO registercustomer(`name`,`email`,`contactNumber`,`address`,`username`,`password`) VALUES(?)";
    const values = [
      name,
      email,
      contactNumber,
      address,
      username,
      hashedPassword,
    ];

    db.query(sql, [values], (err, data) => {
      if (err) return res.json({ error: err.message });
      return res.json({ status: "success", data });
    });
  } catch (err) {
    return res.json({ error: err.message });
  }
});

// signup
const SECRET_KEY = "your_secret_key"; // Change this to your actual secret key

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM registercustomer WHERE `email` = ?";

  db.query(sql, [email], async (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.json({ error: err.message });
    }
    if (data.length > 0) {
      const user = data[0];

      console.log("User found:", user);

      try {
        // Compare provided password with hashed password in database
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          console.log("Passwords match");
          // Passwords match, generate a JWT token
          const token = jwt.sign(
            {
              id: user.id,
              username: user.username,
              email: user.email,
              address: user.address,
              contactNumber: user.contactNumber,
              customerId: user.customerId,
            },
            SECRET_KEY,
            { expiresIn: "24h" }
          );
          return res.json({ status: "success", token });
        } else {
          console.log("Passwords do not match");
          return res.json({ status: "fail", message: "Invalid credentials" });
        }
      } catch (compareError) {
        console.error("bcrypt compare error:", compareError);
        return res.json({
          status: "fail",
          message: "Error comparing passwords",
        });
      }
    } else {
      console.log("User not found");
      return res.json({ status: "fail", message: "User not found" });
    }
  });
});

//admin log

app.post("/admin", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM admin WHERE `email` = ?";

  db.query(sql, [email], async (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.json({ error: err.message });
    }
    if (data.length > 0) {
      const user = data[0];

      console.log("User found:", user);

      try {
        // Compare provided password with hashed password in database
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          console.log("Passwords match");
          // Passwords match, generate a JWT token
          const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            SECRET_KEY,
            { expiresIn: "24h" }
          );
          return res.json({ status: "success", token });
        } else {
          console.log("Passwords do not match");
          return res.json({ status: "fail", message: "Invalid credentials" });
        }
      } catch (compareError) {
        console.error("bcrypt compare error:", compareError);
        return res.json({
          status: "fail",
          message: "Error comparing passwords",
        });
      }
    } else {
      console.log("User not found");
      return res.json({ status: "fail", message: "User not found" });
    }
  });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(500).json({ error: "Failed to authenticate token" });
    req.userId = decoded.id;
    next();
  });
};

// Get cart items for a customer
// app.get("/cart/:customerId", verifyToken, (req, res) => {
//   const customerId = req.params.customerId;
//   const sql = "SELECT * FROM cart WHERE customerId = ?";
//   db.query(sql, [customerId], (err, result) => {
//     if (err) {
//       console.error("Error fetching cart items:", err);
//       return res.status(500).json({ error: "Error fetching cart items" });
//     }
//     return res.json(result);
//   });
// });

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

// app.post("/addProduct", upload.single("file"), (req, res) => {
//   const sql =
//     "INSERT INTO product(`product_name`,`price`,`discription`,`photo`) VALUES(?)";
//   const values = [
//     req.body.name,
//     req.body.price,

//     req.body.discription,
//     req.file.filename,
//   ];
//   db.query(sql, [values], (err, data) => {
//     if (err) return res.json({ error: "error signup query" });

//     return res.json({ Status: "Success" });
//   });
// });

app.use(express.json());

app.post("/addProduct", upload.single("photo"), (req, res) => {
  const { product_name, price, discription } = req.body;

  console.log("Received fields:", req.body);
  console.log("Received file:", req.file);

  // if (!req.file) {
  //   return res.status(400).json({ error: 'Photo is required' });
  // }

  const photo = req.file.filename;
  console.log("photo", photo);

  const sql =
    "INSERT INTO product(product_name, price, discription, photo) VALUES (?, ?, ?, ?)";
  const values = [product_name, price, discription, photo];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({
      success: true,
      product: { id: result.insertId, product_name, price, discription },
    });
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
app.get("/card/:productId/:userId?", (req, res) => {
  const { productId, userId } = req.params;
  const sql =
    "SELECT product.*, cart.quantity FROM product LEFT JOIN cart ON cart.productId = product.productId AND cart.customerId = ? WHERE product.productId = ?";
  db.query(sql, [userId, productId], (err, result) => {
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

// delete item
app.delete("/cart/:customerId/:productId", (req, res) => {
  const { customerId, productId } = req.params;
  const sql = "DELETE FROM cart WHERE customerId = ? AND productId = ?";
  db.query(sql, [customerId, productId], (err, result) => {
    if (err) {
      console.error("Error deleting cart item:", err);
      return res.status(500).json({ error: "Error deleting cart item" });
    }
    return res.json({
      success: true,
      message: "Cart item deleted successfully",
    });
  });
});

//add to cart

// app.post("/addtocart", verifyToken, (req, res) => {
//   const {
//     userId,
//     productId,
//     quantity,
//     name,
//     price,
//     size,
//     photo,
//     description,
//   } = req.body;
//   const sqlCheck = "SELECT * FROM cart WHERE customerId = ? AND productId = ?";
//   const sqlInsert =
//     "INSERT INTO cart (customerId, productId, quantity, name, price, size, photo, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
//   const sqlUpdate =
//     "UPDATE cart SET quantity = quantity + ? WHERE customerId = ? AND productId = ?";

//   db.query(sqlCheck, [userId, productId], (err, result) => {
//     if (err) {
//       console.error("Error checking cart:", err);
//       return res.status(500).json({ error: "Error checking cart" });
//     }
//     if (result.length > 0) {
//       db.query(
//         sqlUpdate,
//         [quantity, userId, productId],
//         (err, updateResult) => {
//           if (err) {
//             console.error("Error updating cart:", err);
//             return res.status(500).json({ error: "Error updating cart" });
//           }
//           return res.json({
//             success: true,
//             message: "Cart updated successfully",
//           });
//         }
//       );
//     } else {
//       db.query(
//         sqlInsert,
//         [
//           userId,
//           productId,
//           quantity,
//           name,
//           price,
//           size,
//           photo,
//           description,
//         ],
//         (err, insertResult) => {
//           if (err) {
//             console.error("Error adding to cart:", err);
//             return res.status(500).json({ error: "Error adding to cart" });
//           }
//           return res.json({
//             success: true,
//             message: "Item added to cart successfully",
//           });
//         }
//       );
//     }
//   });
// });

// Search endpoint
app.get("/search", (req, res) => {
  const { keyword } = req.query;
  const sql = "SELECT * FROM product WHERE product_name LIKE ? OR discription LIKE ?";
  const searchValue = `%${keyword}%`;

  db.query(sql, [searchValue, searchValue], (err, result) => {
    if (err) {
      console.error("Error fetching search results:", err);
      return res.status(500).json({ error: "Error fetching search results" });
    }
    return res.json(result);
  });
});

app.post("/addtocart", (req, res) => {
  const { customerId, productId, quantity, size } = req.body;
  const sqlCheck = "SELECT * FROM cart WHERE customerId = ? AND productId = ?";
  const sqlInsert =
    "INSERT INTO cart (customerId, productId, quantity, size) VALUES (?, ?, ?, ?)";
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
        [customerId, productId, quantity, size],
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
app.get("/cart/:customerId", verifyToken, (req, res) => {
  const customerId = req.params.customerId;
  const sql =
    "SELECT * FROM cart JOIN product ON cart.productId = product.productId WHERE cart.customerId = ?";
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error("Error fetching cart items:", err);
      return res.status(500).json({ error: "Error fetching cart items" });
    }
    return res.json(result); // Assuming `result` is an array of cart items
  });
});

// app.get("/cart/:customerId", verifyToken, (req, res) => {
//   const customerId = req.params.customerId;
//   const sql =
//     "SELECT * FROM cart JOIN product ON cart.productId = product.productId WHERE cart.customerId = ?";
//   db.query(sql, [customerId], (err, result) => {
//     if (err) {
//       console.error("Error fetching cart items sever:", err); // Detailed error log
//       return res
//         .status(500)
//         .json({ error: "Error fetching cart items", details: err.message });
//     }
//     if (!result || result.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No items found in cart for this customer." });
//     }
//     return res.json(result);
//   });
// });

// app.get("/cart", verifyToken, (req, res) => {
//   const userId = req.userId; // Get userId from token via verifyToken middleware
//   const sql = "SELECT * FROM cart WHERE customerId = ?";
//   db.query(sql, [userId], (err, result) => {
//     if (err) {
//       console.error("Error fetching cart items:", err);
//       return res.status(500).json({ error: "Error fetching cart items" });
//     }
//     return res.json(result);
//   });
// });

//add to cart

// app.get('/addtocart', (req, res) => {
//   const productId = req.params.productId;
//   const sql = "SELECT * FROM product WHERE productId = ?";
// })

// display

app.get("/registercustomerAdmin", (req, res) => {
  const sql = "SELECT * FROM registercustomer";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/productAdmin", (req, res) => {
  const sql = "SELECT * FROM product";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.get("/orderAdmin", (req, res) => {
  const sql = "SELECT * FROM cart";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.get("/inquiryAdmin", (req, res) => {
  const sql = "SELECT * FROM inquiry";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// review

app.post("/review", upload.single("file"), (req, res) => {
  const sql = "INSERT INTO review(`comment`,`name` ,`rating`) VALUES(?)";
  const values = [req.body.comment, req.body.name, req.body.rating];
  db.query(sql, [values], (err, data) => {
    if (err) return res.json({ error: "error signup query" });

    return res.json({ Status: "Success" });
  });
});

// get review

app.get("/reviewVisit", (req, res) => {
  const sql = "SELECT * FROM review";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//admin
//Add Route to Delete a User Account
app.delete("/registercustomerAdmin/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const sql = "DELETE FROM registercustomer WHERE customerId = ?";
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ error: "Error deleting user" });
    }
    return res.json({ success: true, message: "User deleted successfully" });
  });
});

// Modify Route to Add a Product

// app.post('/addproduct', upload.single('file'), (req, res) => {
//   const sql = 'INSERT INTO product( `productID`,`product_name`,`price`,`photo`) VALUES(?)';
//   const values = [
//     req.body.name,
//     req.body.price,
//     req.body.description,
//     req.file.filename,
//   ];
//   db.query(sql, [values], (err, data) => {
//     if (err) {
//       console.error("Error adding product:", err);
//       return res.status(500).json({ error: "Error adding product" });
//     }
//     return res.json({ success: true, message: "Product added successfully" });
//   });
// });

app.listen(8088, () => {
  console.log("listening");
});
