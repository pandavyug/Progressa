const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

async function registerUser(req, res) {
  const { U_name, Email, Phone, Password } = req.body;

  const lastUser = await User.findOne()
    .sort({ U_id: -1 })
    .select("U_id")
    .lean();

  const U_id = lastUser ? lastUser.U_id + 1 : 1001;

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");

  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const month = monthNames[today.getMonth()];
  const year = today.getFullYear();
  const CreatedAt = `${day}-${month}-${year}`;

  const isUserExists = await User.findOne({
    $or: [{ U_name }, { Email }, { Phone }],
  });

  if (isUserExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hash = await bcryptjs.hash(Password, 10);

  const user = await User.create({
    U_id,
    U_name,
    Email,
    Phone,
    Password: hash,
    CreatedAt: CreatedAt,
  });

  const token = jwt.sign(
    {
      id: user._id,
      U_id: user.U_id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id,
      U_id: user.U_id,
      username: user.U_name,
      email: user.Email,
      phone: user.Phone,
      createdAt: user.CreatedAt,
    },
  });
}

async function loginUser(req, res) {
  const { Email, Password } = req.body;

  const user = await User.findOne({ Email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcryptjs.compare(Password, user.Password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      U_id: user.U_id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user: {
      id: user._id,
      U_id: user.U_id,
      U_name: user.U_name,
      Email: user.Email,
    },
  });
}

async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
}
module.exports = { registerUser, loginUser, logoutUser };
