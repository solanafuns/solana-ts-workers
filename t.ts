import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";

const main = async () => {
  //   const connection = new Connection("http://127.0.0.1:8899");
  const connection = new Connection(clusterApiUrl("devnet"));
  const pair = Keypair.generate();
  console.log(pair.secretKey.toString());
  console.log("operate address : ", pair.publicKey.toBase58());
  await connection.requestAirdrop(pair.publicKey, 5_000_000_000);
  const balance = await connection.getBalance(pair.publicKey);
  console.log("balance : ", balance);
};

main()
  .catch((err) => {
    console.log(err);
  })
  .then(() => {
    console.log("done...");
  });