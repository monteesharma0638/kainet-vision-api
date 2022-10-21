import mongoose from "mongoose";
import { SwapRouter, TokenContract } from "./function.js";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/test");
}

const PairActionSchema = new mongoose.Schema({
  pairAddress: String,
  walletAddress: String,
  likedStatus: Boolean,
  dislikedStatus: Boolean,
});

const TokenActionSchema = new mongoose.Schema({
  tokenAddress: String,
  walletAddress: String,
  likedStatus: Boolean,
  dislikedStatus: Boolean,
});

const TokenKycSchema = new mongoose.Schema({
  tokenAddress: String,
  teamWalletAddress: String,
  ownerAddress: String,
  telegram: String,
  email: String,
  twitter: String,
  repo: String,
  website: String,
  chain: String
});

export const PairActionModal = mongoose.model("pairactions", PairActionSchema);
export const TokenActionModal = mongoose.model(
  "tokenactions",
  TokenActionSchema
);
export const TokenKycModal = mongoose.model("/tokenkycs", TokenKycSchema);

export async function updatePairAction(
  walletAddress,
  pairAddress,
  likedStatus,
  dislikedStatus
) {
  const data = await PairActionModal.updateOne(
    {
      pairAddress,
      walletAddress,
    },
    {
      $set: {
        likedStatus,
        dislikedStatus,
      },
    },
    {
      upsert: true,
    }
  );

  return data;
}

export async function updateTokenAction(
  walletAddress,
  tokenAddress,
  likedStatus,
  dislikedStatus
) {
  const data = await TokenActionModal.updateOne(
    {
      tokenAddress,
      walletAddress,
    },
    {
      $set: {
        likedStatus,
        dislikedStatus,
      },
    },
    {
      upsert: true,
    }
  );

  return data;
}

// LD means Liked Disliked
export async function getLDForMultiplePairs(pairAddresses) {
  const data = await PairActionModal.aggregate([
    {
      $group: {
        _id: { pairAddress: "$pairAddress", likedStatus: "$likedStatus" },
        pairCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.pairAddress",
        likeStatus: {
          $push: {
            likedStatus: "$_id.likedStatus",
            count: "$pairCount",
          },
        },
        count: { $sum: "$pairCount" },
      },
    },
    { $match: { _id: { $in: pairAddresses }, count: { $gte: 1 } } },
  ]);
  return data;
}

export async function getLDforMultipleTokens(tokenAddresses) {
  const data = await TokenActionModal.aggregate([
    {
      $group: {
        _id: { tokenAddresses: "$tokenAddresses", likedStatus: "$likedStatus" },
        pairCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.tokenAddresses",
        likeStatus: {
          $push: {
            likedStatus: "$_id.likedStatus",
            count: "$pairCount",
          },
        },
        count: { $sum: "$pairCount" },
      },
    },
    { $match: { _id: { $in: tokenAddresses }, count: { $gte: 1 } } },
  ]);
  return data;
}

export async function getLikeStatusByAccount(walletAddress) {
  const data = await PairActionModal.find(
    {
      walletAddress,
    },
    { _id: 0 }
  );

  return data;
}

export async function getTokenLikeByAccount(walletAddress) {
  const data = await PairActionModal.find(
    {
      walletAddress,
    },
    { _id: 0 }
  );

  return data;
}

export async function updateTokenKyc({tokenAddress, chain,  ownerAddress, teamWalletAddress, telegram, twitter, repo, website}) {
  const data = await TokenKycModal.updateOne(
    {
      tokenAddress,
    },
    {
      $set: {
        teamWalletAddress,
        ownerAddress,
        telegram,
        email,
        twitter,
        repo,
        website,
        chain
      },
    },
    {
      upsert: true
    }
  );

  return data;
}
