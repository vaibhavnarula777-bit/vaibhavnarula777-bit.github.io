/* Models for Policy Bridge NC (stable matching) and Rural Access NC (p-median). */
const C = {ink:'#1E2230',muted:'#6A6859',line:'#D8D2BE',gold:'#2F4FA3',goldtxt:'#2F4FA3',goldsoft:'#F1E49B',grey:'#E4DFCF',bg:'#F7F2E4',mark:'#E9B824'};
const $ = id => document.getElementById(id);
const fmt = n => Math.round(n).toLocaleString('en-US');
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const NS='http://www.w3.org/2000/svg';
function el(tag,a,p){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
const byName={};NC.counties.forEach(c=>byName[c.n]=c);
function miles(a,b){const R=3958.8,r=Math.PI/180,dl=(b.lat-a.lat)*r,dn=(b.lon-a.lon)*r;
  const h=Math.sin(dl/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h));}

/* ---------- Policy Bridge NC ---------- */
const students=[
  {n:'Student A',c:'Hyde',i:['Environment','Local gov']},{n:'Student B',c:'Robeson',i:['Housing','Benefits']},
  {n:'Student C',c:'Wilkes',i:['Courts','Elections']},{n:'Student D',c:'Halifax',i:['Benefits','Courts']},
  {n:'Student E',c:'Graham',i:['Environment','Local gov']},{n:'Student F',c:'Columbus',i:['Housing','Local gov']},
  {n:'Student G',c:'Harnett',i:['Elections','Housing']},{n:'Student H',c:'Bertie',i:['Courts','Benefits']}];
const mentors=[
  {n:'Legislative staffer',c:'Wake',i:['Elections','Housing']},{n:'Legal aid attorney',c:'Pitt',i:['Housing','Benefits']},
  {n:'County commissioner',c:'Robeson',i:['Local gov','Housing']},{n:'Environmental policy analyst',c:'New Hanover',i:['Environment']},
  {n:'Public defender',c:'Cumberland',i:['Courts']},{n:'Town manager',c:'Buncombe',i:['Local gov','Environment']},
  {n:'Benefits program supervisor',c:'Halifax',i:['Benefits']},{n:'Clerk of court staff',c:'Wilkes',i:['Courts','Elections']}];
const isRural=c=>byName[c].pop/byName[c].area<250;
function scores(w){return students.map(s=>mentors.map(m=>{const ov=s.i.filter(x=>m.i.includes(x)).length/s.i.length,d=miles(byName[s.c],byName[m.c]);return {score:w*ov+(1-w)*Math.max(0,1-d/250),d};}));}
function gs(S){const n=students.length,pref=S.map(r=>r.map((x,j)=>j).sort((a,b)=>r[b].score-r[a].score));const nx=Array(n).fill(0),held=Array(n).fill(-1);let free=[...Array(n).keys()],rounds=0;
  while(free.length){rounds++;const nf=[];for(const s of free){const m=pref[s][nx[s]++],cur=held[m];if(cur<0)held[m]=s;else if(S[s][m].score>S[cur][m].score){held[m]=s;nf.push(cur);}else nf.push(s);}free=nf;}
  const match=Array(n);held.forEach((s,m)=>match[s]=m);return {match,rounds};}
let brT=[];
function drawBridge(animate){
  const w=+$('br-w').value/100;$('br-w-v').textContent=`${Math.round(w*100)} / ${Math.round((1-w)*100)}`;
  const S=scores(w),{match,rounds}=gs(S);brT.forEach(clearTimeout);brT=[];
  const svg=$('br-svg');svg.innerHTML='';const top=40,gap=48,xl=230,xr=490;
  el('text',{x:xl,y:18,'text-anchor':'end','font-size':12.5,'font-weight':700,fill:C.muted},svg).textContent='STUDENTS (county)';
  el('text',{x:xr,y:18,'font-size':12.5,'font-weight':700,fill:C.muted},svg).textContent='MENTORS (county)';
  const lines=students.map((s,i)=>{const m=match[i],sc=S[i][m],y1=top+i*gap,y2=top+m*gap;
    const ln=el('path',{d:`M${xl+10},${y1} C${xl+130},${y1} ${xr-130},${y2} ${xr-10},${y2}`,fill:'none',stroke:C.gold,'stroke-width':(1.5+sc.score*6).toFixed(1),'stroke-linecap':'round',opacity:animate?0:.9},svg);
    ln.style.transition='opacity .35s ease';return ln;});
  students.forEach((s,i)=>{const y=top+i*gap;el('circle',{cx:xl+10,cy:y,r:5,fill:isRural(s.c)?C.mark:C.ink,stroke:C.ink,'stroke-width':1},svg);
    el('text',{x:xl-4,y:y-2,'text-anchor':'end','font-size':14,'font-weight':700,fill:C.ink},svg).textContent=`${s.n} (${s.c})`;
    el('text',{x:xl-4,y:y+14,'text-anchor':'end','font-size':11.5,fill:C.muted},svg).textContent=s.i.join(' · ');});
  mentors.forEach((m,j)=>{const y=top+j*gap;el('circle',{cx:xr-10,cy:y,r:5,fill:C.ink},svg);
    el('text',{x:xr+4,y:y-2,'font-size':14,'font-weight':700,fill:C.ink},svg).textContent=`${m.n} (${m.c})`;
    el('text',{x:xr+4,y:y+14,'font-size':11.5,fill:C.muted},svg).textContent=m.i.join(' · ');});
  if(animate)lines.forEach((ln,k)=>brT.push(setTimeout(()=>ln.setAttribute('opacity',.9),150+k*170)));
  const avgF=S.reduce((a,r,i)=>a+r[match[i]].score,0)/students.length,avgD=S.reduce((a,r,i)=>a+r[match[i]].d,0)/students.length;
  const ru=students.map((s,i)=>i).filter(i=>isRural(students[i].c)),near=ru.filter(i=>S[i][match[i]].d<=60).length;
  $('br-fit').textContent=Math.round(avgF*100)+'%';$('br-dist').textContent=Math.round(avgD)+' mi';$('br-rounds').textContent=rounds;
  $('br-result').innerHTML=`Stable match for all ${students.length} students. <em>${near} of ${ru.length}</em> rural students get a mentor within 60 miles.`;
}
$('br-w').addEventListener('input',()=>drawBridge(false));$('br-run').addEventListener('click',()=>drawBridge(true));

