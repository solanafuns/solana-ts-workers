import {
  sendAndConfirmTransaction,
  Transaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";

import { connection, pair } from "./const";

const main = async () => {
  // console.log(pair.secretKey.toString());
  console.log("operate address : ", pair.publicKey.toBase58());

  const transaction = new Transaction();

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: pair.publicKey,
      toPubkey: new PublicKey("8ZYYQi1omdCGXYiyUp8ntoqjYWGDswY5c1vQQHu5g5cr"),
      lamports: 8_000_000_000,
    })
  );

  const tx = await sendAndConfirmTransaction(connection, transaction, [pair]);
  console.log(tx);
};

main()
  .catch((err) => {
    console.log(err);
  })
  .then(() => {
    console.log("done...");
  });
