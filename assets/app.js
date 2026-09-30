// Storefront logic (index + shop)
function fmSettings(){
  const s = fmGet("fm_settings", FM_DEFAULT_SETTINGS);
  const bar = document.querySelector(".announce");
  if(bar) bar.textContent = s.announcement;
  const h = document.querySelector(".hero h1");
  if(h) h.innerHTML = s.heroTitle;
  const p = document.querySelector(".hero p");
  if(p) p.textContent = s.heroSubtitle;
}

function fmProducts(){ return fmGet("fm_products", FM_DEFAULT_PRODUCTS); }

function fmCard(p){
  return `<div class="card">
    ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
    <img src="${p.img}" alt="${p.name}">
    <div class="body">
      <div class="cat">${p.category}</div>
      <h4>${p.name}</h4>
      <div class="price">${p.price} EGP</div>
    </div></div>`;
}

function fmRenderShop(filter){
  const grid = document.getElementById("shop-grid");
  if(!grid) return;
  const list = fmProducts().filter(p => !filter || p.category === filter);
  grid.innerHTML = list.length ? list.map(fmCard).join("")
                               : "<p>No products in this category yet.</p>";
}

function fmRenderFeatured(){
  const grid = document.getElementById("featured");
  if(!grid) return;
  grid.innerHTML = fmProducts().slice(0,4).map(fmCard).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  fmSettings();
  fmRenderFeatured();
  fmRenderShop(new URLSearchParams(location.search).get("cat"));
  document.querySelectorAll(".pill[data-cat]").forEach(b =>
    b.addEventListener("click", () => fmRenderShop(b.dataset.cat)));
});
