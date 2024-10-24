/* eslint-disable no-undef */
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const { spawn } = require("child_process");
const md5 = require("crypto-js/md5");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const { SessionsClient } = require("@google-cloud/dialogflow");
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.json());

const projectId = "your-project-id";
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

// login page
//use register from
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

const SECRET_KEY = "your_secret_key";

// login from
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

      // Check if the user is active
      if (user.userstate === 0) {
        console.log("User is inactive");
        return res.json({
          status: "fail",
          message: "Your account is inactive. Please contact support.",
        });
      }

      console.log("User found:", user);

      try {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          console.log("Passwords match");
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

// shop page---------------------------------------------------------------------------------------------------------------------------------
app.get("/card", (req, res) => {
  const sql = "SELECT * FROM product";
  db.query(sql, (err, result) => {
    if (err) return res.json("Error");
    return res.json(result);
  });
});
//----------------------------------------------------------------------------------------------------------------------------------------------

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

// add to cart page----------------------------------------------------------------------------------------------------------------------
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

// cart page------------------------------------------------------------------------------------------------------------------------------
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

app.get("/spiceses/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const sql =
    "SELECT spiceCartId, name, fullWeight, price FROM spice_cart WHERE customerId = ?";

  db.query(sql, [customerId], (err, result) => {
    // Added comma here
    if (err) {
      console.error("Error fetching spices: ", err);
      return res.status(500).json({ error: "Error fetching spices" });
    }

    // Map the database rows into the spice format using result
    const spices = result.map((row) => ({
      spiceCartId: row.spiceCartId,
      name: row.name,
      fullWeight: row.fullWeight,
      price: row.price,
    }));

    return res.json(spices);
  });
});

app.delete("/spice/:spiceCartId", (req, res) => {
  const spiceCartId = req.params.spiceCartId;
  console.log("Received DELETE request for productId:", spiceCartId);

  const sql = "DELETE FROM spice_cart WHERE spiceCartId = ?";
  db.query(sql, [spiceCartId], (err, result) => {
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
//-----------------------------------------------------------------------------------------------------------------------------------------

// fag page--------------------------------------------------------------------------------------------------------------------------------
app.get("/faqAdmin", (req, res) => {
  const sql = "SELECT * FROM `faq`";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching FAQ:", err);
      return res.json(err);
    }
    console.log("FAQ data:", data); // Log the data to verify it's fetched correctly
    return res.json(data);
  });
});

// review page--------------------------------------------------------------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------------------------------------------------------------

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

// spice page ------------------------------------------------------------------------------------------------------------------
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

app.post("/spice1/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const { blendName, weight, weightUnit, ingredients, rate, fullprice } =
    req.body;

  const combination = ingredients
    .map((ingredient, index) => `${ingredient}:${rate[index]}`)
    .join(",");
  const fullWeight = `${weight} ${weightUnit}`;

  const sql = `
    INSERT INTO spice_cart (\`name\`, \`fullWeight\`, \`combination\`, \`customerId\`, \`price\`) 
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

app.post("/spices/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const { blendName, fullprice, combination, fullWeight } = req.body;

  const sql = `
    INSERT INTO spice_cart (\`name\`, \`fullWeight\`, \`combination\`, \`customerId\`, \`price\`) 
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
// nlp
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

//old all page-------------------------------------------------------------------------------------------------------------------

app.get("/oldSpice", (req, res) => {
  const sql =
    "SELECT DISTINCT spiceId, combination,customerId, name, fullWeight, price,comment FROM spice";

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

//user profile-------------------------------------------------------------------------------------------------------------

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

app.post("/payment", (req, res) => {
  const { price } = req.body;
  console.log(req.body);
  const formattedPrice = parseFloat(price).toFixed(2);
  const data = {
    merchantId: "1228429",
    return_url: "http://localhost:5173/",
    cancel_url: "http://localhost:5173/ca",
    notify_url: "http://sample.com/notify",
    merchantSecret: "Mjg1MzMxMTExNzQwMDM3ODQ4NzYyNTU3NjA0ODk5MTIwMTM0NTg2OQ==",
    first_name: "Akila",
    last_name: "Gunasekara",
    email: "akilagunasekara@gmail.com",
    phone: "0770473392",
    address: "No.1, Galle Road",
    city: "Colombo",
    country: "Sri Lanka",
    orderId: "12345",
    items: "Chair",
    currency: "USD",
    amount: formattedPrice,
  };

  const hash = generateHash(data);

  // Create a new object that includes both data and hash
  const responseData = {
    ...data,
    hash: hash,
  };

  res.send(responseData);
  console.log(`Server Data is ${responseData}`);
});

function generateUniqueId() {
  return "ItemNo" + Math.random().toString(36).substr(2, 9);
}

function generateHash(data) {
  const { merchantId, orderId, amount, currency, merchantSecret } = data;
  const hashedSecret = md5(merchantSecret).toString().toUpperCase();
  const amountFormated = parseFloat(amount)
    .toLocaleString("en-us", { minimumFractionDigits: 2 })
    .replaceAll(",", "");
  const hash = md5(
    merchantId + orderId + amountFormated + currency + hashedSecret
  )
    .toString()
    .toUpperCase();
  return hash;
}

function numberFormat(amount, decimals) {
  return amount.toFixed(decimals).replace(".", "");
}

app.post("/order/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const { price } = req.body; // Extract price from the request body

  if (!price || !customerId) {
    return res
      .status(400)
      .json({ error: "Missing required parameters: price or customerId" });
  }
  const sql = `
    INSERT INTO \`order\` (\`customerId\`, \`price\`)
    VALUES (?, ?)
  `;
  const values = [customerId, price];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting order into the database:", err);
      return res
        .status(500)
        .json({ error: "Database error while inserting order" });
    }

    // Respond with success if the insertion was successful
    return res.json({ Status: "Success", orderId: result.insertId });
  });

  const data = {
    merchantId: "1228429",
    return_url: "http://localhost:5173/",
    cancel_url: "http://localhost:5173/ca",
    notify_url: "http://sample.com/notify",
    merchantSecret: "Mjg1MzMxMTExNzQwMDM3ODQ4NzYyNTU3NjA0ODk5MTIwMTM0NTg2OQ==",
    first_name: "Akila",
    last_name: "Gunasekara",
    email: "akilagunasekara@gmail.com",
    phone: "0770473392",
    address: "No.1, Galle Road",
    city: "Colombo",
    country: "Sri Lanka",
    orderId: "12345",
    items: "Chair",
    currency: "LKR",
    amount: price,
  };

  const hash = generateHash(data);

  // Create a new object that includes both data and hash
  const responseData = {
    ...data,
    hash: hash,
  };

  res.send(responseData);
  console.log(`Server Data is ${responseData}`);
  // Check if the required fields are provided

  // SQL query to insert order into the database

  // Execute the SQL query
});

