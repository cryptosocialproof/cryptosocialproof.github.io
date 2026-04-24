'use strict';

// ═══════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════

const RPC_ENDPOINTS = [
  'https://solana-rpc.publicnode.com',
  'https://solana.drpc.org',
  'https://solana.blockpi.network/v1/rpc/public',
  'https://api.mainnet-beta.solana.com',
];

const ETH_RPC_ENDPOINTS = [
  'https://ethereum-rpc.publicnode.com',
  'https://eth.llamarpc.com',
  'https://rpc.ankr.com/eth',
  'https://eth.drpc.org',
  'https://cloudflare-eth.com',
];

// Top ERC-20s on Ethereum mainnet. Keys are lowercased contract addresses.
const KNOWN_ETH_TOKENS = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { symbol: 'USDC',  decimals: 6  },
  '0xdac17f958d2ee523a2206206994597c13d831ec7': { symbol: 'USDT',  decimals: 6  },
  '0x6b175474e89094c44da98b954eedeac495271d0f': { symbol: 'DAI',   decimals: 18 },
  '0x853d955acef822db058eb8505911ed77f175b99e': { symbol: 'FRAX',  decimals: 18 },
  '0x4c9edd5852cd905f086c759e8383e09bff1e68b3': { symbol: 'USDe',  decimals: 18 },
  '0x57e114b691db790c35207b2e685d4a43181e6061': { symbol: 'ENA',   decimals: 18 },
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': { symbol: 'WETH',  decimals: 18 },
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': { symbol: 'WBTC',  decimals: 8  },
  '0x514910771af9ca656af840dff83e8264ecf986ca': { symbol: 'LINK',  decimals: 18 },
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': { symbol: 'UNI',   decimals: 18 },
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': { symbol: 'AAVE',  decimals: 18 },
  '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce': { symbol: 'SHIB',  decimals: 18 },
  '0x6982508145454ce325ddbe47a25d4ec3d2311933': { symbol: 'PEPE',  decimals: 18 },
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': { symbol: 'MKR',   decimals: 18 },
  '0x5a98fcbea516cf06857215779fd812ca3bef1b32': { symbol: 'LDO',   decimals: 18 },
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': { symbol: 'stETH', decimals: 18 },
  '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0': { symbol: 'wstETH',decimals: 18 },
  '0xbe9895146f7af43049ca1c1ae358b0541ea49704': { symbol: 'cbETH', decimals: 18 },
  '0xae78736cd615f374d3085123a210448e74fc6393': { symbol: 'rETH',  decimals: 18 },
  '0xd533a949740bb3306d119cc777fa900ba034cd52': { symbol: 'CRV',   decimals: 18 },
  '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f': { symbol: 'SNX',   decimals: 18 },
  '0xc00e94cb662c3520282e6f5717214004a7f26888': { symbol: 'COMP',  decimals: 18 },
  '0x4d224452801aced8b2f0aebe155379bb5d594381': { symbol: 'APE',   decimals: 18 },
  '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72': { symbol: 'ENS',   decimals: 18 },
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': { symbol: 'MATIC', decimals: 18 },
  '0x0f2d719407fdbeff09d87557abb7232601fd9f29': { symbol: 'SYN',   decimals: 18 },
  '0x111111111117dc0aa78b770fa6a738034120c302': { symbol: '1INCH', decimals: 18 },
  '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2': { symbol: 'SUSHI', decimals: 18 },
  '0xb50721bcf8d664c30412cfbc6cf7a15145234ad1': { symbol: 'ARB',   decimals: 18 },
  '0x6810e776880c02933d47db1b9fc05908e5386b96': { symbol: 'GNO',   decimals: 18 },
  '0xcfeaead4947f0705a14ec42ac3d44129e1ef3ed5': { symbol: 'NOTE',  decimals: 8  },
};

// DEX router / aggregator addresses → human-readable platform name.
const ETH_PLATFORMS = {
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': 'Uniswap V2',
  '0xe592427a0aece92de3edee1f18e0157c05861564': 'Uniswap V3',
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': 'Uniswap V3',
  '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad': 'Uniswap',
  '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b': 'Uniswap',
  '0x66a9893cc07d91d95644aedd05d03f95e1dba8af': 'Uniswap',
  '0x1111111254eeb25477b68fb85ed929f73a960582': '1inch',
  '0x1111111254fb6c44bac0bed2854e76f90643097d': '1inch',
  '0x111111125421ca6dc452d289314280a0f8842a65': '1inch',
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff': '0x Protocol',
  '0x9008d19f58aabd9ed0d60971565aa8510560ab41': 'CowSwap',
  '0xdef171fe48cf0115b1d80b88dc8eab59176fee57': 'Paraswap',
  '0xe66b31678d6c16e9ebf358268a790b763c133750': '0x Protocol',
  '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f': 'SushiSwap',
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': 'Lido',
  '0xdae9dd3d1a52cfce9d5f2fac7fde164d500e50f7': 'Rocket Pool',
  '0xdc24316b9ae028f1497c275eb9192a3ea0f67022': 'Curve',
};

// ERC-20 Transfer(address,address,uint256) event topic0
const ERC20_TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
// WETH Deposit(address,uint256) and Withdrawal(address,uint256)
const WETH_DEPOSIT_TOPIC    = '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c';
const WETH_WITHDRAWAL_TOPIC = '0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65';
const WETH_ADDRESS          = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

const KNOWN_TOKENS = {
  // Wrapped / native SOL
  'So11111111111111111111111111111111111111112':    'WSOL',
  // Stablecoins
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'USDT',
  '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo': 'PYUSD',
  'A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6': 'USDY',
  // Liquid staking
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So':  'mSOL',
  'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn': 'JitoSOL',
  'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1':  'bSOL',
  '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj': 'stSOL',
  'LSTxxxnJzKDFSLr4dUkPcmCf5VyryEqzPLz5j4bpxFp':  'LST',
  // DeFi protocols
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN':  'JUP',
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': 'RAY',
  'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE':  'ORCA',
  'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac':  'MNGO',
  'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL':  'JTO',
  'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3': 'PYTH',
  'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof':  'RENDER',
  'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux':  'HNT',
  '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs': 'ETH',
  'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt':  'SRM',
  'DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ': 'DUST',
  'kinXdEcpDQeHPEuQnqmUgtYykqKCSVY5JyfksHC1ud':   'KIN',
  // SPX6900
  'J3NKxxXZcnNiMjKw9hYb2K4LUxgwB6t1FtPtQVsv3KFr': 'SPX',
  // Meme / culture tokens
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 'BONK',
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm': 'WIF',
  '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr': 'POPCAT',
  '63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9': 'GIGA',
  'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5':  'MEW',
  'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk':  'WEN',
  'ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzc3ev': 'MOODENG',
  '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump': 'PNUT',
  '8x5VqbHA8D7NkD52uNuS5nnt3PwA8pLD34ymskeSo2Wn': 'GOAT',
  'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuXjrqm': 'RETARDIO',
  'Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump': 'CHILLGUY',
  '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN': 'TRUMP',
  'FUAfkMCNmZUXjkdBeFRQUkJG8oR29t8TYTPN3PjEqtF6': 'MELANIA',
  'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump':  'FARTCOIN',
  '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU': 'SAMO',
  'nosXBVoaCTtYdLvKY6Csb4AC8JCdQKKAaWYtx2ZMoo7':  'NOS',
};

const SPL_PROGRAMS = new Set([
  'spl-token', 'spl-token-2022',
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  'TokenzQdBNbEqui37kbdmBCkFKnHfZ9rYnsFhmpRFrV',
]);

// ═══════════════════════════════════════════
//  NETWORK HELPERS
// ═══════════════════════════════════════════

function fetchWithTimeout(url, options = {}, ms = 12000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal })
    .then(r  => { clearTimeout(id); return r; })
    .catch(e => { clearTimeout(id); throw e; });
}

async function rpcCallOn(endpoints, method, params, { retryOnNull = false } = {}) {
  const body = JSON.stringify({ jsonrpc: '2.0', id: 1, method, params });
  const opts  = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body };

  let lastErr;
  for (const endpoint of endpoints) {
    try {
      const res  = await fetchWithTimeout(endpoint, opts, 15000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(`RPC error: ${json.error.message || JSON.stringify(json.error)}`);
      if (retryOnNull && json.result === null) continue; // node doesn't have it, try next
      return json;
    } catch (e) {
      lastErr = e;
      // try next endpoint
    }
  }
  if (lastErr) throw lastErr;
  return { result: null }; // all endpoints returned null
}

// Back-compat wrapper used by existing Solana code paths.
async function rpcCall(method, params, opts = {}) {
  return rpcCallOn(RPC_ENDPOINTS, method, params, opts);
}

async function ethRpcCall(method, params, opts = {}) {
  return rpcCallOn(ETH_RPC_ENDPOINTS, method, params, opts);
}

// ═══════════════════════════════════════════
//  TOKEN SYMBOL RESOLUTION
// ═══════════════════════════════════════════

const symCache = {};

async function resolveSymbol(mint) {
  if (KNOWN_TOKENS[mint]) return KNOWN_TOKENS[mint];
  if (symCache[mint])     return symCache[mint];

  // 1) Jupiter token API
  try {
    const res  = await fetchWithTimeout(`https://tokens.jup.ag/token/${encodeURIComponent(mint)}`, {}, 8000);
    const data = await res.json();
    const sym  = data?.symbol?.toUpperCase?.() || null;
    if (sym) { symCache[mint] = sym; return sym; }
  } catch (_) { /* fall through */ }

  // 2) CoinGecko fallback
  try {
    const res  = await fetchWithTimeout(`https://api.coingecko.com/api/v3/coins/solana/contract/${encodeURIComponent(mint)}`, {}, 8000);
    const data = await res.json();
    const sym  = data?.symbol?.toUpperCase?.() || null;
    if (sym) { symCache[mint] = sym; return sym; }
  } catch (_) { /* fall through */ }

  symCache[mint] = trunc(mint);
  return symCache[mint];
}

// ═══════════════════════════════════════════
//  CORE PARSER  (ported from server.js)
// ═══════════════════════════════════════════

function trunc(addr) {
  if (!addr || addr.length < 9) return addr || '';
  return addr.slice(0, 4) + '\u2026' + addr.slice(-4);
}

