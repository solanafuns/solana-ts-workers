import {
  Connection,
  Keypair,
  clusterApiUrl,
  sendAndConfirmTransaction,
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const main = async () => {
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const pair = Keypair.generate();
  console.log(pair.secretKey.toString());
  console.log("operate address : ", pair.publicKey.toBase58());

  const airdropSignature = await connection.requestAirdrop(
    pair.publicKey,
    LAMPORTS_PER_SOL * 10
  );
  console.log(airdropSignature);

  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction(
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    },
    "finalized"
  );

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
