import { Router } from "express";
import { get24HourVolume, getChartData, getCirculatedSupply, getDexTrades, getNewListedPairs, getOwnershipTrasnferred, getPairCurrencies, getPriceVariation, getTokenBalances, getTokenCreated, getTokenInfo, getTopTrades } from "../functions/bitqueryAndFunctions.js";
import chains from "../functions/chains.js";
var router = Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get('/getChartData', async function (req, res, next){
  const {chain, pair, baseCurrency, quoteCurrency, intervalName, intervalCount, from, to} = req.query;
  const chartData = await getChartData(chain, pair, baseCurrency, quoteCurrency, intervalName, intervalCount, from, to).catch(console.log);
  res.send({code: 1, data: chartData});
})

router.get('/getTokenInfo', async function (req, res, next){
  const tokenInfo = await getTokenInfo("bsc", "0x8918Bb91882CE41D9D9892246E4B56e4571a9fd5");
  res.send({code: 1, data: tokenInfo});
})

router.get("/getDexTrades", async function(req, res, next){
  const trades = await getDexTrades("bsc", "0x8918Bb91882CE41D9D9892246E4B56e4571a9fd5");
  res.send({code: 1, data: trades});
})

router.get("/getNewListedPairs", async function(req, res, next){
  const trades = await getNewListedPairs("ethereum");
  res.send({code: 1, data: trades});
})

router.get("/getTopTrades", async function (req, res, next) {
  const { chain } = req.query;
  const trades = await getTopTrades(chain);
  res.send({code: 1, data: trades})
})

router.get("/getTokenBalances", async function (req, res, next) {
  const {chain, address} = req.query;
  const balances = await getTokenBalances(chains[chain], address);
  res.send({code: 1, data: balances});
})

router.get("/getTokenCreated", async function (req, res, next) {
  const {chain, address} = req.query;
  const data = await getTokenCreated(chains[chain], "0x8E1703E600f3A667482C4cedF9c5042c4F9E1fA5");
  res.send({code: 1, data: data});
})

router.post("/getOwnershipTransferred", async function (req, res, next) {
  const { chain, addresses } = req.body;
  const data = await getOwnershipTrasnferred(chains[chain], JSON.stringify(addresses))
  res.send({code: 1, data});
})

router.post("/getPriceVariation", async function (req, res, next){
  const { chain, addresses } = req.body;
  const data = await getPriceVariation(chain, addresses);
  res.send({code: 1, data});
})

router.get("/getPairCurrencies", async (req, res, next) => {
  const { chain, pair } = req.query;
  const result = await getPairCurrencies(chain, pair);
  res.send({code: 1, data: result});
})

router.get("/getDayVolume", async (req, res, next) => {
  const { chain, pair } = req.query;
  console.log(chain, pair);
  try {
    const result = await get24HourVolume(chain, pair);
    res.send({code: 1, data: result.data.ethereum.dexTrades[0].tradeAmount});
  }
  
  catch(err){
    res.send({code: 0, message: "Unknown Error Occurred!!!"});
  }
})

router.get("/getMarketCap", async (req, res, next) => {
  const { chain, currency} = req.query;
  const result = await getCirculatedSupply(chain, currency);
  res.send({code: 1, data: result});
})

export default router;