function formatDate(blockTime) {
  return new Date(blockTime * 1000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

async function parseTx(sig) {
  const resp = await rpcCall('getTransaction', [
    sig,
    { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0, commitment: 'finalized' }
  ], { retryOnNull: true });

  if (!resp?.result) return null;
  const result = resp.result;

  const blockTime   = result.blockTime;
  const accountKeys = result.transaction?.message?.accountKeys || [];
  const logs        = result.meta?.logMessages || [];
  const preTok      = result.meta?.preTokenBalances  || [];
  const postTok     = result.meta?.postTokenBalances || [];

  const getKey = k => (typeof k === 'string' ? k : k?.pubkey) || '';

  // ── Identify primary signer ───────────────────────────────────────────
  const signerSet = new Set(
    accountKeys
      .filter(k => typeof k !== 'string' && k.signer)
      .map(getKey)
      .filter(Boolean)
  );
  if (signerSet.size === 0) signerSet.add(getKey(accountKeys[0]));

  const innerIxGroups = result.meta?.innerInstructions || [];
  const mainIxs = result.transaction?.message?.instructions || [];
  const allIxs  = [
    ...mainIxs,
    ...innerIxGroups.flatMap(g => g.instructions || [])
  ];

  // Strategy 1: first inner SPL transfer authority = initiator
  let signer = null;
  for (const ix of allIxs) {
    if (!SPL_PROGRAMS.has(ix.program) && !SPL_PROGRAMS.has(ix.programId)) continue;
    const type = ix.parsed?.type;
    const info = ix.parsed?.info;
    if (!info) continue;
    if ((type === 'transfer' || type === 'transferChecked') &&
        info.authority && signerSet.has(info.authority)) {
      signer = info.authority;
      break;
    }
  }

  // Strategy 2: signer owning the most token accounts
  if (!signer) {
    const ownerCount = {};
    [...preTok, ...postTok].forEach(b => {
      if (b.owner && signerSet.has(b.owner)) ownerCount[b.owner] = (ownerCount[b.owner] || 0) + 1;
    });
    let best = -1;
    signerSet.forEach(k => {
      if ((ownerCount[k] || 0) > best) { best = ownerCount[k] || 0; signer = k; }
    });
  }

  // Strategy 3: last resort
  if (!signer) signer = getKey(accountKeys[0]);

  // SOL delta for the real signer (not always index 0)
  const signerIdx = Math.max(0, accountKeys.findIndex(k => getKey(k) === signer));
  const preSOL    = (result.meta?.preBalances?.[signerIdx]  || 0) / 1e9;
  const postSOL   = (result.meta?.postBalances?.[signerIdx] || 0) / 1e9;
  const solDelta  = postSOL - preSOL;

  // ── Build account-index → address map ────────────────────────────────
  const idxToAddr = {};
  accountKeys.forEach((k, i) => { idxToAddr[i] = getKey(k); });

  const addrToMint    = {};
  const addrToPreAmt  = {};
  const addrToPostAmt = {};
  preTok.forEach(b => {
    const addr = idxToAddr[b.accountIndex];
    if (addr) { addrToMint[addr] = b.mint; addrToPreAmt[addr] = parseFloat(b.uiTokenAmount?.uiAmountString || '0') || 0; }
  });
  postTok.forEach(b => {
    const addr = idxToAddr[b.accountIndex];
    if (addr) { addrToMint[addr] = b.mint; addrToPostAmt[addr] = parseFloat(b.uiTokenAmount?.uiAmountString || '0') || 0; }
  });

  // ── Instruction-based user-account detection ──────────────────────────
  const userAccounts = new Set();
  for (const ix of allIxs) {
    if (!SPL_PROGRAMS.has(ix.program) && !SPL_PROGRAMS.has(ix.programId)) continue;
    const type = ix.parsed?.type;
    const info = ix.parsed?.info;
    if (!info) continue;
    if ((type === 'initializeAccount' || type === 'initializeAccount2' || type === 'initializeAccount3')
        && info.owner === signer && info.account) {
      userAccounts.add(info.account);
    }
    if ((type === 'transfer' || type === 'transferChecked') && info.authority === signer && info.source) {
      userAccounts.add(info.source);
    }
  }

  const ixMintDeltas = {};
  for (const addr of userAccounts) {
    const mint = addrToMint[addr];
    if (!mint) continue;
    const pre   = addrToPreAmt[addr]  || 0;
    const post  = addrToPostAmt[addr] || 0;
    const delta = post - pre;
    if (Math.abs(delta) > 1e-9) ixMintDeltas[mint] = (ixMintDeltas[mint] || 0) + delta;
  }
  const ixRawChanges = Object.entries(ixMintDeltas)
    .filter(([, d]) => Math.abs(d) > 1e-9)
    .map(([mint, delta]) => ({ mint, delta }));

  // ── Owner-based fallback ──────────────────────────────────────────────
  function computeDeltas(toks, ownerOk) {
    const map = {};
    toks.forEach(b => {
      if (!ownerOk(b.owner)) return;
      const a = parseFloat(b.uiTokenAmount?.uiAmountString || '0') || 0;
      map[b.mint] = (map[b.mint] || 0) + a;
    });
    return map;
  }
  const strictOk  = owner => owner === signer;
  const lenientOk = owner => !owner || owner === signer;

  let preMap  = computeDeltas(preTok,  strictOk);
  let postMap = computeDeltas(postTok, strictOk);
  let allMints = new Set([...Object.keys(preMap), ...Object.keys(postMap)]);
  let ownerRawChanges = [];
  allMints.forEach(mint => {
    const delta = (postMap[mint] || 0) - (preMap[mint] || 0);
    if (Math.abs(delta) > 1e-9) ownerRawChanges.push({ mint, delta });
  });
  if (ownerRawChanges.length === 0) {
    preMap  = computeDeltas(preTok,  lenientOk);
    postMap = computeDeltas(postTok, lenientOk);
    allMints = new Set([...Object.keys(preMap), ...Object.keys(postMap)]);
    allMints.forEach(mint => {
      const delta = (postMap[mint] || 0) - (preMap[mint] || 0);
      if (Math.abs(delta) > 1e-9) ownerRawChanges.push({ mint, delta });
    });
  }

  // ── Pick best result ──────────────────────────────────────────────────
  let rawChanges;
  if (ixRawChanges.length >= 2 ||
      (ixRawChanges.length === 1 && ownerRawChanges.length === 0)) {
    rawChanges = ixRawChanges;
  } else if (ixRawChanges.length === 1 && ownerRawChanges.length >= 1) {
    const ixMints = new Set(ixRawChanges.map(c => c.mint));
    const extra   = ownerRawChanges.filter(c => !ixMints.has(c.mint));
    rawChanges    = [...ixRawChanges, ...extra];
  } else {
    rawChanges = ownerRawChanges;
  }

  // ── Inject native SOL when user sold tokens and received SOL ──────────
  // (e.g. Jupiter Limit Order Fill — native SOL isn't an SPL token)
  {
    const tokenDecCount = rawChanges.filter(c => c.delta < 0).length;
    const tokenIncCount = rawChanges.filter(c => c.delta > 0).length;
    if (tokenDecCount > 0 && tokenIncCount === 0 && solDelta > 0.001) {
      rawChanges.push({ mint: 'SOL_NATIVE', delta: solDelta });
    }
  }

  // ── Resolve symbols ───────────────────────────────────────────────────
  const metaMap = {};
  await Promise.allSettled(rawChanges.map(async c => {
    metaMap[c.mint] = await resolveSymbol(c.mint);
  }));

  const tokenChanges = rawChanges.map(c => {
    const resolved = c.mint === 'SOL_NATIVE' || !!metaMap[c.mint];
    return {
      mint:     c.mint,
      delta:    c.delta,
      symbol:   c.mint === 'SOL_NATIVE' ? 'SOL' : (metaMap[c.mint] || trunc(c.mint)),
      resolved, // false when we only have the mint address as fallback
    };
  });

  // ── Infer transaction type ────────────────────────────────────────────
  const inc    = tokenChanges.filter(c => c.delta > 0);
  const dec    = tokenChanges.filter(c => c.delta < 0);
  const logStr = logs.join(' ');
  const isStake = /[Ss]tak(e|ing)|StakeConfig|Stake11/.test(logStr);

  let type;
  if      (inc.length >= 1 && dec.length >= 1)           type = 'SWAP';
  else if (inc.length >= 1 && solDelta < -0.0001)         type = 'BUY';
  else if (dec.length >= 1 && solDelta >  0.0001)         type = 'SELL';
  else if (inc.length >= 1 && Math.abs(solDelta) < 0.001) type = 'RECEIVE';
  else if (dec.length >= 1 && Math.abs(solDelta) < 0.001) type = 'SEND';
  else if (isStake)                                        type = 'STAKE';
  else                                                     type = 'UNKNOWN';

  // ── Detect platform ───────────────────────────────────────────────────
  let platform = null;
  if      (logStr.includes('Jupiter'))   platform = 'Jupiter';
  else if (logStr.includes('Whirlpool')) platform = 'Orca (Whirlpool)';
  else if (logStr.includes('Orca'))      platform = 'Orca';
  else if (logStr.includes('Raydium'))   platform = 'Raydium';

  // ── USD value (historical at time of tx) ─────────────────────────────
  const STABLE_SYMS = new Set(['USDC', 'USDT', 'PYUSD', 'USDY']);
  let usdValue = null;

  // 1) If any token in the tx is a stablecoin, its amount IS the USD value
  for (const c of tokenChanges) {
    if (STABLE_SYMS.has(c.symbol)) {
      usdValue = Math.abs(c.delta);
      break;
    }
  }

  // 2) SOL involved but no stablecoin found — fetch CoinGecko historical price
  if (usdValue === null && Math.abs(solDelta) > 0.001) {
    try {
      const txDate = new Date(blockTime * 1000);
      const dd   = String(txDate.getUTCDate()).padStart(2, '0');
      const mm   = String(txDate.getUTCMonth() + 1).padStart(2, '0');
      const yyyy = txDate.getUTCFullYear();
      const res  = await fetchWithTimeout(
        `https://api.coingecko.com/api/v3/coins/solana/history?date=${dd}-${mm}-${yyyy}&localization=false`, {}, 10000);
      const data  = await res.json();
      const price = data?.market_data?.current_price?.usd ?? null;
      if (price !== null) usdValue = Math.abs(solDelta) * price;
    } catch (_) {}
  }

  return {
    chain:           'solana',
    nativeSymbol:    'SOL',
    type,
    date:            formatDate(blockTime),
    wallet:          trunc(signer),
    platform,
    tokenChanges,
    solDelta,
    usdValue,
  };
}

// ═══════════════════════════════════════════
//  ETHEREUM PARSER
// ═══════════════════════════════════════════

// Parse a 256-bit hex log topic/word into a lowercased 0x-prefixed address.
function topicToAddress(topic) {
  if (!topic || topic.length < 42) return null;
  return '0x' + topic.slice(-40).toLowerCase();
}

// Convert a hex uint256 value + decimals into a JS number.
function hexToAmount(hex, decimals) {
  if (!hex) return 0;
  try {
    const big = BigInt(hex);
    // Scale down via string manipulation to preserve precision for large values.
    const s = big.toString();
    if (decimals <= 0) return Number(s);
    if (s.length <= decimals) {
      return parseFloat('0.' + s.padStart(decimals, '0'));
    }
    const whole = s.slice(0, s.length - decimals);
    const frac  = s.slice(s.length - decimals);
    return parseFloat(whole + '.' + frac);
  } catch (_) {
    return 0;
  }
}

function hexToNumber(hex) {
  if (!hex) return 0;
  try { return Number(BigInt(hex)); } catch (_) { return parseInt(hex, 16) || 0; }
}

// Resolve ERC-20 symbol + decimals: known list → on-chain eth_call → fallback.
const ethTokenMetaCache = {};

function encodeCall(sel, arg) {
  // sel = 4-byte selector (hex, no 0x). arg = 0x-prefixed 20-byte address (or empty).
  if (!arg) return '0x' + sel;
  return '0x' + sel + arg.replace(/^0x/, '').padStart(64, '0');
}

function decodeString(hex) {
  // ABI-encoded string: offset (32B) | length (32B) | data
  if (!hex || hex === '0x' || hex.length < 130) return null;
  const h = hex.replace(/^0x/, '');
  try {
    const len = parseInt(h.slice(64, 128), 16);
    if (!len || len > 256) {
      // Maybe bytes32 — truncate at first null.
      const bytes32 = h.slice(0, 64);
      let s = '';
      for (let i = 0; i < bytes32.length; i += 2) {
        const b = parseInt(bytes32.slice(i, i + 2), 16);
        if (b === 0) break;
        s += String.fromCharCode(b);
      }
      return s || null;
    }
    const dataHex = h.slice(128, 128 + len * 2);
    let s = '';
    for (let i = 0; i < dataHex.length; i += 2) {
      s += String.fromCharCode(parseInt(dataHex.slice(i, i + 2), 16));
    }
    return s || null;
  } catch (_) { return null; }
}

async function resolveEthToken(addr) {
  const key = addr.toLowerCase();
  if (KNOWN_ETH_TOKENS[key]) return { ...KNOWN_ETH_TOKENS[key], resolved: true };
  if (ethTokenMetaCache[key]) return ethTokenMetaCache[key];

  // On-chain calls: symbol() and decimals()
  let symbol = null, decimals = 18;
  try {
    const [symResp, decResp] = await Promise.all([
      ethRpcCall('eth_call', [{ to: key, data: encodeCall('95d89b41') }, 'latest']),
      ethRpcCall('eth_call', [{ to: key, data: encodeCall('313ce567') }, 'latest']),
    ]);
    symbol = decodeString(symResp?.result);
    if (decResp?.result && decResp.result !== '0x') {
      const d = parseInt(decResp.result, 16);
      if (Number.isFinite(d) && d >= 0 && d <= 36) decimals = d;
    }
  } catch (_) {}

  // CoinGecko fallback for symbol
  if (!symbol) {
    try {
      const res  = await fetchWithTimeout(
        `https://api.coingecko.com/api/v3/coins/ethereum/contract/${encodeURIComponent(key)}`, {}, 8000);
      const data = await res.json();
      symbol = data?.symbol?.toUpperCase?.() || null;
    } catch (_) {}
  }

  const meta = { symbol: symbol || trunc(addr), decimals, resolved: !!symbol };
  ethTokenMetaCache[key] = meta;
  return meta;
}

function validEthHash(s) {
  return /^0x[0-9a-fA-F]{64}$/.test(s);
}

async function parseEthTx(hash) {
  // Fetch tx + receipt in parallel; block for timestamp after we have the receipt.
  const [txResp, rcResp] = await Promise.all([
    ethRpcCall('eth_getTransactionByHash', [hash]),
    ethRpcCall('eth_getTransactionReceipt',  [hash]),
  ]);

  const tx = txResp?.result;
  const rc = rcResp?.result;
  if (!tx || !rc) return null;
  if (rc.status && rc.status !== '0x1') {
    // Tx reverted — still return minimal info so we can message the user.
    return { __reverted: true };
  }

  const blockResp = await ethRpcCall('eth_getBlockByNumber', [rc.blockNumber, false]);
  const blockTime = hexToNumber(blockResp?.result?.timestamp);

  const signer  = (tx.from || '').toLowerCase();
  const toAddr  = (tx.to   || '').toLowerCase();
  const value   = BigInt(tx.value || '0x0');

  // Aggregate ERC-20 Transfer events where signer is sender/receiver.
  // Also detect WETH Deposit/Withdrawal (represent native-ETH <-> WETH flow).
  const logs = rc.logs || [];
  const tokenDeltas = {}; // contract addr -> bigint raw delta for signer
  let wethWithdrawnToSigner = 0n; // WETH -> ETH unwrap received by signer
  let wethDepositedBySigner = 0n; // ETH -> WETH wrap made by signer

  for (const log of logs) {
    const contract = (log.address || '').toLowerCase();
    const t0 = log.topics?.[0];
    if (!t0) continue;

    if (t0 === ERC20_TRANSFER_TOPIC && log.topics.length >= 3) {
      const fromA = topicToAddress(log.topics[1]);
      const toA   = topicToAddress(log.topics[2]);
      // Standard ERC-20: amount in data. Non-standard tokens (e.g. some deflationary
      // tokens) index all three params so data is 0x — fall back to topics[3].
      const raw = log.data && log.data !== '0x'
        ? BigInt(log.data)
        : (log.topics.length >= 4 && log.topics[3] ? BigInt(log.topics[3]) : 0n);
      if (fromA === signer) tokenDeltas[contract] = (tokenDeltas[contract] || 0n) - raw;
      if (toA   === signer) tokenDeltas[contract] = (tokenDeltas[contract] || 0n) + raw;
    } else if (t0 === WETH_WITHDRAWAL_TOPIC && contract === WETH_ADDRESS) {
      // Withdrawal(address indexed src, uint wad)
      const who = topicToAddress(log.topics[1]);
      const raw = BigInt(log.data && log.data !== '0x' ? log.data : '0x0');
      if (who === signer) wethWithdrawnToSigner += raw;
    } else if (t0 === WETH_DEPOSIT_TOPIC && contract === WETH_ADDRESS) {
      // Deposit(address indexed dst, uint wad)
      const who = topicToAddress(log.topics[1]);
      const raw = BigInt(log.data && log.data !== '0x' ? log.data : '0x0');
      if (who === signer) wethDepositedBySigner += raw;
    }
  }

  // Smart-wallet fallback: if tx.from (EOA executor) has no token deltas, check whether
  // tx.to (e.g. a Safe / Argent / AA wallet) appears in Transfer events as the real actor.
  // This handles multisig/smart-contract-wallet users where the contract, not the EOA, holds tokens.
  if (Object.values(tokenDeltas).every(d => d === 0n) && toAddr) {
    const altDeltas = {};
    for (const log of logs) {
      const contract = (log.address || '').toLowerCase();
      const t0 = log.topics?.[0];
      if (t0 !== ERC20_TRANSFER_TOPIC || log.topics.length < 3) continue;
      const fromA = topicToAddress(log.topics[1]);
      const toA2  = topicToAddress(log.topics[2]);
      const raw = log.data && log.data !== '0x'
        ? BigInt(log.data)
        : (log.topics.length >= 4 && log.topics[3] ? BigInt(log.topics[3]) : 0n);
      if (fromA === toAddr) altDeltas[contract] = (altDeltas[contract] || 0n) - raw;
      if (toA2  === toAddr) altDeltas[contract] = (altDeltas[contract] || 0n) + raw;
    }
    // Only adopt altDeltas if they give us a non-zero signal
    if (Object.values(altDeltas).some(d => d !== 0n)) {
      for (const [k, v] of Object.entries(altDeltas)) tokenDeltas[k] = v;
    }
  }

  // Native ETH delta approximation:
  //   - signer sent `value` in tx (negative)
  //   - if tx.to is signer and value > 0, treat as receive (rare: self-send; usually eth_transfer)
  //   - WETH unwraps that returned native ETH to signer are additive
  //   - WETH wraps where signer deposited native ETH are subtractive
  // Gas cost is intentionally excluded so UI delta reflects economic intent, not gas overhead.
  let nativeDeltaRaw = 0n;
  if (value > 0n) {
    if (toAddr === signer) nativeDeltaRaw += value; // incoming transfer to self — unusual
    else nativeDeltaRaw -= value;                   // signer spent ETH
  }
  nativeDeltaRaw += wethWithdrawnToSigner;
  nativeDeltaRaw -= wethDepositedBySigner;
  const nativeDelta = Number(nativeDeltaRaw) / 1e18;

  // Build raw token-change list (excluding WETH if native flow already represents it).
  const rawChanges = [];
  for (const [addr, rawDelta] of Object.entries(tokenDeltas)) {
    if (rawDelta === 0n) continue;
    // If this is a WETH Transfer that corresponds to a wrap/unwrap already reflected
    // in nativeDelta, skip it to avoid double-counting.
    if (addr === WETH_ADDRESS) {
      if (wethWithdrawnToSigner > 0n || wethDepositedBySigner > 0n) continue;
    }
    rawChanges.push({ addr, rawDelta });
  }

  // Resolve symbols + decimals for each changed token.
  const metas = await Promise.all(rawChanges.map(c => resolveEthToken(c.addr)));
  const tokenChanges = rawChanges.map((c, i) => {
    const meta = metas[i];
    const signed = c.rawDelta < 0n ? -hexToAmount('0x' + (-c.rawDelta).toString(16), meta.decimals)
                                   :  hexToAmount('0x' +  c.rawDelta.toString(16),   meta.decimals);
    return {
      mint:     c.addr,
      delta:    signed,
      symbol:   meta.symbol,
      resolved: meta.resolved,
    };
  });

  // Infer transaction type (same taxonomy as Solana: SWAP/BUY/SELL/SEND/RECEIVE/STAKE).
  const inc = tokenChanges.filter(c => c.delta > 0);
  const dec = tokenChanges.filter(c => c.delta < 0);

  // Detect staking by: receiving a liquid-staking derivative as the dominant inflow,
  // or interacting with a known staking contract.
  const STAKE_SYMS = new Set(['stETH', 'wstETH', 'cbETH', 'rETH']);
  const isStakeSym = inc.some(c => STAKE_SYMS.has(c.symbol));
  const isStakePlatform = !!(toAddr && (
    toAddr === '0xae7ab96520de3a18e5e111b5eaab095312d7fe84' || // Lido
    toAddr === '0xdae9dd3d1a52cfce9d5f2fac7fde164d500e50f7' || // Rocket Pool deposit
    toAddr === '0xbe9895146f7af43049ca1c1ae358b0541ea49704'    // Coinbase cbETH
  ));

  let type;
  if      (inc.length >= 1 && dec.length >= 1)                       type = 'SWAP';
  else if (isStakeSym || (isStakePlatform && value > 0n))            type = 'STAKE';
  else if (inc.length >= 1 && nativeDelta < -0.0001)                 type = 'BUY';
  else if (dec.length >= 1 && nativeDelta >  0.0001)                 type = 'SELL';
  else if (inc.length >= 1 && Math.abs(nativeDelta) < 0.0001)        type = 'RECEIVE';
  else if (dec.length >= 1 && Math.abs(nativeDelta) < 0.0001)        type = 'SEND';
  else if (nativeDelta < -0.0001)                                    type = 'SEND';
  else if (nativeDelta >  0.0001)                                    type = 'RECEIVE';
  else                                                               type = 'UNKNOWN';

  // Platform from tx.to
  let platform = ETH_PLATFORMS[toAddr] || null;

  // USD value
  const STABLE_SYMS = new Set(['USDC', 'USDT', 'DAI', 'FRAX', 'USDe']);
  let usdValue = null;
  for (const c of tokenChanges) {
    if (STABLE_SYMS.has(c.symbol)) { usdValue = Math.abs(c.delta); break; }
  }
  if (usdValue === null && Math.abs(nativeDelta) > 0.00001) {
    try {
      const txDate = new Date(blockTime * 1000);
      const dd   = String(txDate.getUTCDate()).padStart(2, '0');
      const mm   = String(txDate.getUTCMonth() + 1).padStart(2, '0');
      const yyyy = txDate.getUTCFullYear();
      const res  = await fetchWithTimeout(
        `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${dd}-${mm}-${yyyy}&localization=false`, {}, 10000);
      const data  = await res.json();
      const price = data?.market_data?.current_price?.usd ?? null;
      if (price !== null) usdValue = Math.abs(nativeDelta) * price;
    } catch (_) {}
  }

  return {
    chain:           'ethereum',
    nativeSymbol:    'ETH',
    type,
    date:            formatDate(blockTime),
    wallet:          trunc(signer),
    platform,
    tokenChanges,
    // Keep the field name `solDelta` for rendering-layer compatibility — it
    // represents the native-coin delta regardless of chain.
    solDelta:        nativeDelta,
    usdValue,
  };
}

// ═══════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════
let txData      = null;
let selTheme    = 'dark';
let selSize     = 'square';
let selDecimals = 4;
let maxStep     = 0;
let photoDataUrl  = null;
let photoNaturalW = 0;   // image's natural pixel width
let photoNaturalH = 0;   // image's natural pixel height
let photoZoom     = 1;   // scale factor (1 = fit-to-contain)
let photoPanX     = 0;   // pan as fraction of rendered-at-zoom-1 image width
let photoPanY     = 0;   // pan as fraction of rendered-at-zoom-1 image height

// ═══════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════
function goToStep(n) {
  maxStep = Math.max(maxStep, n);
  for (let i = 0; i < 4; i++) {
    document.getElementById(`step-${i}`).classList.toggle('hidden', i !== n);
    const p = document.getElementById(`prog-${i}`);
    p.classList.toggle('active', i === n);
    p.classList.toggle('done', i !== n && i <= maxStep && i !== 1);
  }
  document.getElementById('reset-btn').classList.toggle('visible', n > 0);
  if (n === 3 && txData) renderCardPreview();
}

function resetApp() {
  txData       = null;
  photoDataUrl = null;
  sigInput.value = '';
  sigInput.classList.remove('input-err');
  inputError.classList.remove('visible');
  document.getElementById('data-table').innerHTML   = '';
  document.getElementById('card-preview').innerHTML = '';
  document.getElementById('tog-platform').checked = true;
  document.getElementById('tog-usd').checked      = false;
  const dropArea = document.getElementById('photo-drop-area');
  if (dropArea) dropArea.classList.remove('has-photo');
  const dropText = document.getElementById('photo-drop-text');
  if (dropText) dropText.textContent = 'Click to upload a photo';
  const photoInput = document.getElementById('photo-input');
  if (photoInput) photoInput.value = '';
  document.getElementById('photo-upload-wrap').classList.add('hidden');
  photoNaturalW = 0; photoNaturalH = 0;
  photoZoom = 1; photoPanX = 0; photoPanY = 0;
  updateZoomIndicator();
  selTheme    = 'dark';
  selSize     = 'square';
  selDecimals = 4;
  maxStep     = 0;
  document.querySelectorAll('.theme-opt').forEach(el => {
    el.classList.toggle('selected', el.dataset.theme === 'dark');
    el.style.display = '';
  });
  document.querySelectorAll('.size-opt').forEach(el => el.classList.toggle('selected', el.dataset.size === 'square'));
  document.querySelectorAll('.dec-btn').forEach(el => el.classList.toggle('selected', el.dataset.dec === '4'));
  goToStep(0);
}

// ═══════════════════════════════════════════
//  FORMAT HELPERS
// ═══════════════════════════════════════════
function fmtAmt(n) {
  const a  = Math.abs(n);
  const dp = selDecimals;
  if (a >= 1e9) return (a/1e9).toLocaleString('en-US', { maximumFractionDigits: Math.min(dp, 3) }) + 'B';
  if (a >= 1e6) return (a/1e6).toLocaleString('en-US', { maximumFractionDigits: Math.min(dp, 2) }) + 'M';
  if (a >= 1e3) return a.toLocaleString('en-US', { maximumFractionDigits: Math.min(dp, 2) });
  return parseFloat(a.toFixed(dp)).toLocaleString('en-US', { maximumFractionDigits: dp });
}

function fmtUsd(v) {
  if (v == null || v <= 0) return null;
  if (v >= 1e6) return '$' + (v / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'M';
  if (v >= 1e3) return '$' + Math.round(v).toLocaleString('en-US');
  if (v >= 1)   return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

// Clickable nav bar — clicking a completed step navigates back to it.
// Step 1 (Fetching) is excluded since it's a transient loading state.
document.querySelectorAll('.prog-step').forEach((el, i) => {
  el.addEventListener('click', () => {
    if (i !== 1 && el.classList.contains('done')) goToStep(i);
  });
});

// ═══════════════════════════════════════════
//  VALIDATION
// ═══════════════════════════════════════════
function validSig(s) {
  return /^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(s);
}

// Auto-detect which chain the user pasted.
// Returns 'solana' | 'ethereum' | null.
function detectChain(s) {
  if (validEthHash(s))       return 'ethereum';
  if (validSig(s))           return 'solana';
  return null;
}

// ═══════════════════════════════════════════
//  MAIN FETCH FLOW
// ═══════════════════════════════════════════
const sigInput   = document.getElementById('sig-input');
const inputError = document.getElementById('input-error');
const fetchBtn   = document.getElementById('fetch-btn');
const fStatus    = document.getElementById('fetching-status');
const fSub       = document.getElementById('fetching-sub');

function showInputError(msg) {
  sigInput.classList.add('input-err');
  inputError.textContent = msg;
  inputError.classList.add('visible');
}

// Fetch a live recent SWAP signature from Jupiter v6 (always fresh)
const DEMO_ADDRESS = 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4';

async function fetchDemoSig() {
  const body = JSON.stringify({
    jsonrpc: '2.0', id: 1,
    method:  'getSignaturesForAddress',
    params:  [DEMO_ADDRESS, { limit: 10, commitment: 'finalized' }],
  });
  const opts = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body };
  for (const endpoint of RPC_ENDPOINTS) {
    try {
      const res  = await fetchWithTimeout(endpoint, opts, 10000);
      if (!res.ok) continue;
      const json = await res.json();
      const sigs = json.result;
      if (!Array.isArray(sigs)) continue;
      // Return the first confirmed, error-free signature
      const hit = sigs.find(s => !s.err && s.signature);
      if (hit) return hit.signature;
    } catch (_) {}
  }
  return null;
}

sigInput.addEventListener('input', () => {
  sigInput.classList.remove('input-err');
  inputError.classList.remove('visible');
});
sigInput.addEventListener('keydown', e => { if (e.key === 'Enter') fetchBtn.click(); });

document.getElementById('demo-btn').addEventListener('click', async () => {
  const btn = document.getElementById('demo-btn');
  btn.disabled    = true;
  btn.textContent = 'Finding example…';
  sigInput.classList.remove('input-err');
  inputError.classList.remove('visible');

  const sig = await fetchDemoSig();
  btn.disabled    = false;
  btn.textContent = 'Try an example →';

  if (!sig) {
    showInputError('Could not load a live example — the network may be busy. Please paste your own signature.');
    return;
  }
  sigInput.value = sig;
  fetchBtn.click();
});

fetchBtn.addEventListener('click', async () => {
  const sig = sigInput.value.trim();
  if (!sig) { showInputError('Please paste a transaction signature or hash.'); return; }

  const chain = detectChain(sig);
  if (!chain) {
    showInputError('That doesn\'t look like a valid transaction. Paste a Solana signature (87–88 base58 characters) or an Ethereum transaction hash (0x + 64 hex characters) — you can find yours on Solscan, Etherscan, or in your wallet\'s history.');
    return;
  }

  sigInput.classList.remove('input-err');
  inputError.classList.remove('visible');
  fetchBtn.disabled = true;

  const chainLabel = chain === 'ethereum' ? 'Ethereum' : 'Solana';

  goToStep(1);
  fStatus.textContent = `Connecting to ${chainLabel}…`;
  fSub.textContent    = 'Querying public RPC endpoints';

  try {
    fStatus.textContent = 'Fetching transaction…';
    fSub.textContent    = 'Resolving token symbols — this may take a few seconds';
    txData = chain === 'ethereum' ? await parseEthTx(sig) : await parseTx(sig);

    if (!txData) {
      goToStep(0);
      showInputError('Transaction not found. Double-check the hash or wait a minute if it was just submitted — it may still be finalising on-chain.');
      return;
    }

    if (txData.__reverted) {
      goToStep(0);
      showInputError('This Ethereum transaction reverted on-chain and has no successful outcome to display.');
      txData = null;
      return;
    }

    if (txData.type === 'UNKNOWN') {
      goToStep(0);
      showInputError('This transaction was found on-chain but couldn\'t be recognised as a supported type (SWAP, BUY, SELL, SEND, RECEIVE, STAKE). If you think this is a bug, please report it to cryptosocialproof@protonmail.com.');
      return;
    }

    renderConfirm();
    goToStep(2);

  } catch (e) {
    console.error('Fetch error:', e);
    goToStep(0);
    const isNetworkErr = e.name === 'AbortError' || e.name === 'TypeError' || /network|fetch|timeout/i.test(e.message);
    if (isNetworkErr) {
      showInputError(`Could not reach the ${chainLabel} network. Check your connection and try again — public RPC endpoints can occasionally be slow.`);
    } else if (/not found|invalid/i.test(e.message)) {
      showInputError('Transaction not found. Make sure you\'re using the full signature or hash (not a shortened link).');
    } else {
      showInputError('Something went wrong parsing this transaction. If the problem persists, please report it to cryptosocialproof@protonmail.com.');
    }
  } finally {
    fetchBtn.disabled = false;
  }
});

// ═══════════════════════════════════════════
//  CONFIRM SCREEN
// ═══════════════════════════════════════════
function renderConfirm() {
  const { type, date, wallet, platform, tokenChanges, solDelta, nativeSymbol } = txData;
  const native = nativeSymbol || 'SOL';
  const showP = document.getElementById('tog-platform').checked;

  let html = '';

  html += row('Type', `<span class="badge badge-${type.toLowerCase()}">${type}</span>`);
  html += row('Date', date);

  if (type === 'SWAP') {
    const dec = tokenChanges.find(c => c.delta < 0);
    const inc = tokenChanges.find(c => c.delta > 0);
    if (dec) html += row('Sold',     `<span style="color:#ef4444">−${fmtAmt(dec.delta)} ${dec.symbol}</span>`);
    if (inc) html += row('Received', `<span style="color:#22c55e">+${fmtAmt(inc.delta)} ${inc.symbol}</span>`);
  } else {
    tokenChanges.forEach(tc => {
      const sign  = tc.delta > 0 ? '+' : '−';
      const color = tc.delta > 0 ? '#22c55e' : '#ef4444';
      html += row('Token', `<span style="color:${color}">${sign}${fmtAmt(tc.delta)} ${tc.symbol}</span>`);
    });
    if (tokenChanges.length === 0 && Math.abs(solDelta) > 0.000001) {
      const sign  = solDelta > 0 ? '+' : '−';
      const color = solDelta > 0 ? '#22c55e' : '#ef4444';
      html += row(native, `<span style="color:${color}">${sign}${fmtAmt(solDelta)} ${native}</span>`);
    }
  }


  if (txData.usdValue != null) {
    html += row('USD Value', `<span style="color:#888">≈ ${fmtUsd(txData.usdValue)}</span>`);
  }

  const platRow = document.getElementById('tog-platform-row');
  if (platform) {
    platRow.style.display = '';
    if (showP) html += row('Platform', platform);
  } else {
    platRow.style.display = 'none';
  }

  document.getElementById('data-table').innerHTML = html;
}

function row(label, value) {
  return `<div class="data-row">
    <span class="data-label">${label}</span>
    <span class="data-value">${value}</span>
  </div>`;
}

function selectDecimals(d) {
  selDecimals = d;
  document.querySelectorAll('.dec-btn').forEach(el => {
    el.classList.toggle('selected', parseInt(el.dataset.dec) === d);
  });
  renderConfirm();
  if (!document.getElementById('step-3').classList.contains('hidden')) renderCardPreview();
}

['tog-platform','tog-usd'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => {
    renderConfirm();
    if (!document.getElementById('step-3').classList.contains('hidden')) renderCardPreview();
  });
});

document.getElementById('to-card-btn').addEventListener('click', () => {
  renderCardPreview();
  goToStep(3);
});

// ═══════════════════════════════════════════
//  THEME / SIZE SELECTION
// ═══════════════════════════════════════════
function selectTheme(t) {
  selTheme = t;
  document.querySelectorAll('.theme-opt').forEach(el => {
    el.classList.toggle('selected', el.dataset.theme === t);
  });
  document.getElementById('photo-upload-wrap').classList.toggle('hidden', t !== 'photo');
  updateZoomIndicator();
  renderCardPreview();
}

// ═══════════════════════════════════════════
//  PHOTO PAN / ZOOM  (operates on card preview)
// ═══════════════════════════════════════════
let _panDragging   = false;
let _panStartX = 0, _panStartY = 0;
let _panStartPanX  = 0, _panStartPanY = 0;

let _pinching       = false;
let _pinchStartDist = 0;
let _pinchStartZoom = 1;
let _pinchMidStartX = 0, _pinchMidStartY = 0;
let _pinchPanStartX = 0, _pinchPanStartY = 0;

function _touchDist(e) {
  const dx = e.touches[0].clientX - e.touches[1].clientX;
  const dy = e.touches[0].clientY - e.touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}
function _touchMid(e) {
  return {
    x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
    y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
  };
}

// "contain" fit size — same logic used by cardPhoto() and drag handler
function photoFitSize(cW, cH) {
  if (!photoNaturalW || !photoNaturalH) return { w: cW, h: cH };
  const ia = photoNaturalW / photoNaturalH;
  const ca = cW / cH;
  return ia > ca ? { w: cW, h: cW / ia } : { w: cH * ia, h: cH };
}

// Returns the photo area dimensions for the current card settings
function photoAreaSize() {
  const portrait = selSize === 'portrait';
  const wrap  = document.getElementById('card-preview-wrap');
  const avail = wrap ? Math.floor(wrap.clientWidth - 32) : 400;
  const W     = Math.min(400, Math.max(260, avail));
  const H     = portrait ? Math.round(W * 1.25) : W;
  const isSwap = txData && txData.type === 'SWAP'
    && txData.tokenChanges && txData.tokenChanges.filter(t => Math.abs(t.amount) > 0).length >= 2;
  const barH = Math.round(H * (isSwap ? 0.30 : 0.24));
  return { W, photoH: H - barH };
}

function updateZoomIndicator() {
  const ind  = document.getElementById('photo-zoom-ind');
  const ctrl = document.getElementById('photo-preview-controls');
  const wrap = document.getElementById('card-preview-wrap');
  const active = selTheme === 'photo' && !!photoDataUrl;
  if (ind)  ind.textContent = Math.round(photoZoom * 100) + '%';
  if (ctrl) ctrl.classList.toggle('hidden', !active);
  if (wrap) wrap.classList.toggle('photo-mode', active);
}

// Fast-path: reposition only the photo <img> without full card re-render.
// Called during gesture movement; renderCardPreview() is deferred to gesture end.
let _rafPending = false;
function _applyPhotoTransform() {
  const img = document.querySelector('#card-preview .photo-img');
  if (!img) return;
  const { W, photoH } = photoAreaSize();
  const fit    = photoFitSize(W, photoH);
  const dispW  = fit.w * photoZoom;
  const dispH  = fit.h * photoZoom;
  img.style.left   = ((W      - dispW) / 2 + photoPanX * fit.w) + 'px';
  img.style.top    = ((photoH - dispH) / 2 + photoPanY * fit.h) + 'px';
  img.style.width  = dispW + 'px';
  img.style.height = dispH + 'px';
}
function _schedulePhotoUpdate(withZoomIndicator) {
  if (withZoomIndicator) updateZoomIndicator();
  if (_rafPending) return;
  _rafPending = true;
  requestAnimationFrame(() => { _rafPending = false; _applyPhotoTransform(); });
}

function stepZoom(delta) {
  photoZoom = Math.max(1, Math.min(4, Math.round((photoZoom + delta) * 10) / 10));
  updateZoomIndicator();
  renderCardPreview();
}

function resetPhotoCrop() {
  photoZoom = 1; photoPanX = 0; photoPanY = 0;
  updateZoomIndicator();
  renderCardPreview();
}

function initPreviewInteraction() {
  const wrap = document.getElementById('card-preview-wrap');
  if (!wrap) return;

  wrap.addEventListener('mousedown', e => {
    if (selTheme !== 'photo' || !photoDataUrl) return;
    _panDragging = true;
    _panStartX = e.clientX; _panStartY = e.clientY;
    _panStartPanX = photoPanX; _panStartPanY = photoPanY;
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!_panDragging) return;
    const { W, photoH } = photoAreaSize();
    const fit          = photoFitSize(W, photoH);
    const wrapRect     = wrap.getBoundingClientRect();
    const displayScale = wrapRect.width / W;
    photoPanX = _panStartPanX + (e.clientX - _panStartX) / (fit.w * photoZoom * displayScale);
    photoPanY = _panStartPanY + (e.clientY - _panStartY) / (fit.h * photoZoom * displayScale);
    _schedulePhotoUpdate(false);
  });
  window.addEventListener('mouseup', () => {
    if (_panDragging) renderCardPreview();
    _panDragging = false;
  });

  wrap.addEventListener('touchstart', e => {
    if (selTheme !== 'photo' || !photoDataUrl) return;
    if (e.touches.length === 2) {
      _panDragging    = false;
      _pinching       = true;
      _pinchStartDist = _touchDist(e);
      _pinchStartZoom = photoZoom;
      const mid       = _touchMid(e);
      _pinchMidStartX = mid.x; _pinchMidStartY = mid.y;
      _pinchPanStartX = photoPanX; _pinchPanStartY = photoPanY;
    } else {
      _pinching     = false;
      _panDragging  = true;
      _panStartX    = e.touches[0].clientX; _panStartY = e.touches[0].clientY;
      _panStartPanX = photoPanX; _panStartPanY = photoPanY;
    }
    e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchmove', e => {
    // Only intercept when we're actively gesturing — otherwise let the page scroll freely
    if (!_panDragging && !_pinching) return;
    if (selTheme !== 'photo' || !photoDataUrl) return;

    const { W, photoH } = photoAreaSize();
    const fit          = photoFitSize(W, photoH);
    const wrapRect     = wrap.getBoundingClientRect();
    // padding on each side: 16px desktop / 8px mobile — use actual wrap size
    const displayScale = wrapRect.width / W;

    if (_pinching && e.touches.length === 2) {
      const dist = _touchDist(e);
      photoZoom  = Math.max(1, Math.min(4,
        Math.round(_pinchStartZoom * (dist / _pinchStartDist) * 10) / 10
      ));
      const mid = _touchMid(e);
      photoPanX = _pinchPanStartX + (mid.x - _pinchMidStartX) / (fit.w * photoZoom * displayScale);
      photoPanY = _pinchPanStartY + (mid.y - _pinchMidStartY) / (fit.h * photoZoom * displayScale);
      _schedulePhotoUpdate(true);
    } else if (_panDragging && e.touches.length >= 1) {
      photoPanX = _panStartPanX + (e.touches[0].clientX - _panStartX) / (fit.w * photoZoom * displayScale);
      photoPanY = _panStartPanY + (e.touches[0].clientY - _panStartY) / (fit.h * photoZoom * displayScale);
      _schedulePhotoUpdate(false);
    }
    e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchend', e => {
    if (e.touches.length === 0) {
      if (_panDragging || _pinching) renderCardPreview(); // sync full render once gesture ends
      _panDragging = false;
      _pinching    = false;
    } else if (e.touches.length === 1 && _pinching) {
      // Last pinch finger lifted — seamlessly switch to single-finger pan
      _pinching     = false;
      _panDragging  = true;
      _panStartX    = e.touches[0].clientX; _panStartY = e.touches[0].clientY;
      _panStartPanX = photoPanX; _panStartPanY = photoPanY;
    }
  });

  wrap.addEventListener('wheel', e => {
    if (selTheme !== 'photo' || !photoDataUrl) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    photoZoom = Math.max(1, Math.min(4, Math.round((photoZoom + delta) * 10) / 10));
    updateZoomIndicator();
    renderCardPreview();
  }, { passive: false });
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    photoDataUrl = ev.target.result;
    const probe = new Image();
    probe.onload = () => {
      photoNaturalW = probe.naturalWidth;
      photoNaturalH = probe.naturalHeight;
      const area = document.getElementById('photo-drop-area');
      area.classList.add('has-photo');
      document.getElementById('photo-drop-text').textContent = file.name;
      photoZoom = 1; photoPanX = 0; photoPanY = 0;
      updateZoomIndicator();
      renderCardPreview();
    };
    probe.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function selectSize(s) {
  selSize = s;
  document.querySelectorAll('.size-opt').forEach(el => {
    el.classList.toggle('selected', el.dataset.size === s);
  });
  renderCardPreview();
}

// ═══════════════════════════════════════════
//  CARD DATA
// Returns a clean symbol safe to print on a card.
// Unresolved mints (fallback truncated address) become "???" so the card
// still reads naturally without exposing a raw mint address.
function cardSym(tc) {
  return tc.resolved ? tc.symbol : '???';
}

// ═══════════════════════════════════════════
function getCardPayload() {
  const { type, date, wallet, platform, tokenChanges, solDelta, usdValue, chain, nativeSymbol } = txData;
  const showP   = document.getElementById('tog-platform').checked;
  const showUsd = document.getElementById('tog-usd').checked;

  let primary = null, secondary = null;

  if (type === 'SWAP') {
    const dec = tokenChanges.find(c => c.delta < 0);
    const inc = tokenChanges.find(c => c.delta > 0);
    if (dec) primary   = { symbol: cardSym(dec), amount: fmtAmt(Math.abs(dec.delta)) };
    if (inc) secondary = { symbol: cardSym(inc), amount: fmtAmt(inc.delta) };
  } else if (tokenChanges.length > 0) {
    const t = tokenChanges[0];
    primary = { symbol: cardSym(t), amount: fmtAmt(Math.abs(t.delta)) };
  } else if (Math.abs(solDelta) > 0.000001) {
    primary = { symbol: nativeSymbol || 'SOL', amount: fmtAmt(Math.abs(solDelta)) };
  }

  const amtColor = (type === 'BUY' || type === 'RECEIVE' || type === 'STAKE') ? 'green'
                 : (type === 'SELL' || type === 'SEND') ? 'red'
                 : 'white';

  return {
    type, date,
    wallet:   null,
    platform: showP ? platform : null,
    primary, secondary,
    amtColor,
    usdValue: (showUsd && usdValue != null) ? fmtUsd(usdValue) : null,
    chain:        chain        || 'solana',
    chainLabel:   chain === 'ethereum' ? 'Ethereum' : 'Solana',
    chainUpper:   chain === 'ethereum' ? 'ETHEREUM' : 'SOLANA',
    nativeSymbol: nativeSymbol || 'SOL',
  };
}

// ═══════════════════════════════════════════
//  CARD RENDERERS
// ═══════════════════════════════════════════
function cardDark(d, w, h) {
  const tc     = d.type.toLowerCase();
  const ac     = d.amtColor === 'green' ? 'c-green' : d.amtColor === 'red' ? 'c-red' : 'c-white';
  const isSwap = d.type === 'SWAP' && d.primary && d.secondary;
  return `
<div class="card-root t-dark" style="width:${w}px;height:${h}px">
  <div>
    <div class="type-pill pill-${tc}">${d.type}</div>
    ${isSwap ? `
      <div class="main-amt c-red" style="font-size:clamp(2rem,11vw,4.2rem)">−${d.primary.amount}</div>
      <div class="token-name">${d.primary.symbol}</div>
      <div style="color:rgba(255,255,255,0.35);font-size:1.4rem;margin:0.15em 0">↓</div>
      <div class="main-amt c-green" style="font-size:clamp(2rem,11vw,4.2rem)">+${d.secondary.amount}</div>
      <div class="token-name">${d.secondary.symbol}</div>
      ${d.usdValue ? `<div class="card-usd">≈ ${d.usdValue}</div>` : ''}
    ` : d.primary ? `
      <div class="main-amt ${ac}">${d.primary.amount}</div>
      <div class="token-name">${d.primary.symbol}</div>
      ${d.usdValue ? `<div class="card-usd">≈ ${d.usdValue}</div>` : ''}
    ` : ''}
  </div>
  <div class="card-footer">
    <span>${d.date}</span>
    ${d.wallet   ? `<span class="wallet">${d.wallet}</span>` : ''}
    ${d.platform ? `<span>${d.platform}</span>` : ''}
  </div>
  <div class="csp-wm">cryptosocialproof.com</div>
</div>`;
}

function cardReceipt(d, w, h) {
  let tRows = '';
  if (d.type === 'SWAP' && d.primary && d.secondary) {
    tRows += `<div class="rcp-row"><span class="rcp-k">SOLD</span><span class="rcp-v">${d.primary.amount} ${d.primary.symbol}</span></div>`;
    tRows += `<div class="rcp-row"><span class="rcp-k">RECEIVED</span><span class="rcp-v">${d.secondary.amount} ${d.secondary.symbol}</span></div>`;
  } else if (d.primary) {
    tRows += `<div class="rcp-row"><span class="rcp-k">AMOUNT</span><span class="rcp-v">${d.primary.amount} ${d.primary.symbol}</span></div>`;
  }
  const total = d.type === 'SWAP' && d.secondary
    ? `${d.secondary.amount} ${d.secondary.symbol}`
    : d.primary ? `${d.primary.amount} ${d.primary.symbol}` : '–';
  return `
<div class="card-root t-receipt" style="width:${w}px;height:${h}px">
  <div class="rcp-hdr">
    <div class="rcp-title">TRANSACTION RECEIPT</div>
    <div class="rcp-date">${d.date}</div>
  </div>
  <div class="rcp-row"><span class="rcp-k">TYPE</span><span class="rcp-v">${d.type}</span></div>
  ${tRows}
  ${d.wallet   ? `<div class="rcp-row"><span class="rcp-k">WALLET</span><span class="rcp-v">${d.wallet}</span></div>` : ''}
  ${d.platform ? `<div class="rcp-row"><span class="rcp-k">VIA</span><span class="rcp-v">${d.platform}</span></div>` : ''}
  <div class="rcp-total"><span>TOTAL</span><span>${total}</span></div>
  ${d.usdValue ? `<div class="rcp-usd">≈ ${d.usdValue} USD</div>` : ''}
  <div class="csp-wm">cryptosocialproof.com</div>
</div>`;
}

function cardMeme(d, w, h) {
  const meta   = [d.date, d.wallet, d.platform].filter(Boolean).join(' · ');
  const isSwap = d.type === 'SWAP' && d.primary && d.secondary;
  return `
<div class="card-root t-meme" style="width:${w}px;height:${h}px">
  <div class="meme-type">${d.type}</div>
  ${isSwap ? `
    <div class="meme-amt" style="font-size:clamp(2rem,12vw,4rem)">${d.primary.amount}</div>
    <div class="meme-token">${d.primary.symbol}</div>
    <div style="color:rgba(255,255,255,0.4);font-size:1.2rem;margin:0.2em 0">↓</div>
    <div class="meme-amt" style="font-size:clamp(2rem,12vw,4rem)">${d.secondary.amount}</div>
    <div class="meme-token">${d.secondary.symbol}</div>
    ${d.usdValue ? `<div class="card-usd">≈ ${d.usdValue}</div>` : ''}
  ` : d.primary ? `
    <div class="meme-amt">${d.primary.amount}</div>
    <div class="meme-token">${d.primary.symbol}</div>
    ${d.usdValue ? `<div class="card-usd">≈ ${d.usdValue}</div>` : ''}
  ` : ''}
  <div class="meme-meta">${meta}</div>
  <div class="csp-wm">cryptosocialproof.com</div>
</div>`;
}

function cardPhoto(d, w, h, photo = '', zoom = 1, panX = 0, panY = 0, natW = 0, natH = 0) {
  const isSwap = d.type === 'SWAP' && d.primary && d.secondary;
  const barH   = Math.round(h * (isSwap ? 0.30 : 0.24));
  const photoH = h - barH;

  let rowsHtml = '';
  if (isSwap) {
    rowsHtml = `
      <div class="photo-row">
        <span class="photo-amt c-red">−${d.primary.amount}</span>
        <span class="photo-sym">${d.primary.symbol}</span>
      </div>
      <div class="photo-row">
        <span class="photo-amt c-green">+${d.secondary.amount}</span>
        <span class="photo-sym">${d.secondary.symbol}</span>
      </div>`;
  } else if (d.primary) {
    const ac = d.amtColor === 'green' ? 'c-green' : d.amtColor === 'red' ? 'c-red' : '';
    rowsHtml = `
      <div class="photo-row">
        <span class="photo-amt ${ac}">${d.primary.amount}</span>
        <span class="photo-sym">${d.primary.symbol}</span>
      </div>`;
  }

  // Compute explicit px layout (same logic as updateCropFrame) so crop UI
  // and card always show identical framing regardless of container shape.
  let photoEl;
  if (photo) {
    let fitW, fitH;
    if (natW && natH) {
      const ia = natW / natH;
      const ca = w / photoH;
      if (ia > ca) { fitW = w;          fitH = w / ia;   }
      else         { fitW = photoH * ia; fitH = photoH;   }
    } else {
      fitW = w; fitH = photoH;
    }
    const dispW   = fitW * zoom;
    const dispH   = fitH * zoom;
    const panXpx  = panX * fitW;
    const panYpx  = panY * fitH;
    const imgLeft = (w      - dispW) / 2 + panXpx;
    const imgTop  = (photoH - dispH) / 2 + panYpx;
    photoEl = `<div style="height:${photoH}px;overflow:hidden;position:relative;background:#0d0d0d;">` +
      `<img class="photo-img" src="${photo}" ` +
      `style="position:absolute;left:${imgLeft}px;top:${imgTop}px;width:${dispW}px;height:${dispH}px;max-width:none;max-height:none;" alt="">` +
      `</div>`;
  } else {
    photoEl = `<div class="photo-placeholder" style="height:${photoH}px"></div>`;
  }

  return `
<div class="card-root t-photo" style="width:${w}px;height:${h}px">
  ${photoEl}
  <div class="photo-bar" style="height:${barH}px">
    ${rowsHtml}
    <div class="photo-meta">
      <span class="photo-type">${d.type}</span>
      <span class="photo-date">${d.date}${d.platform ? ' · ' + d.platform : ''}${d.usdValue ? ' · ≈ ' + d.usdValue : ''}</span>
    </div>
    ${d.wallet ? `<div style="font-size:10px;color:rgba(255,255,255,0.55);font-family:'Courier New',monospace;margin-top:2px">${d.wallet}</div>` : ''}
  </div>
  <div class="csp-wm">cryptosocialproof.com</div>
</div>`;
}

// ── Neon theme ──────────────────────────────────────────────────────────
function cardNeon(d, w, h) {
  const isSwap = d.type === 'SWAP' && d.primary && d.secondary;
  const ac     = d.amtColor === 'green' ? 'c-green' : d.amtColor === 'red' ? 'c-red' : 'c-white';

  // Size the TYPE word so it always fits: BUY=5rem, SWAP=4rem, RECEIVE=3rem
  const typeSize = d.type.length <= 3 ? '5.2rem'
                 : d.type.length <= 4 ? '4.5rem'
                 : d.type.length <= 5 ? '3.8rem'
                 : '3.1rem';

  // Per-type decorative emoji (left · right)
  const decoMap = {
    SWAP:    ['⚡', '🔄'], BUY:   ['🚀', '💎'],
    SELL:    ['💰', '📈'], SEND:  ['✈️', '💸'],
    RECEIVE: ['🎁', '💫'], STAKE: ['🔒', '💎'],
  };
  const [dl, dr] = decoMap[d.type] || ['🎲', '💫'];

  const footer = [d.date, d.platform, d.wallet].filter(Boolean).join(' · ');

  // Swap amounts — slightly smaller font since two rows
  const swapAmt = `clamp(1.6rem,8vw,${d.type === 'SWAP' ? '2.8rem' : '3.5rem'})`;

  return `
<div class="card-root t-neon" style="width:${w}px;height:${h}px">
  <div class="neon-inner">
    <div class="neon-label">${d.chainLabel} Blockchain</div>
    <div class="neon-decos">
      <span class="neon-deco">${dl}</span>
      <div class="neon-type" style="font-size:${typeSize}">${d.type}</div>
      <span class="neon-deco">${dr}</span>
    </div>
    <div class="neon-box">
      ${isSwap ? `
        <div class="neon-swap-row">
          <span class="neon-amt c-red" style="font-size:${swapAmt}">−${d.primary.amount}</span>
          <span class="neon-sym">${d.primary.symbol}</span>
        </div>
        <div class="neon-divider">↓</div>
        <div class="neon-swap-row">
          <span class="neon-amt c-green" style="font-size:${swapAmt}">+${d.secondary.amount}</span>
          <span class="neon-sym">${d.secondary.symbol}</span>
        </div>
      ` : d.primary ? `
        <div class="neon-amt ${ac}" style="font-size:clamp(2.2rem,10vw,3.8rem)">${d.primary.amount}</div>
        <div class="neon-sym">${d.primary.symbol}</div>
      ` : ''}
      ${d.usdValue ? `<div class="neon-usd">≈ ${d.usdValue}</div>` : ''}
    </div>
    <div class="neon-footer">${footer}</div>
  </div>
  <div class="csp-wm">cryptosocialproof.com</div>
</div>`;
}

// ── Terminal theme ──────────────────────────────────────────────────────────
function cardTerminal(d, w, h) {
  const isSwap = d.type === 'SWAP' && d.primary && d.secondary;
  const ac = d.amtColor === 'green' ? 'c-green' : d.amtColor === 'red' ? 'c-red' : '';

  let rows = `
    <div class="term-row"><span class="term-key">STATUS</span><span class="term-val c-green">CONFIRMED ✓</span></div>
    <div class="term-row"><span class="term-key">TYPE</span><span class="term-val">${d.type}</span></div>`;

  if (isSwap) {
    rows += `
    <div class="term-row"><span class="term-key">SENT</span><span class="term-val c-red">${d.primary.amount} ${d.primary.symbol}</span></div>
    <div class="term-row"><span class="term-key">RECV</span><span class="term-val c-green">${d.secondary.amount} ${d.secondary.symbol}</span></div>`;
  } else if (d.primary) {
    rows += `
    <div class="term-row"><span class="term-key">AMOUNT</span><span class="term-val ${ac}">${d.primary.amount} ${d.primary.symbol}</span></div>`;
  }
  if (d.usdValue) rows += `
    <div class="term-row"><span class="term-key">VALUE</span><span class="term-val">${d.usdValue}</span></div>`;
  if (d.date)     rows += `
    <div class="term-row"><span class="term-key">DATE</span><span class="term-val">${d.date}</span></div>`;
  if (d.platform) rows += `
    <div class="term-row"><span class="term-key">NETWORK</span><span class="term-val">${d.platform}</span></div>`;

  const shortSig = d.sig ? d.sig.slice(0, 28) + '…' : '—';

  return `
<div class="card-root t-terminal" style="width:${w}px;height:${h}px">
  <div class="term-inner">
    <div class="term-prompt">$ ${d.chain || 'solana'} verify --${d.chain === 'ethereum' ? 'hash' : 'sig'} ${shortSig}<span class="term-cursor"></span></div>
    <div class="term-type-line">&gt; ${d.type}</div>
    <div class="term-rows">${rows}
    </div>
    ${(d.wallet || d.sig) ? `<div class="term-hash">${d.wallet ? 'WALLET: ' + d.wallet + '\n' : ''}${d.sig ? 'SIG: ' + d.sig : ''}</div>` : ''}
  </div>
  <div class="csp-wm">cryptosocialproof.com</div>
</div>`;
}

// ── Aurora theme ────────────────────────────────────────────────────────────
function cardAurora(d, w, h) {
  const isSwap = d.type === 'SWAP' && d.primary && d.secondary;
  const ac = d.amtColor === 'green' ? 'c-green' : d.amtColor === 'red' ? 'c-red' : '';
  const footer = [d.date, d.platform, d.wallet].filter(Boolean).join('  ·  ');

  let amtBlock;
  if (isSwap) {
    amtBlock = `
      <div class="aurora-swap-out">−${d.primary.amount} <span style="font-size:13px;font-weight:600;opacity:.55">${d.primary.symbol}</span></div>
      <div class="aurora-arrow">↓</div>
      <div class="aurora-swap-in">+${d.secondary.amount} <span style="font-size:13px;font-weight:600;opacity:.55">${d.secondary.symbol}</span></div>`;
  } else if (d.primary) {
    amtBlock = `
      <div class="aurora-amt ${ac}">${d.primary.amount}</div>
      <div class="aurora-sym">${d.primary.symbol}</div>`;
  } else {
    amtBlock = '';
  }

  return `
<div class="card-root t-aurora" style="width:${w}px;height:${h}px">
  <div class="aurora-inner">
    <div class="aurora-tag">✦ ${d.chainLabel} Verified</div>
    <div class="aurora-type">${d.type}</div>
    ${amtBlock}
    ${d.usdValue ? `<div class="aurora-usd">≈ ${d.usdValue}</div>` : ''}
    <div class="aurora-divider"></div>
    <div class="aurora-meta">${footer}</div>
  </div>
  <div class="csp-wm">cryptosocialproof.com</div>
</div>`;
}

// ── Retro / Synthwave theme ─────────────────────────────────────────────────
function cardRetro(d, w, h) {
  const isSwap = d.type === 'SWAP' && d.primary && d.secondary;
  const ac = d.amtColor === 'green' ? 'c-green' : d.amtColor === 'red' ? 'c-red' : '';
  const footer = [d.date, d.platform, d.wallet].filter(Boolean).join(' · ');

  let amtBlock;
  if (isSwap) {
    amtBlock = `
      <div class="retro-amt c-red">−${d.primary.amount}</div>
      <div class="retro-sym">${d.primary.symbol}</div>
      <div style="font-size:16px;color:rgba(255,0,204,.7);margin:3px 0 2px">⬇</div>
      <div class="retro-amt c-green">+${d.secondary.amount}</div>
      <div class="retro-sym">${d.secondary.symbol}</div>`;
  } else if (d.primary) {
    amtBlock = `
      <div class="retro-amt ${ac}">${d.primary.amount}</div>
      <div class="retro-sym">${d.primary.symbol}</div>`;
  } else {
    amtBlock = '';
  }

  return `
<div class="card-root t-retro" style="width:${w}px;height:${h}px">
  <div class="retro-floor-wrap">
    <div class="retro-floor"></div>
  </div>
  <div class="retro-inner">
    <div class="retro-logo-line">◈ CryptoSocialProof ◈</div>
    <div class="retro-type">${d.type}</div>
    ${amtBlock}
    ${d.usdValue ? `<div class="retro-usd">≈ ${d.usdValue}</div>` : ''}
    <div class="retro-meta">${footer}</div>
  </div>
  <div class="csp-wm">cryptosocialproof.com</div>
</div>`;
}

// ═══════════════════════════════════════════
//  RENDER PREVIEW
// ═══════════════════════════════════════════
async function renderCardPreview() {
  const d = getCardPayload();
  const portrait = selSize === 'portrait';

  // Fit card to preview container on small screens (padding: 16px each side)
  const wrap  = document.getElementById('card-preview-wrap');
  const avail = wrap ? Math.floor(wrap.clientWidth - 32) : 400;
  const W     = Math.min(400, Math.max(260, avail));
  const H     = portrait ? Math.round(W * 1.25) : W;

  let html;
  switch (selTheme) {
    case 'dark':      html = cardDark(d, W, H);     break;
    case 'receipt':   html = cardReceipt(d, W, H);  break;
    case 'meme':      html = cardMeme(d, W, H);     break;
    case 'neon':      html = cardNeon(d, W, H);     break;
    case 'terminal':  html = cardTerminal(d, W, H); break;
    case 'aurora':    html = cardAurora(d, W, H);   break;
    case 'retro':     html = cardRetro(d, W, H);    break;
    case 'gradient':  html = cardGradient(d, W, H); break;
    case 'glass':     html = cardGlass(d, W, H);    break;
    case 'bold':      html = cardBold(d, W, H);     break;
    case 'stats':     html = cardStats(d, W, H);    break;
    case 'photo':     html = cardPhoto(d, W, H, photoDataUrl, photoZoom, photoPanX, photoPanY, photoNaturalW, photoNaturalH); break;
    default:          html = cardDark(d, W, H);
  }
  document.getElementById('card-preview').innerHTML = html;
}

// ═══════════════════════════════════════════
//  EXPORT / COPY / SHARE
// ═══════════════════════════════════════════

// Shared: renders the card to a high-res canvas and returns it.
async function renderToCanvas() {
  const cardEl = document.getElementById('card-preview').firstElementChild;
  if (!cardEl || typeof html2canvas === 'undefined') throw new Error('Export library not loaded.');

  const TARGET_W = 1080;
  const TARGET_H = selSize === 'portrait' ? 1350 : 1080;
  const dispW    = cardEl.offsetWidth;
  const dispH    = cardEl.offsetHeight;

  const srcCanvas = await html2canvas(cardEl, {
    scale: 2.5, useCORS: true, backgroundColor: null,
    width: dispW, height: dispH, logging: false
  });

  const final = document.createElement('canvas');
  final.width  = TARGET_W;
  final.height = TARGET_H;
  const ctx = final.getContext('2d');
  ctx.fillStyle = getComputedStyle(cardEl).backgroundColor || '#111111';
  ctx.fillRect(0, 0, TARGET_W, TARGET_H);

  const scaleToFit = Math.min(TARGET_W / dispW, TARGET_H / dispH);
  const dstW = dispW * scaleToFit, dstH = dispH * scaleToFit;
  const dstX = (TARGET_W - dstW) / 2, dstY = (TARGET_H - dstH) / 2;
  ctx.drawImage(srcCanvas, 0, 0, srcCanvas.width, srcCanvas.height, dstX, dstY, dstW, dstH);
  return final;
}

async function exportCard() {
  const overlay = document.getElementById('export-overlay');
  overlay.classList.add('visible');
  try {
    const canvas = await renderToCanvas();
    const link   = document.createElement('a');
    link.download = `cryptosocialproof_${txData.type.toLowerCase()}_${Date.now()}.png`;
    link.href     = canvas.toDataURL('image/png');
    link.click();
  } catch (e) {
    console.error('Export failed:', e);
    alert(e.message || 'Export failed — please try again.');
  } finally {
    overlay.classList.remove('visible');
  }
}

async function copyCard() {
  if (!navigator.clipboard?.write) {
    alert('Clipboard write is not supported in this browser. Please use the Download button instead.');
    return;
  }
  const btn     = document.getElementById('copy-btn');
  const overlay = document.getElementById('export-overlay');
  overlay.classList.add('visible');
  try {
    const canvas = await renderToCanvas();
    await new Promise((resolve, reject) => {
      canvas.toBlob(async blob => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          resolve();
        } catch (e) { reject(e); }
      }, 'image/png');
    });
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '⎘ Copy'; btn.classList.remove('copied'); }, 2000);
  } catch (e) {
    console.error('Copy failed:', e);
    alert('Could not copy to clipboard. Try downloading instead.');
  } finally {
    overlay.classList.remove('visible');
  }
}

