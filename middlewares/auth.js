
const jwt =require('jsonwebtoken');


const auth =async(req, res, next)=>{
    try {

        const secret = "passwordkey";
        const token =req.header('x-auth-token');
        if(!token)
        return res.status(401).json({msg: 'Accès refusé'});

        const verified =jwt.verify(token, secret,{algorithm: "HS256"});
        if(!verified) return res.status(401).json({msg: 'Accès refusé'});

        req.user = verified.id;
        req.token =token;
        next();



    } catch (err) {
        
        //res.status(500).json({error: err.message});
        //res.status(500).json({error: 'mid.auth'});
        res.status(500).json({error: 'Votre session a expirée, veuillez vous reconnecter'});

    }
}


module.exports=auth;