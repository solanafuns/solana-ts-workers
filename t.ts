import {
  Connection,
  Keypair,
  clusterApiUrl,
  sendAndConfirmTransaction,
  Transaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";

const main = async () => {
  //   const connection = new Connection("http://127.0.0.1:8899");
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const pair = Keypair.generate();
  console.log(pair.secretKey.toString());
  console.log("operate address : ", pair.publicKey.toBase58());

  while (true) {
    await connection.requestAirdrop(pair.publicKey, 5_000_000_000);
    const balance = await connection.getBalance(pair.publicKey);
    console.log("balance : ", balance);
    if (balance.valueOf() > 4_500_000_000) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  const transaction = new Transaction();

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: pair.publicKey,
      toPubkey: new PublicKey("5X5K9AJuaDX7gujLTJhpD9wy5DWMeMV55qpLXPV9V58H"),
      lamports: 4_500_000_000,
    })
  );

  const tx = await sendAndConfirmTransaction(connection, transaction, [pair]);
  console.log("tx : ", tx);
};

main()
  .catch((err) => {
    console.log(err);
  })
  .then(() => {
    console.log("done...");
  });
