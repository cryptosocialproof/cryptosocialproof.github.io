'use strict';

// ═══════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════

const RPC_ENDPOINTS = [
  'https://solana-rpc.publicnode.com',
  'https://mainnet.sonic.game/',
  'https://api.mainnet-beta.solana.com',
];

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

async function rpcCall(method, params, { retryOnNull = false } = {}) {
  const body = JSON.stringify({ jsonrpc: '2.0', id: 1, method, params });
  const opts  = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body };

  let lastErr;
  for (const endpoint of RPC_ENDPOINTS) {
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

  const tokenChanges = rawChanges.map(c => ({
    mint:   c.mint,
    delta:  c.delta,
    symbol: c.mint === 'SOL_NATIVE' ? 'SOL' : (metaMap[c.mint] || trunc(c.mint)),
  }));

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

const DEMO_SIG = '4MByS4iiDSerLeY276PDGMkUbAqWx2cQZ4PgqY2xn9pv5Gr2wfwrrtebDi8RU3LFm5C9PsbMs8NEMcjMS19tq3Gm';

sigInput.addEventListener('input', () => {
  sigInput.classList.remove('input-err');
  inputError.classList.remove('visible');
});
sigInput.addEventListener('keydown', e => { if (e.key === 'Enter') fetchBtn.click(); });

document.getElementById('demo-btn').addEventListener('click', () => {
  sigInput.value = DEMO_SIG;
  sigInput.classList.remove('input-err');
  inputError.classList.remove('visible');
  fetchBtn.click();
});

fetchBtn.addEventListener('click', async () => {
  const sig = sigInput.value.trim();
  if (!sig) { showInputError('Please paste a transaction signature.'); return; }
  if (!validSig(sig)) {
    showInputError('That doesn\'t look like a Solana signature. Signatures are 87–88 base58 characters — you can find yours on Solscan or in your wallet\'s transaction history.');
    return;
  }

  sigInput.classList.remove('input-err');
  inputError.classList.remove('visible');
  fetchBtn.disabled = true;

  goToStep(1);
  fStatus.textContent = 'Connecting to Solana…';
  fSub.textContent    = 'Querying public RPC endpoints';

  try {
    fStatus.textContent = 'Fetching transaction…';
    fSub.textContent    = 'Resolving token symbols — this may take a few seconds';
    txData = await parseTx(sig);

    if (!txData) {
      goToStep(0);
      showInputError('Transaction not found. Double-check the signature or wait a minute if it was just submitted — it may still be finalising on-chain.');
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
      showInputError('Could not reach the Solana network. Check your connection and try again — public RPC endpoints can occasionally be slow.');
    } else if (/not found|invalid/i.test(e.message)) {
      showInputError('Transaction not found. Make sure you\'re using the full signature (not a shortened link or tx hash).');
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
  const { type, date, wallet, platform, tokenChanges, solDelta } = txData;
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
      html += row('SOL', `<span style="color:${color}">${sign}${fmtAmt(solDelta)} SOL</span>`);
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
let _panDragging = false;
let _panStartX = 0, _panStartY = 0;
let _panStartPanX = 0, _panStartPanY = 0;

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
  const W = 400, H = portrait ? 500 : 400;
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
    const fit = photoFitSize(W, photoH);
    // scale: card is rendered at W px; wrap may be a different display size
    const wrapRect = wrap.getBoundingClientRect();
    const displayScale = wrapRect.width / (W + 32); // 32 = 2×16px padding
    photoPanX = _panStartPanX + (e.clientX - _panStartX) / (fit.w * photoZoom * displayScale);
    photoPanY = _panStartPanY + (e.clientY - _panStartY) / (fit.h * photoZoom * displayScale);
    renderCardPreview();
  });
  window.addEventListener('mouseup', () => { _panDragging = false; });

  wrap.addEventListener('touchstart', e => {
    if (selTheme !== 'photo' || !photoDataUrl) return;
    _panDragging = true;
    _panStartX = e.touches[0].clientX; _panStartY = e.touches[0].clientY;
    _panStartPanX = photoPanX; _panStartPanY = photoPanY;
    e.preventDefault();
  }, { passive: false });
  window.addEventListener('touchmove', e => {
    if (!_panDragging) return;
    const { W, photoH } = photoAreaSize();
    const fit = photoFitSize(W, photoH);
    const wrapRect = wrap.getBoundingClientRect();
    const displayScale = wrapRect.width / (W + 32);
    photoPanX = _panStartPanX + (e.touches[0].clientX - _panStartX) / (fit.w * photoZoom * displayScale);
    photoPanY = _panStartPanY + (e.touches[0].clientY - _panStartY) / (fit.h * photoZoom * displayScale);
    renderCardPreview();
    e.preventDefault();
  }, { passive: false });
  window.addEventListener('touchend', () => { _panDragging = false; });

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
// ═══════════════════════════════════════════
function getCardPayload() {
  const { type, date, wallet, platform, tokenChanges, solDelta, usdValue } = txData;
  const showP   = document.getElementById('tog-platform').checked;
  const showUsd = document.getElementById('tog-usd').checked;

  let primary = null, secondary = null;

  if (type === 'SWAP') {
    const dec = tokenChanges.find(c => c.delta < 0);
    const inc = tokenChanges.find(c => c.delta > 0);
    if (dec) primary   = { symbol: dec.symbol, amount: fmtAmt(Math.abs(dec.delta)) };
    if (inc) secondary = { symbol: inc.symbol, amount: fmtAmt(inc.delta) };
  } else if (tokenChanges.length > 0) {
    const t = tokenChanges[0];
    primary = { symbol: t.symbol, amount: fmtAmt(Math.abs(t.delta)) };
  } else if (Math.abs(solDelta) > 0.000001) {
    primary = { symbol: 'SOL', amount: fmtAmt(Math.abs(solDelta)) };
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
    <div class="neon-label">Solana Blockchain</div>
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
    <div class="term-prompt">$ solana verify --sig ${shortSig}<span class="term-cursor"></span></div>
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
    <div class="aurora-tag">✦ Solana Verified</div>
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
  const W = 400, H = portrait ? 500 : 400;

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
    <div class="grad-tag">Solana · Verified</div>
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
      <div class="bold-type-label">${d.type} · Solana</div>
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
  rows += statRow('NETWORK', 'Solana Mainnet');
  rows += statRow('STATUS', 'Confirmed ✓');

  return `
<div class="card-root t-stats" style="width:${w}px;height:${h}px">
  <div class="stats-top-bar" style="background:${bar}"></div>
  <div class="stats-inner">
    <div class="stats-header">
      <div class="stats-type">${d.type}</div>
      <div class="stats-chain">SOLANA</div>
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
