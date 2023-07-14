const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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