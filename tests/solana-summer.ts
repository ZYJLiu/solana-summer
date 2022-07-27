import * as anchor from "@project-serum/anchor"
import { assert } from "chai"
import { SolanaSummer } from "../target/types/solana_summer"

import {
    TOKEN_PROGRAM_ID,
    getMint,
    getOrCreateAssociatedTokenAccount,
    createAssociatedTokenAccount,
    createMint,
    mintTo,
} from "@solana/spl-token"
import { AssetNotFoundError, findMetadataPda } from "@metaplex-foundation/js"

describe("solana-summer", () => {
    // Configure the client to use the local cluster.

    anchor.setProvider(anchor.AnchorProvider.env())
    const program = anchor.workspace
        .SolanaSummer as anchor.Program<SolanaSummer>
    const connection = anchor.getProvider().connection
    const userWallet = anchor.workspace.SolanaSummer.provider.wallet

    const amount = 100

    let user: anchor.web3.Keypair
    let payer: anchor.web3.Keypair

    it("Create New Reward Token", async () => {
        user = anchor.web3.Keypair.generate()

        const signature = await connection.requestAirdrop(
            user.publicKey,
            anchor.web3.LAMPORTS_PER_SOL
        )
        await program.provider.connection.confirmTransaction(signature)

        const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        )

        // Add your test here.
        const [rewardDataPda, rewardDataBump] =
            await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from("RewardData"), user.publicKey.toBuffer()],
                program.programId
            )

        const [rewardMintPda, rewardMintBump] =
            await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from("Mint"), rewardDataPda.toBuffer()],
                program.programId
            )

        const metadataPDA = await findMetadataPda(rewardMintPda)

        const tx = await program.methods
            .createRewardMint(
                new anchor.BN(100),
                new anchor.BN(50),
                "https://arweave.net/OwXDf7SM6nCVY2cvQ4svNjtV7WBTz3plbI4obN9JNkk",
                "name",
                "SYMBOL"
            )
            .accounts({
                rewardData: rewardDataPda,
                rewardMint: rewardMintPda,
                user: user.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                tokenProgram: TOKEN_PROGRAM_ID,
                metadata: metadataPDA,
                tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            })
            .signers([user])
            .rpc()
        console.log("Your transaction signature", tx)

        const data = await program.account.tokenData.fetch(rewardDataPda)
        assert.isTrue(data.user.equals(user.publicKey))
        assert.isTrue(data.rewardMint.equals(rewardMintPda))
        assert.isTrue(data.rebateBasisPoints.eq(new anchor.BN(100)))
        assert.isTrue(data.bonusBasisPoints.eq(new anchor.BN(50)))
    })

    it("Redeem", async () => {
        const usdcMint = new anchor.web3.PublicKey(
            "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
        )

        const [rewardDataPda, rewardDataBump] =
            await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from("RewardData"), user.publicKey.toBuffer()],
                program.programId
            )

        const [rewardMintPda, rewardMintBump] =
            await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from("Mint"), rewardDataPda.toBuffer()],
                program.programId
            )

        const rewardTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            user,
            rewardMintPda,
            userWallet.publicKey
        )

        const usdcTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            user,
            usdcMint,
            userWallet.publicKey
        )

        const userUsdcTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            user,
            usdcMint,
            user.publicKey
        )

        const rewardData = await program.account.tokenData.fetch(rewardDataPda)

        await program.methods
            .redeem(new anchor.BN(amount), new anchor.BN(0))
            .accounts({
                rewardData: rewardDataPda,
                rewardMint: rewardData.rewardMint,
                usdcMint: usdcMint,
                customerRewardToken: rewardTokenAccount.address,
                customerUsdcToken: usdcTokenAccount.address,
                userUsdcToken: userUsdcTokenAccount.address,
                user: user.publicKey,
                customer: userWallet.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .rpc()

        const mint = await getMint(connection, rewardData.rewardMint)

        const customerTokenBalance = (
            await connection.getTokenAccountBalance(rewardTokenAccount.address)
        ).value.amount

        const userUsdcBalance = (
            await connection.getTokenAccountBalance(
                userUsdcTokenAccount.address
            )
        ).value.amount

        assert.strictEqual(Number(mint.supply), 1)
        assert.strictEqual(Number(customerTokenBalance), 1)
        assert.strictEqual(Number(userUsdcBalance), 100)
    })

    it("Redeem Reward", async () => {
        const usdcMint = new anchor.web3.PublicKey(
            "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
        )

        const [rewardDataPda, rewardDataBump] =
            await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from("RewardData"), user.publicKey.toBuffer()],
                program.programId
            )

        const [rewardMintPda, rewardMintBump] =
            await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from("Mint"), rewardDataPda.toBuffer()],
                program.programId
            )

        const rewardTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            user,
            rewardMintPda,
            userWallet.publicKey
        )

        const usdcTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            user,
            usdcMint,
            userWallet.publicKey
        )

        const userUsdcTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            user,
            usdcMint,
            user.publicKey
        )

        const rewardData = await program.account.tokenData.fetch(rewardDataPda)

        await program.methods
            .redeem(new anchor.BN(0), new anchor.BN(1))
            .accounts({
                rewardData: rewardDataPda,
                rewardMint: rewardData.rewardMint,
                usdcMint: usdcMint,
                customerRewardToken: rewardTokenAccount.address,
                customerUsdcToken: usdcTokenAccount.address,
                userUsdcToken: userUsdcTokenAccount.address,
                user: user.publicKey,
                customer: userWallet.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .rpc()

        const mint = await getMint(connection, rewardData.rewardMint)

        const customerTokenBalance = (
            await connection.getTokenAccountBalance(rewardTokenAccount.address)
        ).value.amount

        const userUsdcBalance = (
            await connection.getTokenAccountBalance(
                userUsdcTokenAccount.address
            )
        ).value.amount

        assert.strictEqual(Number(mint.supply), 0)
        assert.strictEqual(Number(customerTokenBalance), 0)
        assert.strictEqual(Number(userUsdcBalance), 100)
    })
})