/* ---------- Rural Access NC ---------- */
const R=NC.counties.filter(c=>c.pop/c.area<250),RPOP=R.reduce((a,c)=>a+c.pop,0),DM=R.map(a=>R.map(b=>miles(a,b)));
function cost(s){let t=0;const as=[];R.forEach((c,i)=>{let b=1e9,bj=-1;s.forEach(j=>{if(DM[i][j]<b){b=DM[i][j];bj=j;}});as.push(bj);t+=b*c.pop;});return {avg:t/RPOP,as};}
const SOL=[];(function(){let s=[];for(let k=1;k<=12;k++){let best=null,bj=-1;for(let j=0;j<R.length;j++){if(s.includes(j))continue;const v=cost([...s,j]).avg;if(best===null||v<best){best=v;bj=j;}}s=[...s,bj];
  let imp=true;while(imp){imp=false;let cur=cost(s).avg;for(let a=0;a<s.length;a++)for(let j=0;j<R.length;j++){if(s.includes(j))continue;const t=s.slice();t[a]=j;const v=cost(t).avg;if(v<cur-1e-6){s=t;cur=v;imp=true;}}}
  const c=cost(s);let w=0,mx=0;R.forEach((cc,i)=>{const d=DM[i][c.as[i]];if(d<=30)w+=cc.pop;mx=Math.max(mx,d);});SOL.push({s:s.slice(),avg:c.avg,as:c.as,w:w/RPOP,mx});}})();
const rset=new Set(R.map(c=>c.id));
function drawRural(){
  const k=+$('ru-k').value,sol=SOL[k-1];$('ru-k-v').textContent=k;
  const svg=$('ru-map');svg.innerHTML='';
  NC.counties.forEach(c=>el('path',{d:c.d,fill:rset.has(c.id)?C.goldsoft:C.grey,stroke:C.bg,'stroke-width':.8},svg));
  el('path',{d:NC.outline,fill:'none',stroke:'#8E8870','stroke-width':1},svg);
  R.forEach((c,i)=>{const s=R[sol.as[i]];if(s!==c)el('line',{x1:c.x,y1:c.y,x2:s.x,y2:s.y,stroke:C.goldtxt,'stroke-width':.8,opacity:.45},svg);});
  sol.s.forEach(j=>{const s=R[j];el('circle',{cx:s.x,cy:s.y,r:9,fill:C.mark,stroke:C.ink,'stroke-width':1.5},svg);
    el('text',{x:s.x,y:s.y-14,'text-anchor':'middle','font-size':13,'font-weight':700,fill:C.ink,stroke:C.bg,'stroke-width':3,'paint-order':'stroke'},svg).textContent=s.n;});
  $('ru-avg').textContent=Math.round(sol.avg)+' mi';$('ru-30').textContent=Math.round(sol.w*100)+'%';$('ru-max').textContent=Math.round(sol.mx)+' mi';
  const one=SOL[0].avg;
  $('ru-result').innerHTML=k===1?`With one central site, rural residents travel an average of <em>${Math.round(one)} miles</em>.`
    :`${k} sites cut the average trip for rural residents from ${Math.round(one)} to <em>${Math.round(sol.avg)} miles</em>.`;
  const cv=$('ru-curve');cv.innerHTML='';const W=760,H=150,pl=50,pr=20,pt=12,pb=32,mA=Math.ceil(one/20)*20,xs=n=>pl+(W-pl-pr)*(n-1)/11,ys=v=>H-pb-(H-pt-pb)*v/mA;
  [0,mA/2,mA].forEach(v=>{el('line',{x1:pl,x2:W-pr,y1:ys(v),y2:ys(v),stroke:C.line},cv);el('text',{x:pl-6,y:ys(v)+4,'text-anchor':'end','font-size':11,fill:C.muted},cv).textContent=Math.round(v)+' mi';});
  SOL.forEach((s,i)=>el('text',{x:xs(i+1),y:H-pb+17,'text-anchor':'middle','font-size':11,fill:C.muted},cv).textContent=i+1);
  el('text',{x:W-pr,y:H-1,'text-anchor':'end','font-size':11,fill:C.muted},cv).textContent='number of sites →';
  el('path',{d:SOL.map((s,i)=>(i?'L':'M')+xs(i+1)+','+ys(s.avg)).join(''),fill:'none',stroke:C.gold,'stroke-width':2.5},cv);
  SOL.forEach((s,i)=>el('circle',{cx:xs(i+1),cy:ys(s.avg),r:i+1===k?6:3,fill:i+1===k?C.ink:C.gold},cv));
}
$('ru-k').addEventListener('input',drawRural);

drawBridge(false);drawRural();
