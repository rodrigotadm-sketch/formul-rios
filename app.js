
(async()=>{
const root=document.getElementById('app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let D;try{D=await fetch('formularios.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()})}
catch(e){root.innerHTML='<div class="empty">Não foi possível carregar os formulários.</div>';return}
const active=D.forms.filter(x=>x.ativo!==false);
const cats=['Todos',...new Set(active.map(x=>x.categoria))];

function buttons(x){
 let a=`<a class="primary" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.acao||'Acessar')}</a>`;
 if(x.norma)a+=`<a href="${esc(x.norma)}" target="_blank" rel="noopener">Consultar norma</a>`;
 if(x.procedimento)a+=`<a href="${esc(x.procedimento)}" target="_blank" rel="noopener">Ver procedimento</a>`;
 return a;
}
function formCard(x,quick=false){
 return `<article class="${quick?'quick-card':'card'}"><div class="type">${esc(x.tipo)} · ${esc(x.categoria)}</div><h3>${esc(x.nome)}</h3><p>${esc(x.descricao)}</p><div class="actions">${buttons(x)}</div></article>`;
}
root.innerHTML=`
<section class="hero"><div class="eyebrow">UFPR · CURSO DE BIOMEDICINA</div><h1>${esc(D.title)}</h1><p>${esc(D.subtitle)}</p></section>
<div class="intro">${esc(D.intro)}</div>

<section class="section"><div class="section-head"><h2>Mais utilizados</h2><span class="count">Semestre ${esc(D.updated)}</span></div><div id="quick" class="quick-grid"></div></section>

<div class="controls"><input id="q" class="search" type="search" placeholder="Buscar formulário, procedimento ou assunto..."><div id="filters" class="filters">${cats.map((c,i)=>`<button type="button" class="filter ${i===0?'active':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>

<section class="section"><div class="section-head"><h2>Todos os formulários e procedimentos</h2><span id="count" class="count"></span></div><div id="cards" class="cards"></div></section>

<section class="section"><h2>Acessos gerais</h2><div class="panel general">${D.links_gerais.map(l=>`<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div></section>

<section class="section"><div class="notice"><b>Importante:</b> procedimentos e formulários podem ser alterados pela UFPR. Antes de enviar documentação, confira o semestre, o prazo e a versão do documento.</div></section>

<section class="section"><h2>Contato</h2><div class="panel contact">Coordenação do Curso: <a href="mailto:${esc(D.contact.email)}">${esc(D.contact.email)}</a> · ${esc(D.contact.phone)}</div></section>`;

const q=document.getElementById('q'),cards=document.getElementById('cards'),count=document.getElementById('count');
let cat='Todos';
document.getElementById('quick').innerHTML=active.filter(x=>x.destaque).slice(0,9).map(x=>formCard(x,true)).join('');

function render(){
 const s=q.value.toLowerCase().trim();
 const arr=active.filter(x=>(cat==='Todos'||x.categoria===cat)&&(!s||[x.nome,x.categoria,x.descricao,x.tipo].join(' ').toLowerCase().includes(s)));
 cards.innerHTML=arr.length?arr.map(x=>formCard(x)).join(''):'<div class="empty">Nenhum formulário encontrado.</div>';
 count.textContent=`${arr.length} itens`;
}
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');cat=b.dataset.cat;render()});
q.addEventListener('input',render);render();
})();
