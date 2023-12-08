const express = require("express")
const router = express.Router()
const userModel = require("../model/userModel")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secretKey = "dasdsasd"
const session = require("express-session")
const user = require("../model/userModel")

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.use(session({
    resave:false,
    saveUninitialized:true,
    secret: "dasadsas"
}))

router.get("/", (req, res) => {
    res.render("index")
})


router.get("/register", (req, res) => {
    res.render("register")
})

router.post("/register", async (req, res) => {
    try {
        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const { username, email, password } = req.body
        const encrypt = await bcrypt.hash(password, salt)
        const userData = await new userModel({
            username: username,
            email: email,
            password: encrypt
        })
        await userData.save()
        res.redirect("/login")

    } catch (error) {
        res.status(401).send(error.message)
    }
})

router.get("/login", (req, res) => {
    res.render("login")
})


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const checkUser = await userModel.findOne({ email: email })
        if (!checkUser) {
            res.send("invalid mail id")
        }
        const passwordCheck = await bcrypt.compare(password, checkUser.password)
        if (!passwordCheck) {
            res.send("password mismatch")
        }
        const token = jwt.sign({ email: email }, secretKey, { expiresIn: "5m" });
        req.session.token = token;
        console.log(token);



        res.redirect("/profile")
    } catch (error) {
        res.send(error.message)
    }
})

router.get("/profile",async (req,res)=>{
    try {
        const data = await userModel.find()


        res.render("profile", {data})
    } catch (error) {
        
    }
})



const signout = async(req,res,next)=>{
    try {
            req.session.destroy((err)=>{
                if(err){
                    res.send("element is destroy")
                }else{
                    res.redirect("/login")
                }

            })



    } catch (error) {
        res.send(error.message)
    }
}




router.get("/signout", signout)



function verify(req,res,next){
    const token = req.session.token
    if(!token){
        res.redirect("/login")

    }
    jwt.verify(token, secretKey , (err)=>{
        if(err){
            res.send(err.message)
        }
        next()
    })
}



router.get("/delete/:id",async (req,res)=>{
    const item = req.params.id
    try {   

         await  userModel.findByIdAndDelete(item)
         res.redirect("/profile")
        
    } catch (error) {
        res.send(error.message)
    }
})

router.get("/update/:id",async (req,res)=>{
    try {
    const updateData = req.params.id
    const ud = await userModel.findById(updateData)
    res.render("update", {ud})
    console.log(ud)
    
} catch (error) {
    res.send(error.message)
}
})

router.post("/update/:id", async(req,res)=>{
    const updateData = req.params.id
    try {
        const ud = await userModel.findById(updateData)
        ud.email = req.body.email
        await ud.save()
        res.redirect("/profile")
        
    } catch (error) {
        res.send(error.message)
    }
})



module.exports = router