// ── Gradient theme ──────────────────────────────────────────────────────────
function cardGradient(d, w, h) {
  const gradMap = {
    SWAP:    'linear-gradient(135deg,#4338ca 0%,#7c3aed 100%)',
    BUY:     'linear-gradient(135deg,#065f46 0%,#059669 100%)',
    RECEIVE: 'linear-gradient(135deg,#065f46 0%,#059669 100%)',
    SELL:    'linear-gradient(135deg,#7f1d1d 0%,#dc2626 100%)',
    SEND:    'linear-gradient(135deg,#7f1d1d 0%,#b45309 100%)',
    STAKE:   'linear-gradient(135deg,#4c1d95 0%,#6d28d9 100%)',
    UNKNOWN: 'linear-gradient(135deg,#1f2937 0%,#374151 100%)',
  };
  const bg = gradMap[d.type] || gradMap.UNKNOWN;
  const isSwap = d.type === 'SWAP' && d.primary && d.secondary;
  const meta = [d.date, d.platform, d.wallet].filter(Boolean).join(' · ');

  let amtBlock;
  if (isSwap) {
    amtBlock = `
      <div class="grad-amt" style="font-size:clamp(1.8rem,9vw,3rem);color:rgba(255,185,185,1)">−${d.primary.amount}</div>
      <div class="grad-sym">${d.primary.symbol}</div>
      <div style="color:rgba(255,255,255,.35);font-size:1.2rem;margin:4px 0">↓</div>
      <div class="grad-amt" style="font-size:clamp(1.8rem,9vw,3rem);color:rgba(185,255,215,1)">+${d.secondary.amount}</div>
      <div class="grad-sym">${d.secondary.symbol}</div>`;
  } else if (d.primary) {
    amtBlock = `
      <div class="grad-amt">${d.primary.amount}</div>
      <div class="grad-sym">${d.primary.symbol}</div>`;
  } else {
    amtBlock = '';
  }

  return `
<div class="card-root t-gradient" style="width:${w}px;height:${h}px;background:${bg}">
  <div class="grad-overlay"></div>
  <div class="grad-inner">
    <div class="grad-tag">${d.chainLabel} · Verified</div>
    <div class="grad-type">${d.type}</div>
    ${amtBlock}
    ${d.usdValue ? `<div class="grad-usd">≈ ${d.usdValue}</div>` : ''}
    <div class="grad-meta">${meta}</div>
  </div>
  <div class="csp-wm">cryptosocialproof.com</div>
</div>`;
}

