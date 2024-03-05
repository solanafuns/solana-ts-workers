import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import key from "./key.json";
import base58 from "bs58";

// const endpoint = clusterApiUrl("devnet");
export const endpoint = "http://127.0.0.1:8899";
export const connection = new Connection(endpoint, "finalized");
export const pair = Keypair.fromSecretKey(Uint8Array.from(key));

console.log("secretKey : ", base58.encode(pair.secretKey));
