require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 2108;


try { 
    app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 }catch (error) {
    console.error("Error starting the server:", error); 
 }
