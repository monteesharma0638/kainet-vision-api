import axios from "axios";
import { Router } from "express";
import { get24HourVolume, getChartData, getCirculatedSupply, getReserves, getDexTrades, getNewListedPairs, getOwnershipTrasnferred, getPairCurrencies, getPriceVariation, getTokenBalances, getTokenCreated, getTokenInfo, getTopTrades, getUsdPrice, getContractCreation, getSearchQuery, getLastPrice } from "../functions/bitqueryAndFunctions.js";
import chains from "../functions/chains.js";
import dexChains from "../functions/dexChains.js";
var router = Router();

function isNative(currency){
  switch(currency){
    case "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": return true;
    case "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c": return true;
    case "0x82A618305706B14e7bcf2592D4B9324A366b6dAd": return true;
    default: return false;
  }
}

const fiats = ["usdc", "usdt", "busd"];

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
  const data = await getTokenCreated(chains[chain], address);
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
  if(fiats.includes(result.data.ethereum.dexTrades[0].baseCurrency.symbol.toLowerCase())){
    const baseCurrency = result.data.ethereum.dexTrades[0].quoteCurrency;
    result.data.ethereum.dexTrades[0].quoteCurrency = result.data.ethereum.dexTrades[0].baseCurrency;
    result.data.ethereum.dexTrades[0].baseCurrency = baseCurrency;
  }
  else if(isNative(result.data.ethereum.dexTrades[0].baseCurrency.address)){
    const baseCurrency = result.data.ethereum.dexTrades[0].quoteCurrency;
    result.data.ethereum.dexTrades[0].quoteCurrency = result.data.ethereum.dexTrades[0].baseCurrency;
    result.data.ethereum.dexTrades[0].baseCurrency = baseCurrency;

  }
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

router.get("/getCircularSupply", async (req, res, next) => {
  const { chain, currency} = req.query;
  const result = await getCirculatedSupply(chain, currency);
  res.send({code: 1, data: result});
})

router.get("/getGainers", async (req, res, next) => {
  const { chain } = req.query;
  const config = {
    method: 'get',
    url: `https://www.dextools.io/shared/analytics/pairs/gainers?limit=51&interval=24h&chain=${dexChains[chain]}`,
  }
  const result = await axios(config).then(response => response.data);
  res.send({code: 1, data: result});
})

router.get("/getLoosers", async (req, res, next) => {
  const { chain } = req.query;
  const config = {
    method: 'get',
    url: `https://www.dextools.io/shared/analytics/pairs/loosers?limit=51&interval=24h&chain=${dexChains[chain]}`,
  }
  const result = await axios(config).then(response => response.data);
  res.send({code: 1, data: result});
})

router.get("/getReserves", async (req, res, next) => {
  const {chain, pair, baseCurrency, quoteCurrency} = req.query;
  const result = await getReserves(chain, pair, baseCurrency, quoteCurrency).catch(console.log);
  res.send({code: 1, data: result});
})

router.get("/getUsdPrice", async (req, res, next) => {
  const {chain, currency} = req.query;
  const result = await getUsdPrice(chain, currency);
  res.send({code: 1, data: result});
})

router.get("/getContractCreation", async (req, res, next) => {
  const {chain, address} = req.query;
  const result = await getContractCreation(chain, address);
  res.send({code: 1, data: result})
})

router.get("/getNewListedPairs", async (req, res, next) => {
  const { chain } = req.query;
  const result = await  getNewListedPairs(chain);
  res.send({code: 1, data: result});
})

router.get("/getSearchQuery", async(req, res, next) => {
  const { chain, search } = req.query;
  const result = await getSearchQuery(chain, search);
  res.send({code: 1, data: result});
})

router.get("/getLastPrice", async (req, res, next)=> {
  const {chain, baseCurrency, quoteCurrency} = req.query;
  const result = await getLastPrice(chain, baseCurrency, quoteCurrency);
  res.send({code: 1, data:result})
})

export default router;