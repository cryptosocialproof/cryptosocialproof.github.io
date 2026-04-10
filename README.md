# CryptoSocialProof

Generate shareable proof cards for any Solana transaction — no sign-up, no API key, no backend.

Paste a transaction signature, pick a card style, and download a ready-to-post PNG.

**Live site:** [cryptosocialproof.com](https://cryptosocialproof.com)

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

Token symbols are resolved automatically via the Jupiter token list, with CoinGecko as a fallback. Unknown tokens fall back to a truncated mint address.

---

## Technical notes

This is a fully static single-file app — just `index.html`. There is no backend.

All data is fetched client-side:
- **Transaction data** — `api.mainnet-beta.solana.com` (with `rpc.ankr.com/solana` as fallback)
- **Token symbols** — `tokens.jup.ag`
- **SOL price** — `api.coingecko.com`

Card images are rendered via [html2canvas](https://html2canvas.hertzen.com/) and exported as PNG.

---

## Deployment

This repo is deployed via GitHub Pages from the root `index.html`. To fork and deploy your own copy:

1. Fork this repo
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch → main → / (root)**
4. Your site will be live at `https://yourusername.github.io/repo-name/`

---

## Local development

No build step required. Just serve `index.html` from any static file server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Or use VS Code's Live Server extension.

> Opening `index.html` directly as a `file://` URL will not work — browsers block cross-origin requests from the file protocol.

---

## License

MIT
