const express = require('express');
const router = express.Router();
const userRoutes = require("./userRoutes")

router.use("/users", userRoutes);
router.get("/", (req,res)=>{
    res.send("api route works")
})

module.exports = router;