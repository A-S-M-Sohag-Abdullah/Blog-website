const jwt = require('jsonwebtoken');

function auth(req,res,next){
  try{
    console.log('ekhane asce');
    const token = req.cookies.token;
    console.log(token);

    if(!token) res.startus(401).send({errorMessage: "unauthorized"});

    const verified = jwt.verify(token,process.env.JWT_SECRET_KEY);
    //console.log(verified);
    next()

  }catch(err){
    res.status(401).send({errorMessage: "unauthorized"});
  }
}

module.exports = auth;