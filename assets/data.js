// Default catalog — admin panel overrides via localStorage
const FM_DEFAULT_PRODUCTS = [
  {id:1, name:"Signature Tee — Black",  category:"T-Shirts", price:550, img:"assets/img/tee-black.svg",     badge:"Best Seller", sizes:"S,M,L,XL"},
  {id:2, name:"Signature Tee — White",  category:"T-Shirts", price:550, img:"assets/img/tee-white.svg",     badge:"",            sizes:"S,M,L,XL"},
  {id:3, name:"Navy Classic Tee",       category:"T-Shirts", price:520, img:"assets/img/tee-navy.svg",      badge:"",            sizes:"S,M,L,XL"},
  {id:4, name:"Olive Everyday Tee",     category:"T-Shirts", price:520, img:"assets/img/tee-olive.svg",     badge:"New",         sizes:"S,M,L"},
  {id:5, name:"Burgundy Hoodie",        category:"Hoodies",  price:950, img:"assets/img/hoodie-burgundy.svg",badge:"Limited",     sizes:"M,L,XL"},
  {id:6, name:"Charcoal Gold Hoodie",   category:"Hoodies",  price:980, img:"assets/img/hoodie-charcoal.svg",badge:"",            sizes:"S,M,L,XL"},
  {id:7, name:"Black Gold Cap",         category:"Caps",     price:320, img:"assets/img/cap-black.svg",     badge:"New",         sizes:"One Size"},
];

const FM_DEFAULT_SETTINGS = {
  announcement: "Free shipping across Egypt on orders over 1000 EGP",
  heroTitle: "FARES <em>MASHOUR</em>",
  heroSubtitle: "Premium streetwear designed in Cairo. Wear your name with pride.",
};

function fmGet(key, def){
  try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
  catch(e){ return def; }
}
