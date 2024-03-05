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

import { pair, endpoint, connection } from "./const";

import {
  percentAmount,
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import {
  TokenStandard,
  createAndMint,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
// import secret from "./guideSecret.json";

const main = async () => {
  // const mintAuthority = Keypair.generate();
  // const freezeAuthority = Keypair.generate();
  // const tokenMint = await createMint(
  //   connection,
  //   pair,
  //   mintAuthority.publicKey,
  //   freezeAuthority.publicKey,
  //   9 // We are using 9 to match the CLI decimal default exactly
  // );

  // console.log("token minted address is : ", tokenMint.toBase58());

  console.log("use umi ...");

  const umi = createUmi(endpoint);
  const userWallet = umi.eddsa.createKeypairFromSecretKey(pair.secretKey);
  const userWalletSigner = createSignerFromKeypair(umi, userWallet);
  const metadata = {
    name: "CreatorDAO Token Ever",
    symbol: "CDT",
    uri: "IPFS_URL_OF_METADATA",
  };

  const mint = generateSigner(umi);
  umi.use(signerIdentity(userWalletSigner));
  umi.use(mplCandyMachine());

  await createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 8,
    amount: 1000000_00000000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(() => process.exit());
