const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd&include_24hr_change=true';

async function fetchPrices() {
  const cardContainer = document.getElementById('price-cards');
  const refreshButton = document.getElementById('refresh-button');
  if (!cardContainer || !refreshButton) return;

  cardContainer.innerHTML = '<div class="price-card placeholder"><p>Loading prices...</p></div>';
  refreshButton.disabled = true;

  try {
    const response = await fetch(COINGECKO_URL);
    const data = await response.json();

    cardContainer.innerHTML = '';
    renderPriceCard('bitcoin', 'Bitcoin', data.bitcoin);
    renderPriceCard('ethereum', 'Ethereum', data.ethereum);
  } catch (error) {
    cardContainer.innerHTML = '<div class="price-card placeholder"><p>Unable to load prices. Try again later.</p></div>';
  } finally {
    refreshButton.disabled = false;
  }
}

function renderPriceCard(id, name, data) {
  const container = document.getElementById('price-cards');
  const change = data.usd_24h_change;
  const isPositive = change >= 0;
  const html = `
    <article class="price-card">
      <h3>${name}</h3>
      <p class="price-value">$${formatUsd(data.usd)}</p>
      <p class="price-change ${isPositive ? 'positive' : 'negative'}">
        ${isPositive ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}% in 24h
      </p>
    </article>
  `;
  container.insertAdjacentHTML('beforeend', html);
}

function formatUsd(value) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

async function hashText(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function getBlockElements(index) {
  return {
    data: document.getElementById(`block${index}-data`),
    prev: document.getElementById(`block${index}-prev`),
    nonce: document.getElementById(`block${index}-nonce`),
    mine: document.getElementById(`block${index}-mine`),
    hash: document.getElementById(`block${index}-hash`),
    status: document.getElementById(`block${index}-status`),
  };
}

async function updateBlock(index, setPrev = false) {
  const current = getBlockElements(index);
  const data = current.data.value.trim();
  const prevHash = current.prev.value.trim();
  const nonce = Number(current.nonce.value);
  const fullText = `${data}|${prevHash}|${nonce}`;
  const hash = await hashText(fullText);

  current.hash.textContent = hash;
  const isValid = hash.startsWith('00');
  current.status.textContent = isValid ? 'Block Valid' : 'Block Invalid';
  current.status.style.color = isValid ? '#7af78d' : '#ff8a8a';

  if (index === 1 && setPrev) {
    const block2Prev = document.getElementById('block2-prev');
    block2Prev.value = hash;
  }

  if (index === 1) {
    const block2Status = document.getElementById('block2-status');
    if (block2Status && block2Status.textContent !== 'Waiting') {
      verifyBlock2();
    }
  }
}

async function verifyBlock2() {
  const block1Hash = document.getElementById('block1-hash').textContent.trim();
  const block2 = getBlockElements(2);
  const block2Hash = await hashText(`${block2.data.value.trim()}|${block2.prev.value.trim()}|${Number(block2.nonce.value)}`);
  const isValid = block2Hash.startsWith('00') && block2.prev.value.trim() === block1Hash;

  block2.hash.textContent = block2Hash;
  block2.status.textContent = isValid ? 'Block Valid' : 'Block Invalid';
  block2.status.style.color = isValid ? '#7af78d' : '#ff8a8a';
}

async function mineBlock(index) {
  const block = getBlockElements(index);
  block.mine.disabled = true;
  block.mine.textContent = 'Mining...';
  let nonce = Number(block.nonce.value);
  let hash = await hashText(`${block.data.value.trim()}|${block.prev.value.trim()}|${nonce}`);

  while (!hash.startsWith('00')) {
    nonce += 1;
    block.nonce.value = nonce;
    hash = await hashText(`${block.data.value.trim()}|${block.prev.value.trim()}|${nonce}`);
  }

  block.hash.textContent = hash;
  block.status.textContent = 'Block Valid';
  block.status.style.color = '#7af78d';
  block.mine.textContent = 'Mine Block ' + index;
  block.mine.disabled = false;

  if (index === 1) {
    const block2Prev = document.getElementById('block2-prev');
    block2Prev.value = hash;
    verifyBlock2();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const refreshButton = document.getElementById('refresh-button');
  if (refreshButton) {
    refreshButton.addEventListener('click', fetchPrices);
    fetchPrices();
  }

  const block1 = getBlockElements(1);
  const block2 = getBlockElements(2);

  if (block1.data && block1.nonce) {
    block1.data.addEventListener('input', () => updateBlock(1, false));
    block1.nonce.addEventListener('input', () => updateBlock(1, false));
  }

  if (block2.data && block2.nonce) {
    block2.data.addEventListener('input', verifyBlock2);
    block2.nonce.addEventListener('input', verifyBlock2);
  }

  if (block1.mine) {
    block1.mine.addEventListener('click', () => mineBlock(1));
  }

  if (block2.mine) {
    block2.mine.addEventListener('click', () => mineBlock(2));
  }

  if (block2.prev) {
    block2.prev.value = '00000000000000000000000000000000';
  }
});
