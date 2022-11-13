const jwt = require("jsonwebtoken");

const User = require('../models/user');

const admin =async(req, res, next)=>{

    try {
        
        const token =req.header("x-auth-token");
        //const token = jwt.sign({id: user._id}, "passwordKey");
        if(!token)
        return res.status(401).json({msg: 'Accès refusé'});


        //console.log("here");
        //console.log(token);

        const secret = "passwordkey";

        const verified = jwt.verify(token, secret,{algorithm: "HS256"});
        
        //console.log("here");        

        if(!verified) return res.status(401).json({msg: 'Accès refusé'});


        const user =await User.findById(verified.id);

        if(user.type == 'user' || user.type == 'seller'){
            return res.status(401).json({msg: 'Accès refusé'});
        }


        req.user = verified.id;
        req.token =token;
        next();



    } catch (err) {
        //res.status(500).json({error: err.message});
        res.status(500).json({error: 'Votre session a expirée, veuillez vous reconnecter'});

    }
};


module.exports=admin;