// ── Glass theme ─────────────────────────────────────────────────────────────
function cardGlass(d, w, h) {
  const blobMap = {
    SWAP:    ['rgba(99,102,241,.5)',  'rgba(168,85,247,.4)'],
    BUY:     ['rgba(5,150,105,.5)',   'rgba(16,185,129,.38)'],
    RECEIVE: ['rgba(5,150,105,.5)',   'rgba(16,185,129,.38)'],
    SELL:    ['rgba(220,38,38,.5)',   'rgba(249,115,22,.4)'],
    SEND:    ['rgba(220,38,38,.5)',   'rgba(249,115,22,.4)'],
    STAKE:   ['rgba(124,58,237,.5)',  'rgba(99,102,241,.38)'],
    UNKNOWN: ['rgba(75,85,99,.5)',    'rgba(107,114,128,.38)'],
  };
  const [b1, b2] = blobMap[d.type] || blobMap.UNKNOWN;
  const isSwap = d.type === 'SWAP' && d.primary && d.secondary;
  const ac = d.amtColor === 'green' ? 'c-green' : d.amtColor === 'red' ? 'c-red' : '';
  const meta = [d.date, d.platform, d.wallet].filter(Boolean).join(' · ');
  const bW = Math.round(w * .65), bH = Math.round(h * .65);
  const bW2 = Math.round(w * .52), bH2 = Math.round(h * .52);

  let panelContent;
  if (isSwap) {
    panelContent = `
      <div class="glass-badge">${d.type}</div>
      <div class="glass-amt c-red" style="font-size:clamp(1.6rem,8vw,2.6rem)">−${d.primary.amount}</div>
      <div class="glass-sym">${d.primary.symbol}</div>
      <div style="color:rgba(255,255,255,.28);font-size:1.1rem;margin:6px 0">↓</div>
      <div class="glass-amt c-green" style="font-size:clamp(1.6rem,8vw,2.6rem)">+${d.secondary.amount}</div>
      <div class="glass-sym">${d.secondary.symbol}</div>
      ${d.usdValue ? `<div class="glass-usd">≈ ${d.usdValue}</div>` : ''}`;
  } else if (d.primary) {
    panelContent = `
      <div class="glass-badge">${d.type}</div>
      <div class="glass-amt ${ac}">${d.primary.amount}</div>
      <div class="glass-sym">${d.primary.symbol}</div>
      ${d.usdValue ? `<div class="glass-usd">≈ ${d.usdValue}</div>` : ''}`;
  } else {
    panelContent = `<div class="glass-badge">${d.type}</div>`;
  }

  return `
<div class="card-root t-glass" style="width:${w}px;height:${h}px">
  <div class="glass-blob" style="width:${bW}px;height:${bH}px;top:-12%;left:-12%;background:radial-gradient(circle,${b1} 0%,transparent 70%)"></div>
  <div class="glass-blob" style="width:${bW2}px;height:${bH2}px;bottom:-12%;right:-12%;background:radial-gradient(circle,${b2} 0%,transparent 70%)"></div>
  <div class="glass-inner">
    <div class="glass-panel">${panelContent}</div>
    <div class="glass-divider"></div>
    <div class="glass-meta">${meta}</div>
  </div>
  <div class="csp-wm">cryptosocialproof.com</div>
</div>`;
}

