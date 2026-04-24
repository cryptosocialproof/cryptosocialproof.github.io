# CryptoSocialProof

Generate shareable proof cards for any Solana or Ethereum transaction — no sign-up, no API key, no backend.

Paste a transaction signature or hash, pick a card style, and download a ready-to-post PNG.

Live at [cryptosocialproof.com](https://cryptosocialproof.com/).

---

## How it works

1. Paste a Solana transaction signature (87–88 base58 chars) or an Ethereum transaction hash (`0x` + 64 hex)
2. The chain is auto-detected from the format and the transaction is fetched directly from public RPC endpoints
3. Review the parsed details and adjust privacy settings
4. Choose a card theme and export size
5. Download a 1080×1080 or 1080×1350 PNG

No account required. Nothing is stored.

---

## Supported chains

- **Solana** — mainnet, via `getTransaction` with `jsonParsed` encoding across multiple public RPCs
- **Ethereum** — mainnet, via `eth_getTransactionByHash` + `eth_getTransactionReceipt` across multiple public RPCs

Token metadata and platform (Jupiter, Raydium, Orca on Solana; Uniswap, 1inch, 0x, CowSwap, Paraswap, Lido, Rocket Pool, Curve on Ethereum) are detected automatically.

---

## Card themes

12 themes: Dark · Receipt · Modern · Neon · Photo · Terminal · Aurora · Retro · Gradient · Glass · Bold · Stats

---

## Supported transaction types

SWAP · BUY · SELL · SEND · RECEIVE · STAKE

---

## License

MIT
