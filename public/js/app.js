const API = '/api/products';

let state = {
  page: 1,
  limit: 20,
  total: 0,
  category: '',
  search: '',
  products: [],
};

const grid = document.getElementById('productGrid');
const empty = document.getElementById('emptyState');
const loading = document.getElementById('loadingState');
const pagination = document.getElementById('pagination');
const statusMsg = document.getElementById('statusMsg');
const modal = document.getElementById('modal');

function showStatus(msg, color = 'text-gray-500') {
  statusMsg.textContent = msg;
  statusMsg.className = `max-w-7xl mx-auto px-4 py-2 text-sm ${color}`;
  statusMsg.classList.remove('hidden');
  if (msg === '') statusMsg.classList.add('hidden');
}

function formatPrice(price, currency = 'CNY') {
  if (!price) return '—';
  const cny = parseFloat(price);
  const mnt = Math.round(cny * 380); // approximate CNY→MNT
  return `₮${mnt.toLocaleString()} <span class="text-xs font-normal text-gray-400">(¥${cny})</span>`;
}

function renderCard(p) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="aspect-square bg-gray-100 overflow-hidden">
      <img src="${p.image_url || ''}" alt="${p.title_mn || p.title_original}"
           class="w-full h-full object-cover"
           onerror="this.src='https://placehold.co/300x300?text=No+Image'"/>
    </div>
    <div class="p-2">
      <p class="text-xs font-medium text-gray-800 leading-snug line-clamp-2 mb-1">
        ${p.title_mn || p.title_original}
      </p>
      <p class="text-sm font-bold text-red-600">${formatPrice(p.price, p.currency)}</p>
      ${p.sold_count ? `<p class="text-xs text-gray-400">${p.sold_count.toLocaleString()} зарагдсан</p>` : ''}
    </div>
  `;
  card.addEventListener('click', () => openModal(p));
  return card;
}

function openModal(p) {
  document.getElementById('modalTitle').textContent = p.title_mn || p.title_original;
  document.getElementById('modalOrigTitle').textContent = p.title_original;
  document.getElementById('modalImage').src = p.image_url || 'https://placehold.co/400x400?text=No+Image';
  document.getElementById('modalPrice').innerHTML = formatPrice(p.price, p.currency);
  document.getElementById('modalSold').textContent = p.sold_count ? `${p.sold_count.toLocaleString()} зарагдсан` : '';
  document.getElementById('modalShop').textContent = p.shop_name ? `Дэлгүүр: ${p.shop_name}` : '';
  const link = document.getElementById('modalLink');
  link.href = p.product_url || '#';
  link.style.display = p.product_url ? 'block' : 'none';
  modal.classList.remove('hidden');
}

document.getElementById('modalClose').addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

function renderProducts(products) {
  grid.innerHTML = '';
  loading.classList.add('hidden');
  if (!products.length) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  products.forEach(p => grid.appendChild(renderCard(p)));

  const totalPages = Math.ceil(state.total / state.limit);
  if (totalPages > 1) {
    pagination.classList.remove('hidden');
    document.getElementById('pageInfo').textContent = `${state.page} / ${totalPages}`;
    document.getElementById('prevBtn').disabled = state.page <= 1;
    document.getElementById('nextBtn').disabled = state.page >= totalPages;
  } else {
    pagination.classList.add('hidden');
  }
}

async function loadProducts() {
  loading.classList.remove('hidden');
  empty.classList.add('hidden');
  grid.innerHTML = '';
  const params = new URLSearchParams({
    page: state.page,
    limit: state.limit,
    ...(state.category && { category: state.category }),
    ...(state.search && { search: state.search }),
  });
  const res = await fetch(`${API}?${params}`);
  const data = await res.json();
  state.total = data.total;
  state.products = data.products;
  renderProducts(state.products);
  showStatus(data.total ? `${data.total} бүтээгдэхүүн` : '');
}

async function searchTaobao(keyword) {
  showStatus(`"${keyword}" хайж байна...`, 'text-blue-500');
  loading.classList.remove('hidden');
  empty.classList.add('hidden');
  grid.innerHTML = '';
  try {
    const res = await fetch(`${API}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, page: state.page }),
    });
    const data = await res.json();
    const msg = data.mock
      ? `⚠️ Жишиг өгөгдөл: ${data.saved} бүтээгдэхүүн (сүлжээний хязгаарлалт)`
      : `✓ ${data.saved} бүтээгдэхүүн татаж Монгол руу орчуулав`;
    showStatus(msg, data.mock ? 'text-yellow-600' : 'text-green-600');
    state.page = 1;
    await loadProducts();
  } catch (err) {
    showStatus('Алдаа гарлаа: ' + err.message, 'text-red-500');
    loading.classList.add('hidden');
    empty.classList.remove('hidden');
  }
}

// Events
document.getElementById('searchBtn').addEventListener('click', () => {
  const kw = document.getElementById('searchInput').value.trim();
  if (!kw) return;
  state.search = kw;
  state.page = 1;
  searchTaobao(kw);
});

document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('searchBtn').click();
});

document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.category = btn.dataset.cat;
    state.page = 1;
    loadProducts();
  });
});

document.getElementById('prevBtn').addEventListener('click', () => { state.page--; loadProducts(); });
document.getElementById('nextBtn').addEventListener('click', () => { state.page++; loadProducts(); });

// Initial load
loadProducts();