// ── Bold theme ──────────────────────────────────────────────────────────────
function cardBold(d, w, h) {
  const accentMap = {
    SWAP:    '#6366f1', BUY:     '#16a34a',
    RECEIVE: '#16a34a', SELL:    '#dc2626',
    SEND:    '#dc2626', STAKE:   '#7c3aed',
    UNKNOWN: '#6b7280',
  };
  const accent = accentMap[d.type] || '#6b7280';
  const isSwap = d.type === 'SWAP' && d.primary && d.secondary;
  const ac = d.amtColor === 'green' ? 'c-green' : d.amtColor === 'red' ? 'c-red' : '';
  const meta = [d.date, d.platform, d.wallet].filter(Boolean).join(' · ');

  let amtBlock;
  if (isSwap) {
    amtBlock = `
      <div class="bold-amt c-red" style="font-size:clamp(2rem,11vw,3.8rem)">−${d.primary.amount}</div>
      <div class="bold-sym">${d.primary.symbol}</div>
      <div style="color:#e5e7eb;font-size:1.1rem;margin:1px 0">↓</div>
      <div class="bold-amt c-green" style="font-size:clamp(2rem,11vw,3.8rem)">+${d.secondary.amount}</div>
      <div class="bold-sym">${d.secondary.symbol}</div>`;
  } else if (d.primary) {
    amtBlock = `
      <div class="bold-amt ${ac}">${d.primary.amount}</div>
      <div class="bold-sym">${d.primary.symbol}</div>`;
  } else {
    amtBlock = '';
  }

  return `
<div class="card-root t-bold" style="width:${w}px;height:${h}px">
  <div class="bold-accent-bar" style="background:${accent}"></div>
  <div class="bold-body">
    <div class="bold-ghost">${d.type}</div>
    <div class="bold-top">
      <div class="bold-type-label">${d.type} · ${d.chainLabel}</div>
      ${amtBlock}
      ${d.usdValue ? `<div class="bold-usd">≈ ${d.usdValue}</div>` : ''}
    </div>
    <div class="bold-bottom">
      <div class="bold-meta">${meta}</div>
    </div>
  </div>
  <div class="csp-wm">cryptosocialproof.com</div>
</div>`;
}

