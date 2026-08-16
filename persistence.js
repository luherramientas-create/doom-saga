/* DOOM SAGA V5.6.3 — local progress persistence */
(()=>{
  const KEY='doom-saga-progress-v563';
  const COMPLETION_WORDS=/\b(visto|vista|completado|completada|completar|marcar|terminado|terminada|done|watched|complete)\b|✓|✔/i;
  const norm=s=>(s||'').replace(/\s+/g,' ').trim().slice(0,180);
  const titleOf=el=>norm(el.querySelector('h1,h2,h3,h4,.pt strong,.title,b,strong')?.textContent||el.textContent);
  const cardOf=el=>el.closest('.card,.node,.dossier,.journeyCard,.box')||el;
  let state={actions:[]};
  try{state=JSON.parse(localStorage.getItem(KEY)||'{"actions":[]}')||state}catch{}
  if(!Array.isArray(state.actions))state.actions=[];
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
  const remember=(el)=>{
    const btn=el.closest('button');
    if(!btn||!COMPLETION_WORDS.test(norm(btn.textContent)))return;
    const card=cardOf(btn), title=titleOf(card), text=norm(btn.textContent);
    if(!title)return;
    const item={title,button:text};
    if(!state.actions.some(x=>x.title===item.title&&x.button===item.button)){state.actions.push(item);save()}
  };
  document.addEventListener('click',e=>{remember(e.target);setTimeout(save,150)},true);
  const apply=()=>{
    if(!state.actions.length)return;
    document.querySelectorAll('.card,.node,.dossier,.journeyCard').forEach(card=>{
      const title=titleOf(card); if(!title)return;
      state.actions.filter(x=>x.title===title).forEach(x=>{
        const buttons=[...card.querySelectorAll('button')];
        const btn=buttons.find(b=>norm(b.textContent)===x.button)||buttons.find(b=>COMPLETION_WORDS.test(norm(b.textContent)));
        if(btn && !btn.dataset.doomRestored){btn.dataset.doomRestored='1'; try{btn.click()}catch{}}
        card.classList.add('done');
      });
    });
  };
  let timer;
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(apply,250)};
  new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  window.addEventListener('load',()=>setTimeout(apply,700));
  window.DoomSave={reset(){localStorage.removeItem(KEY);location.reload()},get(){return JSON.parse(localStorage.getItem(KEY)||'{"actions":[]}')}};
})();
