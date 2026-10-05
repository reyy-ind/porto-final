(function(){
  const D=window.DATA, $=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const li=a=>a.map(x=>`<li>${esc(x)}</li>`).join("");
  $("name").innerHTML=D.name.map((n,i)=>i<2?`<span>${n}</span>`:`<small>${n}</small>`).join("");
  $("roles").textContent=D.roles.join(" · ");
  $("school2").textContent=D.school; $("idrole").textContent=D.roles.slice(0,2).join(" · ");
  const m=D.roles.map(esc).join("<b>•</b>")+"<b>•</b>"; $("mq").innerHTML=m+m+m+m;
  $("awards").innerHTML=li(D.awards); $("hobbies").innerHTML=li(D.hobbies);
  $("iphl").innerHTML=li(D.iphone);
    $("exp").innerHTML=li(D.exp);
  $("links").innerHTML=D.contact.map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener">${esc(t)}</a>`).join("")+`<p class="muted" style="margin-top:24px">${esc(D.school)}</p>`;
  $("bars").innerHTML=D.code.map(([n,t,p])=>`<div class="bar"><span>${n}<em>${t}</em></span><i><b data-w="${p}"></b></i></div>`).join("");
  document.querySelectorAll(".bar b").forEach(b=>{
    const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){b.style.width=b.dataset.w+"%";o.disconnect()}});o.observe(b);
  });

  function lightbox(src){const d=document.createElement("div");d.className="lb";d.innerHTML=`<img src="${src}" alt="">`;d.onclick=()=>d.remove();document.body.append(d)}
  function card(w){
    const u=esc(w.media_url||"");
    const media=w.media_type==="video"?`<video src="${u}" controls preload="metadata"></video>`
      :w.media_type==="image"?`<img src="${u}" alt="${esc(w.title)}" loading="lazy" draggable="false">`
      :`<a class="f" href="${u}" target="_blank" rel="noopener">Unduh file</a>`;
    return `<article class="card">${media}<div><b>${esc(w.title)}</b><p class="muted">${esc(w.description||"")}</p></div></article>`;
  }
  function carousel(key,items){
    const el=$("c-"+key); if(!el) return;
    if(!items.length){el.innerHTML="";return}
    el.innerHTML=`<div class="track ${key}">${items.map(card).join("")}</div><div class="nav2"><button aria-label="Sebelumnya">&#8592;</button><button aria-label="Berikutnya">&#8594;</button></div>`;
    const tr=el.querySelector(".track"), [p,n]=el.querySelectorAll(".nav2 button");
    p.onclick=()=>tr.scrollBy({left:-tr.clientWidth*.8,behavior:"smooth"});
    n.onclick=()=>tr.scrollBy({left:tr.clientWidth*.8,behavior:"smooth"});
    tr.addEventListener("click",e=>{if(e.target.tagName==="IMG")lightbox(e.target.src)});
    if(AUTO.includes(key)) autoplay(tr);
  }
  // Gerak sendiri seperti marquee: set kartu digandakan, loop tanpa putus.
  // Berhenti saat disentuh/di-hover, lanjut lagi otomatis.
  const AUTO=["ndv","poster"];
  function autoplay(tr){
    if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const n=tr.children.length;
    if(n<3) return;
    tr.insertAdjacentHTML("beforeend",tr.innerHTML);
    [...tr.children].slice(n).forEach(c=>c.setAttribute("aria-hidden","true"));
    tr.style.scrollSnapType="none";
    let pos=0,hold=false,t;
    const half=()=>tr.scrollWidth/2;
    const stop=()=>{hold=true;clearTimeout(t)};
    const go=(d=0)=>{clearTimeout(t);t=setTimeout(()=>{pos=tr.scrollLeft;hold=false},d)};
    tr.addEventListener("pointerenter",e=>{if(e.pointerType==="mouse")stop()});
    tr.addEventListener("pointerleave",e=>{if(e.pointerType==="mouse")go(300)});
    tr.addEventListener("touchstart",stop,{passive:true});
    tr.addEventListener("touchend",()=>go(2500));
    tr.addEventListener("wheel",()=>{stop();go(2500)},{passive:true});
    tr.parentElement.querySelectorAll(".nav2 button").forEach(b=>b.addEventListener("click",()=>{stop();go(2500)}));
    let vis=true;
    new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(tr);
    (function loop(){
      if(!hold&&vis){
        pos+=.7;
        if(pos>=half()) pos-=half();
        tr.scrollLeft=pos;
      } else if(hold) {
        const h=half(); if(tr.scrollLeft>=h) tr.scrollLeft-=h;
      }
      requestAnimationFrame(loop);
    })();
  }
  $("apps").innerHTML=D.apps.map(([t,f,u])=>{
    const img=`<img src="assets/apps/${f}.jpg" alt="Logo ${esc(t)}" loading="lazy" draggable="false">`;
    return u?`<a class="app" href="${esc(u)}" target="_blank" rel="noopener">${img}<b>${esc(t)}</b><small>Buka aplikasi ↗</small></a>`
      :`<div class="app off">${img}<b>${esc(t)}</b><small>Masih di Android Studio</small></div>`;
  }).join("");
  const keys=["ndv","poster","iphone","lainnya"];
  const base={ndv:D.produk,poster:D.poster};
  keys.forEach(k=>carousel(k,base[k]||[]));
  window.fetchWorks().then(all=>{
    keys.forEach(k=>carousel(k,[...(base[k]||[]),...all.filter(w=>w.category===k).reverse()]));
    $("lainnya").hidden=!all.some(w=>w.category==="lainnya");
    const extra=all.filter(w=>w.category==="pengalaman").reverse();
    $("exp").insertAdjacentHTML("beforeend",li(extra.map(w=>w.title)));
  });
})();
