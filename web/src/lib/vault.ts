import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import { getProgram, findHandoverPDA } from "./program";

export interface InitializeVaultParams {
  owner: PublicKey;
  beneficiary: PublicKey;
  mint: PublicKey;
  tokenAccount: PublicKey;
  timeoutSeconds: number;
}

export async function constructInitializeVaultTransaction(
  connection: Connection,
  wallet: any,
  params: InitializeVaultParams
): Promise<Transaction> {
  const { owner, beneficiary, mint, tokenAccount, timeoutSeconds } = params;

  // Get program instance
  const program = getProgram(connection, wallet);

  // Find handover PDA
  const [handoverPDA] = findHandoverPDA(owner, mint, beneficiary);

  // Create the initialize instruction
  const initializeIx = await program.methods
    .initialize(new BN(timeoutSeconds))
    .accountsPartial({
      owner: owner,
      handover: handoverPDA,
      tokenAccount: tokenAccount,
      mint: mint,
      beneficiary: beneficiary,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  // Create transaction
  const transaction = new Transaction();
  transaction.add(initializeIx);

  // Get recent blockhash
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = owner;

  return transaction;
}

export interface VaultInfo {
  address: PublicKey;
  owner: PublicKey;
  beneficiary: PublicKey;
  tokenAccount: PublicKey;
  mint: PublicKey;
  lastCheckin: number;
  timeout: number;
  bump: number;
}

export async function getVaultInfo(
  connection: Connection,
  wallet: any,
  owner: PublicKey,
  mint: PublicKey,
  beneficiary: PublicKey
): Promise<VaultInfo | null> {
  try {
    const program = getProgram(connection, wallet);
    const [handoverPDA] = findHandoverPDA(owner, mint, beneficiary);

    const vaultAccount = await program.account.handover.fetch(handoverPDA);

    return {
      address: handoverPDA,
      owner: vaultAccount.owner,
      beneficiary: vaultAccount.beneficiary,
      tokenAccount: vaultAccount.tokenAccount,
      mint: vaultAccount.mint,
      lastCheckin: vaultAccount.lastCheckin.toNumber(),
      timeout: vaultAccount.timeout.toNumber(),
      bump: vaultAccount.bump,
    };
  } catch (error) {
    console.error("Error fetching vault info:", error);
    return null;
  }
}
