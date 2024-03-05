import {
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  createSyncNativeInstruction,
  getAssociatedTokenAddress,
  NATIVE_MINT,
} from "@solana/spl-token";

import { connection, pair } from "./const";

const main = async () => {
  console.log("operate address : ", pair.publicKey.toBase58());

  const ataAddress = await getAssociatedTokenAddress(
    NATIVE_MINT,
    pair.publicKey
  );

  console.log(ataAddress.toBase58());

  const ataTransaction = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      pair.publicKey,
      ataAddress,
      pair.publicKey,
      NATIVE_MINT
    )
  );

  await sendAndConfirmTransaction(connection, ataTransaction, [pair]);

  const solTransferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: pair.publicKey,
      toPubkey: ataAddress,
      lamports: LAMPORTS_PER_SOL * 5,
    }),
    createSyncNativeInstruction(ataAddress)
  );

  await sendAndConfirmTransaction(connection, solTransferTransaction, [pair]);

  const walletBalance = await connection.getBalance(pair.publicKey);
  console.log(`walletBalance : ${walletBalance}`);

  const closeTx = new Transaction().add(
    createCloseAccountInstruction(ataAddress, pair.publicKey, pair.publicKey)
  );

  await sendAndConfirmTransaction(connection, closeTx, [pair]);

  const changedBalance = await connection.getBalance(pair.publicKey);
  console.log(`walletBalance : ${changedBalance}`);
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(() => process.exit());
