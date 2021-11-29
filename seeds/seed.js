const sequelize = require("../config/connection")
const {User} = require("../models")
const blogData = require("./user.json")

const seedMe = async ()=>{
    await sequelize.sync({force:true});
    await User.bulkCreate(blogData);
    console.log("seeded users");
    process.exit(0);

}

seedMe()