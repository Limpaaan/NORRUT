export const landmarkAssets=['verket','horse','hedemora','sater','borlange','falun'].map(name=>({name,key:'landmark-'+name,url:'art/landmarks/'+name+'-082.webp'}));
/** Never stretch a landmark beyond its native physical pixel width on high-DPI displays. */
export function landmarkDisplayWidth(viewport:number,factor:number,zoom:number,nativeWidth:number,dpr=1){return Math.min(viewport*factor*(.32+.68*zoom),nativeWidth/Math.max(1,Math.min(2,dpr)));}
