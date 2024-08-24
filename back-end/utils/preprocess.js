const path = require("path");

function preprocess(req) {
  if (typeof req.body.descriptions !== "object") {
    req.body.descriptions = JSON.parse(req.body.descriptions);
  }
  if (!Array.isArray(req.body.descImgPosArr))
    req.body.descImgPosArr = req.body.descImgPosArr.split(",");
}

function handleImageUpload(file, filename, req) {
  if (file.fieldname === "coverImage") {
    req.body.coverImage.imageurl = filename;
    req.body.descImgPosArr = req.body.descImgPosArr.sort();
  } else if (file.fieldname === "descriptionImage") {
    const firstDescIndex = parseInt(req.body.descImgPosArr[0]);
    console.log(file);
    /* console.log(file);
    console.log(req.body.descImgPosArr); */
   /*  if (req.body.descriptions[firstDescIndex].descriptionImage.imageTitle) {
      
    } */
    req.body.descriptions[firstDescIndex].descriptionImage.imageurl =
        filename;
    
      req.body.descImgPosArr.shift();
  }
}

function generateFileName(file,fieldname,index = '',blogData) {
  //console.log(file);
  const d = new Date();
  let time = d.getTime();
  const uniqueSuffix = time;
  try{
    const fileName = fieldname + "-" + index +  uniqueSuffix + path.extname(file.originalFilename);
    if (fieldname === "coverImage")
      blogData.coverImage.imageurl = fileName;
    else{
      blogData.descriptions[blogData.descImgPosArr[0]].descriptionImage.imageurl = fileName;
      blogData.descImgPosArr.shift();
    }
    return fieldname + "-" + index +  uniqueSuffix + path.extname(file.originalFilename);
  }catch(err){
    console.log('sssssssc' + err.message);
  }
  
}

module.exports = { preprocess, handleImageUpload, generateFileName };
