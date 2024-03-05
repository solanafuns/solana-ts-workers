import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import fs from "fs";
import bs58 from "bs58";

const main = async () => {
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  const pair = Keypair.generate();
  const airdropSignature = await connection.requestAirdrop(
    pair.publicKey,
    LAMPORTS_PER_SOL * 30
  );

  fs.writeFileSync("key.json", `[${pair.secretKey.toString()}]`);
  console.log(airdropSignature);

  console.log(`secretKey base58 ${bs58.encode(pair.publicKey.toBuffer())}`);

  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction(
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    },
    "finalized"
  );
};

main()
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.error(err);
  });
