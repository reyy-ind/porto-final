// Kartu ID menggantung: ayun mengikuti mouse, bisa ditarik/diseret, memantul kembali (spring).
(function(){
  const c=document.getElementById("swing"), hero=document.getElementById("hero");
  if(!c||matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let a=0,v=0,t=0,drag=false;
  const ang=e=>{const r=c.getBoundingClientRect(),px=r.left+r.width/2,dx=e.clientX-px,dy=Math.max(60,e.clientY-r.top);
    return Math.max(-38,Math.min(38,-Math.atan2(dx,dy)*180/Math.PI))};
  hero.addEventListener("pointermove",e=>{
    if(drag){a=ang(e);v=0}
    else if(e.pointerType==="mouse"){const r=hero.getBoundingClientRect();t=((e.clientX-r.left)/r.width-.5)*-10}
  });
  c.addEventListener("pointerdown",e=>{drag=true;t=0;c.setPointerCapture(e.pointerId)});
  const up=()=>{drag=false};
  c.addEventListener("pointerup",up);c.addEventListener("pointercancel",up);
  (function loop(){
    if(!drag){v+=(t-a)*.018;v*=.965;a+=v}
    c.style.transform=`rotate(${a.toFixed(2)}deg)`;requestAnimationFrame(loop);
  })();
  v=6; // ayunan awal
})();
