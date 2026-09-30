// Admin panel — client-side control of catalog & site settings
const FM_PASS_KEY = "fm_admin_pass";
const FM_SESSION  = "fm_admin_ok";

function fmLogged(){ return sessionStorage.getItem(FM_SESSION) === "1"; }

function fmLogin(e){
  e.preventDefault();
  const inp = document.getElementById("pass").value;
  const saved = localStorage.getItem(FM_PASS_KEY) || "admin123";
  if(inp === saved){ sessionStorage.setItem(FM_SESSION,"1"); location.reload(); }
  else document.getElementById("login-err").textContent = "Wrong password. Try again.";
}

function fmLogout(){ sessionStorage.removeItem(FM_SESSION); location.reload(); }

function fmSaveProducts(list){
  localStorage.setItem("fm_products", JSON.stringify(list));
}

function fmRenderTable(){
  const tb = document.getElementById("prod-rows");
  tb.innerHTML = fmProducts().map(p => `<tr>
    <td><img src="${p.img}"></td>
    <td>${p.name}</td><td>${p.category}</td><td>${p.price} EGP</td>
    <td>${p.badge || "—"}</td>
    <td>
      <button class="btn small dark" onclick="fmEdit(${p.id})">Edit</button>
      <button class="btn small danger" onclick="fmDelete(${p.id})">Delete</button>
    </td></tr>`).join("");
}

function fmAdd(e){
  e.preventDefault();
  const g = id => document.getElementById(id).value.trim();
  const list = fmProducts();
  const id = parseInt(document.getElementById("edit-id").value) || (list.length ? Math.max(...list.map(p=>p.id))+1 : 1);
  const item = {id, name:g("f-name"), category:g("f-cat"), price:parseFloat(g("f-price"))||0,
                img:g("f-img")||"assets/img/tee-black.svg", badge:g("f-badge"), sizes:g("f-sizes")||"S,M,L,XL"};
  const i = list.findIndex(p => p.id === id);
  if(i >= 0) list[i] = item; else list.push(item);
  fmSaveProducts(list); fmRenderTable(); fmResetForm();
  fmMsg("Saved. Open the shop page to see it live.", "ok");
}

function fmEdit(id){
  const p = fmProducts().find(x => x.id === id); if(!p) return;
  document.getElementById("edit-id").value = p.id;
  document.getElementById("f-name").value = p.name;
  document.getElementById("f-cat").value = p.category;
  document.getElementById("f-price").value = p.price;
  document.getElementById("f-img").value = p.img;
  document.getElementById("f-badge").value = p.badge || "";
  document.getElementById("f-sizes").value = p.sizes || "";
  window.scrollTo({top:0, behavior:"smooth"});
}

function fmDelete(id){
  if(!confirm("Delete this product?")) return;
  fmSaveProducts(fmProducts().filter(p => p.id !== id));
  fmRenderTable(); fmMsg("Product deleted.", "ok");
}

function fmResetForm(){
  document.getElementById("prod-form").reset();
  document.getElementById("edit-id").value = "";
}

function fmSaveSettings(e){
  e.preventDefault();
  const s = {announcement: document.getElementById("s-announce").value,
             heroTitle: document.getElementById("s-title").value,
             heroSubtitle: document.getElementById("s-sub").value};
  localStorage.setItem("fm_settings", JSON.stringify(s));
  fmMsg("Settings saved.", "ok");
}

function fmSavePass(e){
  e.preventDefault();
  localStorage.setItem(FM_PASS_KEY, document.getElementById("new-pass").value);
  fmMsg("Password updated.", "ok");
}

function fmExport(){
  const blob = new Blob([JSON.stringify({products: fmProducts(), settings: fmGet("fm_settings", FM_DEFAULT_SETTINGS)}, null, 2)],
                        {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "fares-mashour-catalog.json"; a.click();
}

function fmImport(e){
  const f = e.target.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = () => {
    try{
      const d = JSON.parse(r.result);
      if(d.products) fmSaveProducts(d.products);
      if(d.settings) localStorage.setItem("fm_settings", JSON.stringify(d.settings));
      fmRenderTable(); fmMsg("Import complete.", "ok");
    }catch(err){ fmMsg("Invalid JSON file.", "err"); }
  };
  r.readAsText(f);
}

function fmResetAll(){
  if(!confirm("Reset catalog to defaults? This removes all your changes.")) return;
  localStorage.removeItem("fm_products"); localStorage.removeItem("fm_settings");
  fmRenderTable(); fmMsg("Catalog reset to defaults.", "ok");
}

function fmMsg(t, cls){
  const m = document.getElementById("msg");
  m.className = "msg " + cls; m.textContent = t;
  setTimeout(() => m.className = "msg", 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  if(!fmLogged()) return;
  fmRenderTable();
  const s = fmGet("fm_settings", FM_DEFAULT_SETTINGS);
  document.getElementById("s-announce").value = s.announcement;
  document.getElementById("s-title").value = s.heroTitle;
  document.getElementById("s-sub").value = s.heroSubtitle;
});
