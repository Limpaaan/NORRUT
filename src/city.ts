export const cityPlaces=[
 {id:'shop',label:'Butiken',icon:'▣',x:20,y:43,detail:'Köp nästa produktsteg'},
 {id:'research',label:'Forskningslabbet',icon:'⚗',x:48,y:41,detail:'Utveckla passiva fördelar'},
 {id:'scrap',label:'Skrotupplaget',icon:'⚒',x:80,y:43,detail:'Unika delar och fynd'},
 {id:'workshop',label:'Verkstaden',icon:'⚙',x:17,y:73,detail:'Uppgradera dina delar'},
 {id:'hangar',label:'Hangaren',icon:'✈',x:47,y:68,detail:'Montera och se ditt bygge'},
 {id:'leaderboard',label:'Pilotklubben',icon:'⚑',x:80,y:70,detail:'Topplista och vänner'},
 {id:'ramp',label:'Startrampen',icon:'↗',x:44,y:89,detail:'Förbättra din start'},
 {id:'achievements',label:'Torget',icon:'★',x:84,y:91,detail:'Dina prestationer'},
] as const;
export const destinationNames:Record<string,string>={city:'Avesta · din stad',shop:'Butiken',catalog:'Delkatalogen',workshop:'Verkstaden',hangar:'Hangaren',scrap:'Skrotupplaget',research:'Forskningslabbet',ramp:'Startrampen',achievements:'Prestationer',route:'Resan norrut',leaderboard:'Pilotklubben',boosters:'Boosterboden',sabotage:'Bus & sabotage',pilots:'Lokala piloter'};
export function cityMap(go:(id:string)=>void){const wrap=document.createElement('div');wrap.className='city-map-wrap';const map=document.createElement('nav');map.className='city-map';map.setAttribute('aria-label','Platser i Avesta');const image=document.createElement('img');image.src='art/places/avesta-city.webp';image.alt='En varm sommardag i Avesta, med verkstäder, hangar och Dalälven.';map.append(image);for(const place of cityPlaces){const b=document.createElement('button');b.className='city-pin';b.style.left=place.x+'%';b.style.top=place.y+'%';b.title=place.detail;b.setAttribute('aria-label',place.label+' · '+place.detail);const icon=document.createElement('span');icon.className='city-pin-icon';icon.textContent=place.icon;const name=document.createElement('span');name.textContent=place.label;b.append(icon,name);b.onclick=()=>go(place.id);map.append(b);}wrap.append(map);const observer=new ResizeObserver(()=>{const width=Math.min(wrap.clientWidth,wrap.clientHeight*1672/941);map.style.width=width+'px';map.style.height=width*941/1672+'px';});observer.observe(wrap);return {element:wrap,dispose:()=>observer.disconnect()};}
