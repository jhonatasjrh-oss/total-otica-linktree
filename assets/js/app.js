/* ═══════════════════════════════════════
   TOTAL ÓTICA — app.js
   Gerenciamento de produtos via localStorage
═══════════════════════════════════════ */

'use strict';

const WA_BASE   = 'https://wa.me/5562993162521?text=';
const STORE_KEY = 'totalOticaProducts';

/* ─── STORAGE ──────────────────────────────── */
function loadProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveProducts(products) {
  localStorage.setItem(STORE_KEY, JSON.stringify(products));
}

/* ─── TABS (index.html) ─────────────────────── */
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', (i === 0 && tab === 'links') || (i === 1 && tab === 'shop'));
  });
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('tab-' + tab);
  if (panel) panel.classList.add('active');
}

/* ─── RENDER PÚBLICO (index.html) ──────────── */
function renderPublic() {
  const products = loadProducts();

  // ── Shop grid
  const shopEl = document.getElementById('pub-shop-grid');
  if (!shopEl) return;

  if (products.length === 0) {
    shopEl.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:2.5rem;font-size:.85rem;line-height:1.7">
        Nenhum produto cadastrado ainda.<br>
        <a href="admin.html" style="color:var(--yellow)">Acesse o painel admin</a> para adicionar produtos.
      </p>`;
  } else {
    shopEl.innerHTML = products.map(p => `
      <a class="shop-item" href="${WA_BASE}${encodeURIComponent(p.waMsg || 'Olá, tenho interesse!')}" target="_blank">
        <div class="shop-img">
          ${p.img
            ? `<img src="${p.img}" alt="${escHtml(p.name)}">`
            : `<div class="shop-img-placeholder"><svg viewBox="0 0 24 24"><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 12h4M1 12h3M20 12h3"/></svg></div>`
          }
        </div>
        <div class="shop-info">
          <div class="shop-name">${escHtml(p.name)}</div>
          <div class="shop-price">${escHtml(p.price)}</div>
        </div>
        <a class="shop-btn" href="${WA_BASE}${encodeURIComponent(p.waMsg || 'Olá, tenho interesse!')}" target="_blank">
          💬 Pedir via WhatsApp
        </a>
      </a>`).join('');
  }

  // ── Featured (destaque no topo da aba Links)
  const featEl = document.getElementById('pub-featured');
  if (!featEl) return;

  const featured = products.filter(p => p.featured).slice(0, 3);
  if (featured.length === 0) {
    featEl.innerHTML = '';
    return;
  }

  const cols = ['cols-1', 'cols-2', 'cols-3'][Math.min(featured.length, 3) - 1];
  const items = featured.map(p => `
    <a class="pgrid-item" href="${WA_BASE}${encodeURIComponent(p.waMsg || '')}" target="_blank">
      ${p.img
        ? `<img src="${p.img}" alt="${escHtml(p.name)}">`
        : `<div class="pgrid-placeholder"><svg viewBox="0 0 24 24"><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 12h4M1 12h3M20 12h3"/></svg></div>`
      }
    </a>`).join('');

  featEl.innerHTML = `
    <p class="sec-label">Mais Vendidos</p>
    <div class="pgrid-card">
      <div class="pgrid ${cols}">${items}</div>
      <div class="pgrid-footer">
        <div>
          <div class="pgrid-label">Nossos destaques</div>
          <div class="pgrid-sub">${featured.length} produto${featured.length > 1 ? 's' : ''}</div>
        </div>
        <span style="color:var(--muted)">›</span>
      </div>
    </div>`;
}

/* ─── RENDER ADMIN (admin.html) ─────────────── */
function renderAdmin() {
  const products = loadProducts();
  const el = document.getElementById('admin-prod-list');
  if (!el) return;

  if (products.length === 0) {
    el.innerHTML = `<p class="empty-state">Nenhum produto cadastrado ainda.<br>Adicione o primeiro produto acima! 👆</p>`;
    return;
  }

  el.innerHTML = `<div class="prod-list">${products.map(p => `
    <div class="prod-item" data-id="${p.id}">
      <div class="prod-thumb">
        ${p.img
          ? `<img src="${p.img}" alt="${escHtml(p.name)}">`
          : `<span class="prod-thumb-ph">👓</span>`
        }
      </div>
      <div class="prod-info">
        <div class="prod-name">${escHtml(p.name)}</div>
        <div class="prod-meta">${escHtml(p.cat)} · ${escHtml(p.price)}${p.featured ? ' · ⭐ Destaque' : ''}</div>
      </div>
      <div class="prod-actions">
        <button class="btn btn-ghost btn-sm" onclick="editProduct(${p.id})">✏️ Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">🗑</button>
      </div>
    </div>`).join('')}</div>`;
}

/* ─── SAVE PRODUCT ──────────────────────────── */
let editingId  = null;
let imgBase64  = null;

function saveProduct() {
  const name     = val('inp-name');
  const price    = val('inp-price');
  const waMsg    = val('inp-wa') || `Olá, tenho interesse em ${name}!`;
  const cat      = val('inp-cat');
  const featured = document.getElementById('inp-featured')?.checked ?? false;

  if (!name || !price) {
    showToast('Preencha nome e preço!', true);
    return;
  }

  const products = loadProducts();

  if (editingId !== null) {
    const idx = products.findIndex(p => p.id === editingId);
    if (idx > -1) {
      products[idx] = {
        ...products[idx],
        name, price, waMsg, cat, featured,
        img: imgBase64 || products[idx].img
      };
    }
    editingId = null;
  } else {
    products.push({
      id: Date.now(),
      name, price, waMsg, cat, featured,
      img: imgBase64 || null
    });
  }

  saveProducts(products);
  renderAdmin();
  resetForm();
  showToast('✅ Produto salvo com sucesso!');
}

/* ─── EDIT ──────────────────────────────────── */
function editProduct(id) {
  const products = loadProducts();
  const p = products.find(x => x.id === id);
  if (!p) return;

  editingId = id;
  set('inp-name',  p.name);
  set('inp-price', p.price);
  set('inp-wa',    p.waMsg || '');
  set('inp-cat',   p.cat || 'Grau Feminino');
  if (document.getElementById('inp-featured'))
    document.getElementById('inp-featured').checked = p.featured || false;

  imgBase64 = p.img || null;
  const prev = document.getElementById('img-preview');
  const txt  = document.querySelector('.img-upload-text');
  if (prev && p.img) {
    prev.src = p.img;
    prev.style.display = 'block';
    if (txt) txt.style.display = 'none';
  }

  document.querySelector('.admin-section')?.scrollIntoView({ behavior: 'smooth' });
}

/* ─── DELETE ─────────────────────────────────── */
function deleteProduct(id) {
  if (!confirm('Remover este produto?')) return;
  const products = loadProducts().filter(p => p.id !== id);
  saveProducts(products);
  renderAdmin();
  showToast('Produto removido.');
}

/* ─── RESET FORM ─────────────────────────────── */
function resetForm() {
  editingId = null;
  imgBase64 = null;
  ['inp-name', 'inp-price', 'inp-wa'].forEach(id => set(id, ''));
  set('inp-cat', 'Grau Feminino');
  if (document.getElementById('inp-featured'))
    document.getElementById('inp-featured').checked = false;
  if (document.getElementById('inp-img'))
    document.getElementById('inp-img').value = '';
  const prev = document.getElementById('img-preview');
  const txt  = document.querySelector('.img-upload-text');
  if (prev) prev.style.display = 'none';
  if (txt)  txt.style.display = 'block';
}

/* ─── IMAGE PREVIEW ──────────────────────────── */
function previewImg(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    imgBase64 = e.target.result;
    const prev = document.getElementById('img-preview');
    const txt  = document.querySelector('.img-upload-text');
    if (prev) { prev.src = imgBase64; prev.style.display = 'block'; }
    if (txt)  txt.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

/* ─── TOAST ──────────────────────────────────── */
function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className   = 'toast' + (isError ? ' error' : '');
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => t.classList.remove('show'), 3200);
}

/* ─── HELPERS ────────────────────────────────── */
function val(id)      { return document.getElementById(id)?.value.trim() ?? ''; }
function set(id, v)   { if (document.getElementById(id)) document.getElementById(id).value = v; }
function escHtml(str) { return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ─── INIT ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('pub-shop-grid')) renderPublic();
  if (document.getElementById('admin-prod-list')) renderAdmin();
});