// ── Stats theme ─────────────────────────────────────────────────────────────
function statRow(key, val) {
  return `<div class="stats-row"><span class="stats-key">${key}</span><span class="stats-val">${val}</span></div>`;
}

function cardStats(d, w, h) {
  const barMap = {
    SWAP:    'linear-gradient(to right,#6366f1,#a855f7)',
    BUY:     'linear-gradient(to right,#059669,#10b981)',
    RECEIVE: 'linear-gradient(to right,#059669,#10b981)',
    SELL:    'linear-gradient(to right,#dc2626,#f97316)',
    SEND:    'linear-gradient(to right,#dc2626,#f97316)',
    STAKE:   'linear-gradient(to right,#7c3aed,#6366f1)',
    UNKNOWN: 'linear-gradient(to right,#4b5563,#6b7280)',
  };
  const bar = barMap[d.type] || barMap.UNKNOWN;
  const isSwap = d.type === 'SWAP' && d.primary && d.secondary;
  const ac = d.amtColor === 'green' ? 'c-green' : d.amtColor === 'red' ? 'c-red' : 'c-white';

  let amtSection;
  if (isSwap) {
    amtSection = `
      <div class="stats-amt-section">
        <div class="stats-amt c-red" style="font-size:clamp(1.8rem,9vw,3.2rem)">−${d.primary.amount}</div>
        <div class="stats-sym">${d.primary.symbol}</div>
        <div style="color:rgba(255,255,255,.22);font-size:0.9rem;margin:3px 0">→</div>
        <div class="stats-amt c-green" style="font-size:clamp(1.8rem,9vw,3.2rem)">+${d.secondary.amount}</div>
        <div class="stats-sym">${d.secondary.symbol}</div>
      </div>`;
  } else if (d.primary) {
    amtSection = `
      <div class="stats-amt-section">
        <div class="stats-amt ${ac}">${d.primary.amount}</div>
        <div class="stats-sym">${d.primary.symbol}</div>
        ${d.usdValue ? `<div class="stats-usd">≈ ${d.usdValue}</div>` : ''}
      </div>`;
  } else {
    amtSection = '';
  }

  let rows = '';
  if (d.date)                      rows += statRow('DATE', d.date);
  if (d.platform)                  rows += statRow('VIA', d.platform);
  if (isSwap && d.usdValue)        rows += statRow('VALUE', `≈ ${d.usdValue}`);
  rows += statRow('NETWORK', `${d.chainLabel} Mainnet`);
  rows += statRow('STATUS', 'Confirmed ✓');

  return `
<div class="card-root t-stats" style="width:${w}px;height:${h}px">
  <div class="stats-top-bar" style="background:${bar}"></div>
  <div class="stats-inner">
    <div class="stats-header">
      <div class="stats-type">${d.type}</div>
      <div class="stats-chain">${d.chainUpper}</div>
    </div>
    ${amtSection}
    <div class="stats-rows">${rows}</div>
  </div>
  <div class="csp-wm">cryptosocialproof.com</div>
</div>`;
}

