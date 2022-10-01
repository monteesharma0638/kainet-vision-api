import { Router } from "express";
import path from "path";
import { getUser, updateUser } from "../functions/database.js";
import { verifyMessages } from "../functions/signFunctions.js";
import multer from "multer";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
var router = Router();


const storage = multer.diskStorage({
  destination:  ( req, file, cb)=>{
    const pathDir = path.join(__dirname, "../uploads");
    cb(null, pathDir);
  },
  filename: (req, file, cb)=>{
    const {signature} = req.body;
    const account = verifyMessages(signature, "uploadProfile");
    cb(null, `${account}.jpg`);
  }
});

const upload = multer({ storage });

router.post('/updateProfilePicture', upload.single("avatar"), (req, res, next) =>  {
  console.log(req.body.signature);
  res.send({code: 1, message: "success"});
})

router.get("/getProfileImage", (req, res, next) => {
  const { address } = req.query;
  const filepath = path.join(__dirname, "../uploads", `${address}.jpg`);
  res.sendFile(filepath);
})

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post('/getUser', async function(req, res, next){
  const { walletAddress } = req.body;
  try {
    const data = await getUser(walletAddress);
    res.send({code: 1, message: data});
  }
  catch(err) {
    res.send({code: 0, message: err.message});
  }
})

router.post('/updateUser', async function(req, res, next){
  const {signature, message} = req.body;
  try {
    const account =  verifyMessages(signature, message);
    const { firstName, userName, emailAddress } = JSON.parse(message);
    await updateUser(userName, firstName, emailAddress, account);
    res.send({code: 1, message: "Updated Successfully"});
  }
  catch(err){
    res.send({code: 0, message: err.message});
  }
})


export default router;
