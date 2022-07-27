/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category CreateRewardMint
 * @category generated
 */
export type CreateRewardMintInstructionArgs = {
  rebateBasisPoints: beet.bignum
  bonusBasisPoints: beet.bignum
  uri: string
  name: string
  symbol: string
}
/**
 * @category Instructions
 * @category CreateRewardMint
 * @category generated
 */
export const createRewardMintStruct = new beet.FixableBeetArgsStruct<
  CreateRewardMintInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['rebateBasisPoints', beet.u64],
    ['bonusBasisPoints', beet.u64],
    ['uri', beet.utf8String],
    ['name', beet.utf8String],
    ['symbol', beet.utf8String],
  ],
  'CreateRewardMintInstructionArgs'
)
/**
 * Accounts required by the _createRewardMint_ instruction
 *
 * @property [_writable_] rewardData
 * @property [_writable_] rewardMint
 * @property [_writable_, **signer**] user
 * @property [_writable_] metadata
 * @property [] tokenMetadataProgram
 * @category Instructions
 * @category CreateRewardMint
 * @category generated
 */
export type CreateRewardMintInstructionAccounts = {
  rewardData: web3.PublicKey
  rewardMint: web3.PublicKey
  user: web3.PublicKey
  systemProgram?: web3.PublicKey
  rent?: web3.PublicKey
  tokenProgram?: web3.PublicKey
  metadata: web3.PublicKey
  tokenMetadataProgram: web3.PublicKey
}

export const createRewardMintInstructionDiscriminator = [
  149, 144, 95, 196, 171, 77, 31, 66,
]

/**
 * Creates a _CreateRewardMint_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CreateRewardMint
 * @category generated
 */
export function createCreateRewardMintInstruction(
  accounts: CreateRewardMintInstructionAccounts,
  args: CreateRewardMintInstructionArgs,
  programId = new web3.PublicKey('8UBM18TuKwoTLR4cDB1fagGo1P1SpHPPwBRGcXgP1Utr')
) {
  const [data] = createRewardMintStruct.serialize({
    instructionDiscriminator: createRewardMintInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.rewardData,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.rewardMint,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.user,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.rent ?? web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.metadata,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenMetadataProgram,
      isWritable: false,
      isSigner: false,
    },
  ]

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