// admin-----------------------------------------------------------------------------------------------------------------------------------
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
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          console.log("Passwords match");
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

//Delete a User Account
app.put("/registercustomerAdmin/:customerId", (req, res) => {
  console.log("ïn delete user");
  const customerId = req.params.customerId;
  const { isActive } = req.body; // Expecting `isActive` boolean in the request body

  const sql = "UPDATE registercustomer SET userstate = ? WHERE customerId = ?";
  db.query(sql, [isActive, customerId], (err, result) => {
    if (err) {
      console.error("Error updating user status:", err);
      return res.status(500).json({ error: "Error updating user status" });
    }
    return res.json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    });
  });
});

//add faq
app.post("/addfaq", (req, res) => {
  const { question, answer } = req.body; // req.body is already parsed JSON

  console.log("Received fields:", req.body);

  const sql = "INSERT INTO faq(question, answer) VALUES (?, ?)";
  const values = [question, answer];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({
      success: true,
      faq: { id: result.insertId, question, answer },
    });
  });
});

//Delete a Faq
app.delete("/faq/:faqId", (req, res) => {
  const faqId = req.params.faqId;
  const sql = "DELETE FROM faq WHERE faqId = ?";
  db.query(sql, [faqId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ error: "Error deleting faq" });
    }
    return res.json({ success: true, message: "Faq deleted successfully" });
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

// get order
app.get("/orderAdmin", (req, res) => {
  const query = `
    SELECT o.customerId, o.price, r.contactNumber AS contactNumber, r.address AS address, r.name AS name
    FROM \`order\` o
    JOIN registercustomer r ON o.customerId = r.customerId
`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});
// get customer
app.get("/registercustomerAdmin", (req, res) => {
  const sql = "SELECT * FROM registercustomer";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
// get product
app.get("/productAdmin", (req, res) => {
  const sql = "SELECT * FROM product";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(8088, () => {
  console.log("listening");
});
