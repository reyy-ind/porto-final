// Hanya akun admin (Firebase Auth) yang bisa tambah/hapus. Pengamanan sebenarnya ada di Firestore/Storage rules.
(function(){
  const $=id=>document.getElementById(id), F=window.fb;
  const msg=t=>$("msg").textContent=t;
  if(!F){msg("Firebase belum disambungkan. Isi js/config.js dulu.");return}
  $("cat").innerHTML=window.DATA.cats.map(([k,l])=>`<option value="${k}">${l}</option>`).join("");
  F.auth.onAuthStateChanged(u=>{$("lf").hidden=!!u;$("panel").hidden=!u;if(u)list()});
  async function list(){
    const w=await window.fetchWorks();
    $("list").innerHTML=w.length?"":"<p class='muted'>Belum ada karya.</p>";
    w.forEach(x=>{
      const r=document.createElement("div");r.className="row";
      const s=document.createElement("span");s.textContent=`[${x.category}] ${x.title}`;
      const b=document.createElement("button");b.textContent="Hapus";
      b.onclick=async()=>{
        if(!confirm("Hapus karya ini?"))return;
        try{ if(x.storage_path) await F.st.ref(x.storage_path).delete(); }catch(e){}
        await F.db.collection("works").doc(x.id).delete(); list();
      };
      r.append(s,b);$("list").append(r);
    });
  }
  $("lf").onsubmit=async e=>{
    e.preventDefault();
    try{await F.auth.signInWithEmailAndPassword($("em").value,$("pw").value);msg("")}
    catch(err){msg("Login gagal: "+err.message)}
  };
  $("out").onclick=()=>F.auth.signOut();
  $("up").onclick=async()=>{
    const f=$("fi").files[0], t=$("ti").value.trim(), cat=$("cat").value;
    if(!t||(!f&&cat!=="pengalaman")){msg("Isi judul dan pilih file.");return}
    msg("Mengunggah…");
    try{
      let url="",path=null,type="text";
      if(f){
        path=`${cat}/${Date.now()}-${f.name.replace(/[^\w.-]/g,"_")}`;
        const ref=F.st.ref(path); await ref.put(f); url=await ref.getDownloadURL();
        type=f.type.startsWith("video")?"video":f.type.startsWith("image")?"image":"file";
      }
      await F.db.collection("works").add({category:cat,title:t,description:$("de").value,media_url:url,media_type:type,storage_path:path,created_at:firebase.firestore.FieldValue.serverTimestamp()});
      msg("Berhasil diunggah.");$("fi").value="";$("ti").value="";$("de").value="";list();
    }catch(err){msg("Gagal: "+err.message)}
  };
})();
