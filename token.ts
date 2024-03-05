import {
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import {
  createMint,
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";

import { connection, pair } from "./const";

const main = async () => {
  console.log("operate address : ", pair.publicKey.toBase58());

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