// ═══════════════════════════════════════════
//  BUG REPORT MODAL
// ═══════════════════════════════════════════
function openBugModal() {
  document.getElementById('bug-modal-overlay').classList.add('visible');
  document.getElementById('bug-form').reset();
  document.getElementById('bug-form').classList.remove('hidden');
  document.getElementById('modal-success').classList.add('hidden');
}

function closeBugModal(e) {
  if (e && e.target !== document.getElementById('bug-modal-overlay')) return;
  document.getElementById('bug-modal-overlay').classList.remove('visible');
}

async function handleBugSubmit(e) {
  e.preventDefault();
  const category    = document.getElementById('bug-category').value;
  const description = document.getElementById('bug-desc').value;
  const btn = e.target.querySelector('.modal-submit');
  btn.disabled    = true;
  btn.textContent = 'Sending…';
  try {
    await fetch('https://formsubmit.co/ajax/cryptosocialproof@protonmail.com', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify({
        _subject:    'Bug Report — CryptoSocialProof',
        category,
        description,
      }),
    });
  } catch (_) { /* best-effort — show success regardless */ }
  document.getElementById('bug-form').classList.add('hidden');
  document.getElementById('modal-success').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('bug-modal-overlay').classList.remove('visible');
  }, 2800);
}

// Init preview pan/zoom interaction
initPreviewInteraction();
