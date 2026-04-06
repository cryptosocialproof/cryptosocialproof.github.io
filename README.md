# CryptoProof

Generate a shareable receipt image from any Solana DEX swap — attach your own photo and the transaction details are pulled directly from the blockchain.

## What it does

Upload a photo, paste a Solana transaction signature, and CryptoProof will:

1. Fetch the swap data from the Solana blockchain (no API key required)
2. Resolve token names and logos automatically
3. Overlay a clean caption bar at the bottom of your photo showing the tokens swapped, amounts, exchange rate, date and time
4. Let you download or copy the result as a PNG

Supports swaps from Jupiter, Raydium, Orca, and other Solana DEXes.

## Requirements

- [Node.js](https://nodejs.org) (v16 or later)

## Setup

```bash
git clone https://github.com/your-username/cryptoproof.git
cd cryptoproof
node server.js
```

Then open **http://localhost:3001** in your browser.

> **Note:** The app must be opened via `http://localhost:3001`, not by opening `index.html` directly as a file. The local server handles Solana RPC calls and token logo fetching (bypassing browser CORS restrictions).

## Usage

1. Click the upload area and choose a photo, or drag and drop one in
2. Use the crop tool to select the exact portion of the image you want, then click **Apply Crop** (or **Use Full Image** to skip)
3. Paste a Solana transaction signature into the input field — find it on [Solscan](https://solscan.io) or in your wallet's transaction history
4. Click **Generate Proof Image**
5. Download the PNG or copy it to your clipboard

## Supported tokens

Common tokens (SOL, USDC, USDT, SPX6900) are resolved instantly. For all other tokens, metadata is fetched automatically from the Jupiter token registry.
