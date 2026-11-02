const express = require("express");
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes"); 
const taskRoutes = require("./routes/task.routes");
const userRoutes = require("./routes/user.routes")
const cors = require("cors");



const app = express();


app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://progressa.vercel.app"
    ],
    credentials: true
}));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({
    success: true,
     message: "Progressa backend is running!"
     });
});


app.use('/auth', authRoutes);
app.use('/task', taskRoutes);
app.use('/user',userRoutes)

module.exports = app;   