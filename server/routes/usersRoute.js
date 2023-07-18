const router = require("express").Router();
const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");



router.use(express.urlencoded({extended: false}));
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const authMiddleware = require("../middlewares/authMiddleware");

//New User Registration
router.post("/register", async (req, res) => {
  try {
    //Check if the user is already registered
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new Error("Already registered");
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;
      // save user
      const newUser = new User(req.body);
      await newUser.save();
      res.send({
        success: true,
        message: "User created successfully",
      });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

//User Login
router.post("/login", async (req, res) => {
  try {
    //check if user exits
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User not found");
    }

    //if user is active
    if(user.status !== "active") {
      throw new Error("User account is Blocked, Please Contact Admin");
    }
    //compare Password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      throw new Error("Invalid password");
    }

    //create and assign token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    //send response
    res.send({
      success: true,
      message: "User Logged in successfully",
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get-current-user

router.get('/get-current-user', authMiddleware, async (req, res) => {
  try {
   const user = await User.findById(req.body.userId);
   res.send({
    success: true,
    message: 'User fetched successfully',
    data: user,
   })
  } catch (error) {
    res.send({
    success: false,
    message: error.message,
    });
  }
})

//get all users
router.get('/get-users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.send({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    })
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});


//forgot-password
router.post('/forgot-password', async (req, res) => {
  const {email} = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.json({ status: "User not found" });
    }
    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "5m" });
    const link = `http://localhost:5000/api/users/reset-password/${user._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    var mailOptions = {
      from: 'yourgmail@gmail.com',
      to: email,
      subject: 'Sending Email using Node.js',
      text: link,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    console.log(link);
    res.json({ status: "Email sent successfully" });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});


//reset-password
router.get('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const user = await User.findOne({ _id: id }); // Corrected the query to use _id instead of id
  if (!user || !token) {
    return res.json({ status: "User not exists" }); // Changed the response message
  }
  const secret = process.env.JWT_SECRET + user.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, id: id, token: token});
  } catch (error) {
    res.send("Token verification failed"); // Changed the response message
  }
});

//password-update
router.post('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.json({ status: "User not exists" });
  }
  const secret = process.env.JWT_SECRET + user.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    res.redirect('http://localhost:3000/login');
  } catch (error) {
    console.log(error);
    res.json({ status: "Something went wrong" });
  }
});





//update user status
router.put("/update-user-status/:id", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: 'User updated successfully',
    })
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
  })
}
})



module.exports = router;