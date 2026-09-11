
const slides=[...document.querySelectorAll('.hero-slide')];
const dots=[...document.querySelectorAll('#heroDots button')];
const counter=document.getElementById('slideCurrent');
const bar=document.getElementById('heroBar');
let slideIndex=0, heroTimer;
const HERO_MS=6500;
function setSlide(i){
  slides[slideIndex].classList.remove('active'); dots[slideIndex]?.classList.remove('active');
  slideIndex=(i+slides.length)%slides.length;
  slides[slideIndex].classList.add('active'); dots[slideIndex]?.classList.add('active');
  counter.textContent=String(slideIndex+1).padStart(2,'0');
  bar.style.transition='none';bar.style.width='0%';requestAnimationFrame(()=>{bar.style.transition=`width ${HERO_MS}ms linear`;bar.style.width='100%'});
}
function resetHero(){clearInterval(heroTimer);setSlide(slideIndex);heroTimer=setInterval(()=>setSlide(slideIndex+1),HERO_MS)}
document.getElementById('heroPrev').onclick=()=>{setSlide(slideIndex-1);resetHero()};
document.getElementById('heroNext').onclick=()=>{setSlide(slideIndex+1);resetHero()};
dots.forEach((d,i)=>d.onclick=()=>{setSlide(i);resetHero()});
resetHero();

const promoData=[
  {
    k:'DROP DE LA SEMANA',
    t:'Sci-fi <em>legendario</em>',
    p:'Descuentos especiales en figuras, estatuas y piezas de exhibición seleccionadas.',
    a:'assets/img/broly.png',
    b:'assets/img/goku.png'
  },
  {
    k:'NUEVO EN STOCK',
    t:'Anime <em>power-up</em>',
    p:'Nuevos lanzamientos y preventas para llevar tu colección a otro nivel.',
    a:'assets/img/luffy.png',
    b:'assets/img/kizaru.png'
  },
  {
    k:'RESTOCK LIMITADO',
    t:'Héroes <em>en grande</em>',
    p:'Estatuas y figuras premium con escalas que convierten la vitrina en un showcase.',
    a:'assets/img/dorado.png',
    b:'assets/img/negro..png'
  }
];
let promoIndex=0;
function setPromo(i){
  promoIndex=(i+promoData.length)%promoData.length;const d=promoData[promoIndex];
  document.getElementById('promoKicker').textContent=d.k;
  document.getElementById('promoTitle').innerHTML=d.t;
  document.getElementById('promoText').textContent=d.p;
  document.getElementById('promoImg1').src=d.a;document.getElementById('promoImg2').src=d.b;
  document.querySelectorAll('.promo-dots button').forEach((x,n)=>x.classList.toggle('active',n===promoIndex));
}
document.getElementById('promoPrev').onclick=()=>setPromo(promoIndex-1);
document.getElementById('promoNext').onclick=()=>setPromo(promoIndex+1);
setInterval(()=>setPromo(promoIndex+1),7000);

const row=document.getElementById('universeRow');
const thumb=document.getElementById('uniThumb');
function uniStep(){return (row.querySelector('.universe-card')?.getBoundingClientRect().width||220)+15}
document.getElementById('uniPrev').onclick=()=>row.scrollBy({left:-uniStep()*2,behavior:'smooth'});
document.getElementById('uniNext').onclick=()=>row.scrollBy({left:uniStep()*2,behavior:'smooth'});
function updateUni(){
  const max=row.scrollWidth-row.clientWidth, ratio=row.clientWidth/row.scrollWidth, pos=max?row.scrollLeft/max:0;
  thumb.style.width=Math.max(ratio*100,18)+'%';
  thumb.style.transform=`translateX(${pos*(100/ratio-100)}%)`;
}
row.addEventListener('scroll',updateUni,{passive:true});window.addEventListener('resize',updateUni);updateUni();

function updateTimer(){
  const now=new Date(), end=new Date(now);end.setHours(24,0,0,0);let diff=Math.max(0,end-now);
  document.getElementById('hours').textContent=String(Math.floor(diff/36e5)).padStart(2,'0');
  document.getElementById('minutes').textContent=String(Math.floor(diff%36e5/6e4)).padStart(2,'0');
  document.getElementById('seconds').textContent=String(Math.floor(diff%6e4/1e3)).padStart(2,'0');
}
updateTimer();setInterval(updateTimer,1000);

const products=[...document.querySelectorAll('.product')];
const tabs=[...document.querySelectorAll('.tab')];
const empty=document.getElementById('emptyProducts');
let activeFilter='all', searchTerm='';
function applyFilters(){
  let visible=0;
  products.forEach(p=>{
    const cats=p.dataset.category.split(' ');
    const title=p.querySelector('.product-title').textContent.toLowerCase();
    const universe=p.querySelector('.product-universe').textContent.toLowerCase();
    const matchesFilter=activeFilter==='all'||cats.includes(activeFilter);
    const matchesSearch=!searchTerm||title.includes(searchTerm)||universe.includes(searchTerm);
    const show=matchesFilter&&matchesSearch;p.classList.toggle('hidden',!show);if(show)visible++;
  });
  empty.classList.toggle('show',visible===0);
}
tabs.forEach(tab=>tab.addEventListener('click',()=>{
  tabs.forEach(t=>t.classList.remove('active'));tab.classList.add('active');activeFilter=tab.dataset.filter;applyFilters();
}));
document.getElementById('searchInput').addEventListener('input',e=>{searchTerm=e.target.value.trim().toLowerCase();applyFilters()});
document.querySelectorAll('[data-filter-link]').forEach(a=>a.addEventListener('click',()=>{setTimeout(()=>document.querySelector('.tab[data-filter="'+a.dataset.filterLink+'"]')?.click(),250)}));
document.querySelector('[data-tab="preorder"]')?.addEventListener('click',()=>setTimeout(()=>document.querySelector('.tab[data-filter="preorder"]')?.click(),250));

document.getElementById('sortProducts').addEventListener('change',e=>{
  const grid=document.getElementById('products');
  const sorted=[...products].sort((a,b)=>e.target.value==='low'?+a.dataset.price-+b.dataset.price:e.target.value==='high'?+b.dataset.price-+a.dataset.price:products.indexOf(a)-products.indexOf(b));
  sorted.forEach(p=>grid.appendChild(p));
});

let cart=0;
const toast=document.getElementById('toast');
function showToast(msg){toast.innerHTML=msg;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),2200)}
document.querySelectorAll('.add').forEach(btn=>btn.addEventListener('click',()=>{
  cart++;document.getElementById('cartCount').textContent=cart;showToast('<b>Agregado al carrito</b> · Tu figura está a salvo.');
}));
document.querySelectorAll('.wish').forEach(btn=>btn.addEventListener('click',()=>{
  btn.classList.toggle('liked');btn.style.color=btn.classList.contains('liked')?'var(--pink)':'#fff';showToast(btn.classList.contains('liked')?'<b>Guardado</b> · Añadido a favoritos.':'Eliminado de favoritos.');
}));
document.querySelectorAll('.quick').forEach(btn=>btn.addEventListener('click',()=>showToast('<b>Vista rápida</b> · Puedes conectar aquí tu modal de producto.')));
document.querySelector('.newsletter-form').addEventListener('submit',()=>showToast('<b>¡Bienvenido al club!</b> · Revisa tu correo para confirmar.'));

const back=document.getElementById('backTop');
window.addEventListener('scroll',()=>back.classList.toggle('show',scrollY>650));
back.onclick=()=>scrollTo({top:0,behavior:'smooth'});

document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('nav').classList.remove('open')));
