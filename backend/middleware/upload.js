const { error } = require('console');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        const uniquename = Date.now() + '_' + file.originalname
        cb(null,uniquename)
    }
});

// filteration 

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'audio/mpeg'){
        cb(null,true)
    }else{
        cb(new error('Only .mp3 files allowed'),false)
    }
}

const upload = multer({
    storage,
  fileFilter
})

module.exports = upload;





