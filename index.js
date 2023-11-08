// Import required classes and functions from the Solana web3 module
const {
    Connection,       // This class provides API for interacting with the Solana JSON RPC endpoint
    PublicKey,        // Class to work with Solana public keys
    clusterApiUrl,    // Function to get the URL of various Solana clusters (devnet, testnet, mainnet-beta)
    Keypair,          // Class to represent a keypair in Solana for signing transactions
    LAMPORTS_PER_SOL  // Constant to convert between lamports and SOL (1 SOL = 1 billion lamports)
} = require("@solana/web3.js");

// Generate a new keypair for a wallet
const newPair = new Keypair();

// Extract and convert the public key to a string for easy display
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
// Extract the private key; needed for signing transactions and to recover the keypair
const privateKey = newPair._keypair.secretKey;

// Set up a connection to the Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Log the public key of the new keypair
console.log("Public Key of the generated keypair", publicKey);

// Function to check and log the wallet balance of the created keypair
const getWalletBalance = async () => {
    try {
        // Log the connection object for debug purposes
        console.log("Connection object is:", connection);

        // Reconstruct a wallet from the private key
        const myWallet = await Keypair.fromSecretKey(privateKey);
        // Fetch the balance of the wallet
        const walletBalance = await connection.getBalance(
            new PublicKey(myWallet.publicKey)
        );
        // Convert the balance from lamports to SOL and log it
        console.log(`Wallet balance: ${walletBalance / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        // Log any errors that occur
        console.log(err);
    }
};

// Function to airdrop SOL into the created wallet
const airDropSol = async () => {
    try {
        // Reconstruct the wallet from the saved private key
        const myWallet = await Keypair.fromSecretKey(privateKey);

        // Log the initiation of the airdrop
        console.log("Airdropping some SOL to my wallet!");
        // Request an airdrop of 2 SOL to the wallet
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(myWallet.publicKey),
            2 * LAMPORTS_PER_SOL
        );
        // Confirm the transaction of the airdrop
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        // Log any errors that occur
        console.log(err);
    }
};

// Main function to demonstrate the balance before and after an airdrop
const mainFunction = async () => {
    // Check balance before airdrop
    await getWalletBalance();
    // Perform airdrop
    await airDropSol();
    // Check balance after airdrop to see the change
    await getWalletBalance();
}

// Execute the main function
mainFunction();
