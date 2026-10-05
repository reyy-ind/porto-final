// Firebase (Auth + Firestore + Storage). Publik hanya baca; tulis dibatasi rules + login admin.
(function(){
  const c=window.CONFIG.FIREBASE;
  window.fb=null;
  if(c.apiKey&&window.firebase){
    firebase.initializeApp(c);
    window.fb={auth:firebase.auth(),db:firebase.firestore(),st:firebase.storage()};
  }
  window.fetchWorks=async function(){
    if(!window.fb) return [];
    try{
      const s=await window.fb.db.collection("works").orderBy("created_at","desc").get();
      return s.docs.map(d=>({id:d.id,...d.data()}));
    }catch(e){console.error(e);return []}
  };
})();
