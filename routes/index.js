import { Router } from "express";
import { getLDForMultiplePairs, getLDforMultipleTokens, getLikeStatusByAccount, getTokenLikeByAccount, updatePairAction, updateTokenKyc } from "../functions/extendDatabase.js";
import { verifyMessages } from "../functions/signFunctions.js";
import path from "path";
import multer from "multer";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
var router = Router();


const storage = multer.diskStorage({
  destination:  ( req, file, cb)=>{
    const pathDir = path.join(__dirname, "../tokens");
    cb(null, pathDir);
  },
  filename: (req, file, cb)=>{
    cb(null, `${req.body.tokenAddress}-${req.body.chain}.png`);
  }
});

const upload = multer({storage}).single("logo");

var router = Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/updatePairAction", async function (req, res, next) {
  const { message, signature } = req.body;
  try {
    const walletAddress = verifyMessages(signature, message);
    const { pairAddress, likedStatus, dislikedStatus } =
      JSON.parse(message);

    const data = await updatePairAction(
      walletAddress,
      pairAddress,
      likedStatus,
      dislikedStatus
    );
    res.send({ code: 1, data });
  } catch (err) {
    console.log(err);
    res.send({ code: 0, message: "An Error Occurred.!!!" });
  } 
});

router.post("/updateTokenAction", async function (req, res, next) {
  const { message, signature } = req.body;
  try {
    const walletAddress = verifyMessages(signature, message);
    const { tokenAddress, likedStatus, dislikedStatus } =
      JSON.parse(message);

    const data = await updatePairAction(
      walletAddress,
      tokenAddress,
      likedStatus,
      dislikedStatus
    );
    res.send({ code: 1, data });
  } catch (err) {
    console.log(err);
    res.send({ code: 0, message: "An Error Occurred.!!!" });
  } 
});

// LD means Liked Disliked
router.post("/getldforpairs", async function (req, res, next){
  const { pairAddresses } = req.body;
  const data = await getLDForMultiplePairs(pairAddresses);
  res.send({code: 1, data});
})

router.post("/getldfortokens", async function (req, res, next){
  const { tokenAddresses } = req.body;
  const data = await getLDforMultipleTokens(tokenAddresses);
  res.send({code: 1, data});
})

router.get("/getLikeStatusByAccount", async function (req, res, next){
  const {walletAddress} = req.query;
  try {
    const data = await getLikeStatusByAccount(walletAddress);
    res.send({code: 1, data});
  }
  catch(err){
    console.log(err);
    res.send({code: 0, message: "An Error Occurred"});
  }
})

router.get("/getTokenLikeByAccount", async function (req, res, next){
  const { walletAddress } = req.query;
  try {
    const data = await getTokenLikeByAccount(walletAddress);
    res.send({code: 1, data});
  }
  catch(err){
    console.log(err);
    res.send({code: 0, message: "An Error Occurred"});
  }
})

router.post("/updateTokenKyc", async function(req, res, next){
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.send({code: 0, err: "Unable to upload"});
      return;
    } else if (err) {
      res.send({code: 0, err: "Unable to upload"});
      return;
    }

    const {tokenAddress, chain, teamWalletAddress, telegram, twitter, email, repo, website, signature} = req.body;
    const verifyResult = verifyMessages(signature, JSON.stringify({
      ownerAddress, tokenAddress, chain, teamWalletAddress, telegram, twitter, email, repo, website
    }));

    if(verifyResult===ownerAddress){
      const result = await updateTokenKyc({tokenAddress, chain, teamWalletAddress, telegram, twitter, email, repo, website });
      if(result){
        res.send({code: 1, message: "Inserted Successfully."});
      }
      else {
        res.send({code: 0, err: "error Occured"});
      }
    }
    else {
      res.send({code: 0, err: "Invalid Authentication"});
    }

  })
})



export default router;
