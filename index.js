// Import required classes and functions from the Solana web3 module
const {
    Connection,       // This class provides API for interacting with the Solana JSON RPC endpoint
    PublicKey,        // Class to work with Solana public keys
    clusterApiUrl,    // Function to get the URL of various Solana clusters (devnet, testnet, mainnet-beta)
    //Keypair,          // Class to represent a keypair in Solana for signing transactions
    LAMPORTS_PER_SOL  // Constant to convert between lamports and SOL (1 SOL = 1 billion lamports)
} = require("@solana/web3.js");

// Import prompt module in order to prompt users for their public address
const prompt = require('prompt-sync')();

// Set up a connection to the Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Function to check and log the wallet balance of the created keypair
const getWalletBalance = async (userPublicKey) => {
    try {
        // Fetch the balance of the wallet
        const walletBalance = await connection.getBalance(
            new PublicKey(userPublicKey)
        );
        // Convert the balance from lamports to SOL and log it
        console.log(`Wallet balance: ${walletBalance / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        // Log any errors that occur
        console.log(err);
    }
};

// Function to airdrop SOL into the created wallet
const airDropSol = async (userPublicKey) => {
    try {
         
        // Log the initiation of the airdrop
        console.log("Airdropping some SOL to my wallet!");
        // Request an airdrop of 2 SOL to the wallet
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(userPublicKey),
            2 * LAMPORTS_PER_SOL
        );
        // Confirm the transaction of the airdrop
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        // Log any errors that occur
        console.log(err);
    }
};

// Prompt user for public key
const userPublicKey = prompt('Please enter your solana public key: ');

// sample address use for testing: dDCQNnDmNbFVi8cQhKAgXhyhXeJ625tvwsunRyRc7c8

// Main function to demonstrate the balance before and after an airdrop
const mainFunction = async () => {
    // Check balance before airdrop
    await getWalletBalance(userPublicKey);
    // Perform airdrop
    await airDropSol(userPublicKey);
    // Check balance after airdrop to see the change
    await getWalletBalance(userPublicKey);
}

// Execute the main function
mainFunction();
