/* eslint-disable no-undef */
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");

// const upload = multer({ storage: multer.memoryStorage() });

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const bodyParser = require("body-parser");
const { SessionsClient } = require("@google-cloud/dialogflow");
const { data } = require("autoprefixer");
const { error } = require("console");
const { comment } = require("postcss");
const port = 5000;

app.use(bodyParser.json());

const projectId = "your-project-id"; // Replace with your Dialogflow project ID
const sessionClient = new SessionsClient({ projectId });

app.post("/api/dialogflow", async (req, res) => {
  const { text } = req.body;
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    "unique-session-id"
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: "en-US",
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json(result);
  } catch (error) {
    console.error("Error sending message to Dialogflow:", error);
    res.status(500).json({ error: "Failed to process message" });
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

app.post("/register", async (req, res) => {
  const { name, email, contactNumber, address, username, password } = req.body;

  try {
    // First, check if the email already exists in the database
    const checkEmailQuery = "SELECT * FROM registercustomer WHERE email = ?";
    db.query(checkEmailQuery, [email], async (err, result) => {
      if (err) return res.json({ error: err.message });

      if (result.length > 0) {
        // Email already exists
        return res.status(400).json({ error: "Email already in use" });
      } else {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        const insertQuery =
          "INSERT INTO registercustomer(`name`, `email`, `contactNumber`, `address`, `username`, `password`) VALUES(?)";
        const values = [
          name,
          email,
          contactNumber,
          address,
          username,
          hashedPassword,
        ];

        db.query(insertQuery, [values], (err, data) => {
          if (err) return res.json({ error: err.message });
          return res.json({ status: "success", data });
        });
      }
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

app.use(express.json());

app.post("/addProduct", upload.single("photo"), (req, res) => {
  const { product_name, price, discription } = req.body;

  console.log("Received fields:", req.body);
  console.log("Received file:", req.file);

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

// Search endpoint
app.get("/search", (req, res) => {
  const { keyword } = req.query;
  const sql =
    "SELECT * FROM product WHERE product_name LIKE ? OR discription LIKE ?";
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
app.get("/spiceses/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const sql =
    "SELECT spiceId, name, fullWeight, price FROM spice WHERE customerId = ?";

  db.query(sql, [customerId], (err, result) => {
    // Added comma here
    if (err) {
      console.error("Error fetching spices: ", err);
      return res.status(500).json({ error: "Error fetching spices" });
    }

    // Map the database rows into the spice format using result
    const spices = result.map((row) => ({
      spiceId: row.spiceId,
      name: row.name,
      fullWeight: row.fullWeight,
      price: row.price,
    }));

    return res.json(spices);
  });
});

app.delete("/spice/:spiceId", (req, res) => {
  const spiceId = req.params.spiceId;
  console.log("Received DELETE request for productId:", spiceId);

  const sql = "DELETE FROM spice WHERE spiceId = ?";
  db.query(sql, [spiceId], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: "Error deleting product" });
    }
    console.log("Delete result:", result);
    if (result.affectedRows > 0) {
      return res.json({ success: true });
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  });
});

// app.get("/spiceses/:customerId", verifyToken, (req, res) => {
//   const customerId = req.params.customerId;
//   const sql = "SELECT * FROM spice WHERE customerId = ?";

//   db.query(sql, [customerId], (err, result) => {
//     if (err) {
//       console.error("Error fetching spice items:", err);
//       return res.status(500).json({ error: "Error fetching spice items" });
//     }

//     if (result.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No spices found for this customer" });
//     }

//     return res.json(result);
//   });
// });

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

app.post("/productreview", (req, res) => {
  const sql =
    "INSERT INTO product_reviews(`comment`, `name`, `rating`, `email`, `productId`) VALUES(?)";
  const values = [
    req.body.comment,
    req.body.name,
    req.body.rating,
    req.body.email, // Save the email in the database
    req.body.productId, // Save the productId in the database
  ];

  console.log(values);

  db.query(sql, [values], (err, data) => {
    if (err) return res.json({ error: "error submitting review" });

    return res.json({ Status: "Success" });
  });
});

app.get("/productreviewVisit/:productId", (req, res) => {
  const sql = "SELECT * FROM product_reviews WHERE productId = ?";
  db.query(sql, [req.params.productId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// spice
app.post("/spice/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const { blendName, weight, weightUnit, ingredients, rate, fullprice } =
    req.body;

  const combination = ingredients
    .map((ingredient, index) => `${ingredient}:${rate[index]}`)
    .join(",");
  const fullWeight = `${weight} ${weightUnit}`;

  const sql = `
    INSERT INTO spice (\`name\`, \`fullWeight\`, \`combination\`, \`customerId\`, \`price\`) 
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [blendName, fullWeight, combination, customerId, fullprice];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Error saving blend:", err);
      return res.status(500).json({ error: "Error saving blend" });
    }

    return res.json({ Status: "Success" });
  });
});

app.get("/spiceProducts", (req, res) => {
  const sql = "SELECT product_name, price FROM product";

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Error fetching products" });
    }

    const products = data.map((row) => ({
      product_name: row.product_name,
      price: row.price,
    }));

    return res.json(products);
  });
});

//previousSpice
// app.get("/previousSpice", (req, res) => {
//   const sql =
//     "SELECT spiceId, combination, name, fullWeight, price FROM spice ORDER BY spiceId DESC LIMIT 3";

//   db.query(sql, (err, data) => {
//     if (err) {
//       console.error("Error fetching spices: ", err);
//       return res.status(500).json({ error: "Error fetching spices" });
//     }

//     // Map the database rows into the spice format
//     const spices = data.map((row) => ({
//       combination: row.combination,
//       name: row.name,
//       fullWeight: row.fullWeight,
//       price: row.price,
//     }));

//     return res.json(spices);
//   });
// });

let goodSpiceIds = [];

// API route to receive good spice IDs from Python script
app.post("/receiveComments", (req, res) => {
  const { spiceId } = req.body; // Python script sends "spiceId" key

  if (Array.isArray(spiceId) && spiceId.length > 0) {
    goodSpiceIds = spiceId; // Store the good spice IDs in memory
    console.log(`Received good spice IDs: ${goodSpiceIds}`);
    res
      .status(200)
      .json({ message: "Good spice IDs received", spiceIds: goodSpiceIds });
  } else {
    res.status(400).json({ message: "Invalid spice IDs data" });
  }
});

// API route to send the stored good spice IDs to React frontend
app.get("/getGoodSpiceIds", (req, res) => {
  res.json({ spiceIds: goodSpiceIds });
});

// API route to fetch spice details based on good spice IDs
app.post("/receiveGoodComments", (req, res) => {
  const { spiceIds } = req.body;

  if (!spiceIds || !Array.isArray(spiceIds) || spiceIds.length === 0) {
    return res.status(400).json({ error: "No valid spice IDs received." });
  }

  const sql = `SELECT spiceId, combination, name, fullWeight, price ,comment FROM spice WHERE spiceId IN (?)`;

  db.query(sql, [spiceIds], (err, data) => {
    if (err) {
      console.error("Error fetching spices: ", err);
      return res.status(500).json({ error: "Error fetching spices" });
    }

    const spices = data.map((row) => ({
      spiceId: row.spiceId,
      combination: row.combination,
      name: row.name,
      fullWeight: row.fullWeight,
      price: row.price,
      comment: row.comment,
    }));

    res.json(spices);
  });
});

//old all
app.get("/oldSpice", (req, res) => {
  const sql =
    "SELECT spiceId, combination, name, fullWeight, price,comment FROM spice";

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching spices: ", err);
      return res.status(500).json({ error: "Error fetching spices" });
    }

    // Map the database rows into the spice format
    const spices = data.map((row) => ({
      spiceId: row.spiceId,
      combination: row.combination,
      name: row.name,
      fullWeight: row.fullWeight,
      price: row.price,
      comment: row.comment,
    }));

    return res.json(spices);
  });
});

// Backend route to handle comment submission
app.post("/addComment", (req, res) => {
  const { spiceId, comment } = req.body;

  // Debugging logs to see what data is being received
  console.log("Received spiceId:", spiceId); // This should not be undefined
  console.log("Received comment:", comment);

  if (!spiceId || !comment) {
    return res.status(400).send("Missing spiceId or comment");
  }

  // Update query to add comment to the specific spiceId
  const query = `UPDATE spice SET comment = CONCAT(comment, '\n', ?) WHERE spiceId = ?`;

  db.query(query, [comment, spiceId], (err, result) => {
    if (err) {
      console.error("Error saving comment:", err);
      return res.status(500).send("Error saving comment to the database");
    }
    console.log("Result from the query:", result);
    res.status(200).send("Comment added successfully");
  });
});

//admin

//Delete a User Account
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

//Delete product
app.delete("/registerProductAdmin/:productId", (req, res) => {
  const productId = req.params.productId;
  console.log("Received DELETE request for productId:", productId);

  const sql = "DELETE FROM product WHERE productId = ?";
  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: "Error deleting product" });
    }
    console.log("Delete result:", result);
    if (result.affectedRows > 0) {
      return res.json({ success: true });
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  });
});

//Delete a inquiry
app.delete("/inquiryAdmin/:inquiryId", (req, res) => {
  const inquiryId = req.params.inquiryId;
  console.log("Received DELETE request for inquiryId:", inquiryId);

  const sql = "DELETE FROM inquiry WHERE inquiryId = ?";
  db.query(sql, [inquiryId], (err, result) => {
    if (err) {
      console.error("Error deleting inquiryId:", err);
      return res.status(500).json({ error: "Error deleting inquiryId" });
    }
    console.log("Delete result:", result);
    if (result.affectedRows > 0) {
      return res.json({ success: true });
    } else {
      return res.status(404).json({ error: "inquiryId not found" });
    }
  });
});

// Update Product
app.put("/updateProduct/:id", upload.single("photo"), (req, res) => {
  const productId = req.params.id;
  const { product_name, price, discription } = req.body;
  const newPhoto = req.file ? req.file.filename : null;

  // First, retrieve the current product data to check the existing photo
  db.query(
    "SELECT photo FROM product WHERE productId = ?",
    [productId],
    (err, result) => {
      if (err) {
        console.error("Error retrieving product:", err);
        return res.status(500).send("Internal Server Error");
      }

      // If no new photo is uploaded, keep the old photo
      const currentPhoto = result[0].photo;
      const photoToUse = newPhoto ? newPhoto : currentPhoto;

      // Now, update the product in the database
      const query = `
      UPDATE product
      SET product_name = ?, price = ?, discription = ?, photo = ?
      WHERE productId = ?
    `;
      const values = [product_name, price, discription, photoToUse, productId];

      db.query(query, values, (err, updateResult) => {
        if (err) {
          console.error("Error updating product:", err);
          return res.status(500).send("Internal Server Error");
        }

        res.status(200).json({
          productId,
          product_name,
          price,
          discription,
          photo: photoToUse,
        });
      });
    }
  );
});

//user profile
// get user profile
app.get("/userprofile/:customerId", (req, res) => {
  const sql = "SELECT * FROM registercustomer WHERE customerId = ?";

  db.query(sql, [req.params.customerId], (err, data) => {
    if (err) {
      console.error("Error fetching user profile:", err);
      return res.status(500).json({ error: "Error fetching user profile" });
    }
    return res.json(data);
  });
});

// update user profile
app.put("/updateUser", upload.single("photo"), (req, res) => {
  const { customerId, username, contactNumber, gender, address, name } =
    req.body;
  const photo = req.file.filename;

  const sql =
    "UPDATE registercustomer SET username = ?, contactNumber = ?, gender = ?, photo = ?, address = ?, name= ? WHERE customerId = ?";

  db.query(
    sql,
    [username, contactNumber, gender, photo, address, name, customerId],
    (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ error: "Error updating user" });
      }
      return res.json({
        success: true,
        message: "Profile updated successfully",
      });
    }
  );
});

app.post("/classify-comments", (req, res) => {
  const pythonProcess = spawn("python", [
    "classify_comments.py",
    db.config.host,
    db.config.port.toString(),
    db.config.user,
    db.config.password || "", // Use empty string if password is null
    db.config.database,
    "http://localhost:5000/receiveComments",
  ]);

  let pythonOutput = "";
  let pythonError = "";

  pythonProcess.stdout.on("data", (data) => {
    pythonOutput += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    pythonError += data.toString();
    console.error(`Python script error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python script finished with code ${code}`);
    if (pythonError) {
      res
        .status(500)
        .json({ message: "Classification failed", error: pythonError });
    } else {
      res.json({ message: "Classification complete", output: pythonOutput });
    }
  });
});

app.listen(8088, () => {
  console.log("listening");
});
