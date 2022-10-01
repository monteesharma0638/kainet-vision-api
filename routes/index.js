import { Router } from "express";
import { getLDForMultiplePairs, getLDforMultipleTokens, getLikeStatusByAccount, getTokenLikeByAccount, updatePairAction } from "../functions/extendDatabase.js";
import { verifyMessages } from "../functions/signFunctions.js";

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

export default router;
