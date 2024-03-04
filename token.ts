import {
  Keypair,
  SystemInstruction,
  SystemProgram,
  Transaction,
  Connection,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  createMint,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  NATIVE_MINT,
  transfer,
} from "@solana/spl-token";

const main = async () => {
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
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

  const mintAuthority = Keypair.generate();
  const freezeAuthority = Keypair.generate();

  const mint = await createMint(
    connection,
    pair,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    9 // We are using 9 to match the CLI decimal default exactly
  );

  console.log(mint.toBase58());

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    pair,
    mint,
    pair.publicKey
  );

  console.log("token account : ", tokenAccount.address.toBase58());

  await mintTo(
    connection,
    pair,
    mint,
    tokenAccount.address,
    mintAuthority,
    10000 // because decimals for the mint are set to 9
  );

  const tx = new Transaction().add(
    createTransferInstruction(
      tokenAccount.address,
      tokenAccount.address,
      pair.publicKey,
      100
    )
  );

  const sig = await sendAndConfirmTransaction(connection, tx, [pair]);
  console.log(`transfer sig : ${sig}`);
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(() => process.exit());
