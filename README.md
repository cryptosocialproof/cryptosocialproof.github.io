# CryptoSocialProof

Generate shareable proof cards for any Solana transaction — no sign-up, no API key, no backend.

Paste a transaction signature, pick a card style, and download a ready-to-post PNG.

---

## How it works

1. Paste a Solana transaction signature
2. The app fetches and parses the transaction directly from public Solana RPC endpoints
3. Review the parsed details (type, amounts, tokens, platform)
4. Choose a card theme and export size
5. Download a 1080×1080 or 1080×1350 PNG

No account required. Nothing is stored. The signature is only used to fetch on-chain data.

---

## Card themes

| Theme | Best for |
|---|---|
| **Dark** | Clean minimal flex — works for any transaction type |
| **Receipt** | Old-school terminal receipt aesthetic |
| **Meme** | Bold centered layout for big numbers |
| **Swap** | Dedicated two-token layout for swaps |

---

## Supported transaction types

- **SWAP** — token-to-token swaps (Jupiter, Orca, Raydium, P2P OTC)
- **BUY** — SOL spent to receive tokens
- **SELL** — tokens sold for SOL
- **SEND** — outgoing token transfer
- **RECEIVE** — incoming token transfer
- **STAKE** — SOL staking transactions

---

## Technical notes

This is a fully static single-file app.

All data is fetched client-side.

Card images are rendered via [html2canvas](https://html2canvas.hertzen.com/) and exported as PNG.

---

## License

MIT
