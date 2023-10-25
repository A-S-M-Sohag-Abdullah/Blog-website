function preprocess(req,res,next){
  console.log(req.body);
  if (typeof req.body.descriptions !== "object") {
    req.body.descriptions = JSON.parse(req.body.descriptions);
  }
  req.body.descImgPosArr =   req.body.descImgPosArr.split(',').map(Number);

  next();
}

module.exports = {preprocess}