const express =require('express');

const User = require("../models/user");

const bcryptjs = require('bcryptjs');

const authRouter =express.Router();

const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");


/*authRouter.get("/user", (req,res)=>{
    res.json({msg:"yac"});
})*/

authRouter.post('/api/signup',async (req,res)=>{
    try{
        
        //get the data from user
        //post the data to the database
        //return the data to the user
        const {name,email, password} =req.body;
        
        const existngUser = await User.findOne({email});
        if(existngUser){
            //Bad request
            return res.status(400).json({msg:'Cet utilisateur existe déja'});
        }

        const hashedPassword = await bcryptjs.hash(password,8);
        
        let user =new User({
            email,
            password: hashedPassword,
            name,
        })

        user = await user.save();
        res.json(user);
    }
    catch(e){
        res.status(500).json({error: e.message});
    }

});

//Sign in 

authRouter.post('/api/signin',async (req,res)=>{
    try{

        const {email,password}=req.body;
        const user =await User.findOne({email});
        if(!user){
            return res.status(400).json({msg: "L'utilisateur ayant cet email n'existe pas!"});

        }
        const isMatch = await bcryptjs.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg: "Mot de passe est incorrect!"});

        }

        const secret = "passwordkey";

        const token = jwt.sign({id: user._id}, secret,{expiresIn: "10m", algorithm: "HS256"});
        
        res.json({token,...user._doc})

    }catch(e){
        res.status(500).json({error:e.message});


    }
});


authRouter.post('/tokenIsValid',async (req,res)=>{
    try{
        const secret = "passwordkey";

        const token =req.header('x-auth-token');
        if(!token) return res.json(false);

        //console.log("fdddddddddddddddddddddddddsdshhhhhhhhhhhh1");
        //console.log(token);
        //console.log("fdddddddddddddddddddddddddsdshhhhhhhhhhhh2");
        const verified =jwt.verify(token, secret,{algorithm: "HS256"});
        //console.log("fdddddddddddddddddddddddddsdshhhhhhhhhhhh3");
        //console.log(verified);
        //console.log("fdddddddddddddddddddddddddsdshhhhhhhhhhhh4");
        if(!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if(!user) return res.json(false);

        res.json(true);

    }catch(e){
        //console.log("fdddddddddddddddddddddddddsdshhhhhhhhhhhh5");
        //console.log(e.message);

        res.status(500).json({error: e.message});
        //res.status(500).json({error: 'Votre session a expirée, veuillez vous reconnecter à nouveau'});


    }
});

//get user data

authRouter.get('/', auth, async(req,res) => {
    const user =await User.findById(req.user);
    res.json({...user._doc, token: req.token });
});

module.exports=authRouter;