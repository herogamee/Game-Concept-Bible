export interface Point {x:number;y:number}
export interface RouteMap {width:number;height:number;columns:number;tileSize:number}
const legacy:RouteMap={width:640,height:480,columns:20,tileSize:32};
// Bounded 8-way BFS; prevent corner-cutting. Physics still resolves collisions.
export function route(from:Point,to:Point,blockedTiles:number[],map:RouteMap=legacy):Point[] {
  if(!Number.isFinite(to.x)||!Number.isFinite(to.y)||to.x<16||to.x>=map.width-16||to.y<16||to.y>=map.height-16)return [];
  const width=map.width/16,height=map.height/16,blocked=new Set(blockedTiles);
  const cell=(p:Point)=>Math.floor(p.y/16)*width+Math.floor(p.x/16);
  const safe=(i:number)=>{const x=i%width,y=Math.floor(i/width);return i>=0&&x>=1&&x<width-1&&y>=1&&y<height-1&&[0,1].every(dx=>[0,1].every(dy=>!blocked.has(Math.floor((y+dy)*16/map.tileSize)*map.columns+Math.floor((x+dx)*16/map.tileSize))));};
  const start=cell(from);let end=cell(to);
  if(!safe(end)){
    // Clicking a trunk/water edge chooses the nearest safe destination.
    let best=Infinity;for(let i=0;i<width*height;i++)if(safe(i)){const d=Math.hypot(i%width*16+8-to.x,Math.floor(i/width)*16+8-to.y);if(d<best){best=d;end=i;}}
  }
  const queue=[start],parent=new Map<number,number>([[start,-1]]);
  for(let q=0;q<queue.length&&!parent.has(end);q++){
    const i=queue[q],x=i%width,y=Math.floor(i/width);
    for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]){
      const nx=x+dx,ny=y+dy,n=ny*width+nx;
      if(nx<0||nx>=width||parent.has(n)||!safe(n))continue;
      if(dx&&dy&&(!safe(y*width+nx)||!safe(ny*width+x)))continue;
      parent.set(n,i);queue.push(n);
    }
  }
  if(!parent.has(end))return [];
  const path:Point[]=[];for(let i=end;i!==start;i=parent.get(i)!){path.unshift({x:i%width*16+8,y:Math.floor(i/width)*16+8});}
  const destination=cell(to)===end?to:{x:end%width*16+8,y:Math.floor(end/width)*16+8};
  path.push(destination);return path;
}
