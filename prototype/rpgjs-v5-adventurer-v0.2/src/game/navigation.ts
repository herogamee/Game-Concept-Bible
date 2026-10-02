export interface Point {x:number;y:number}
// Small bounded BFS for click routes. Collision tiles come from the same map
// generator as TMX. Engine physics remains the final movement authority.
export function route(from:Point,to:Point,blockedTiles:number[]):Point[] {
  if(!Number.isFinite(to.x)||!Number.isFinite(to.y)||to.x<32||to.x>=608||to.y<32||to.y>=448)return [];
  const width=40,height=30;
  const blocked=new Set(blockedTiles);
  const cell=(p:Point)=>Math.floor(p.y/16)*width+Math.floor(p.x/16);
  const safe=(i:number)=>{const x=i%width,y=Math.floor(i/width);return x>1&&x<width-2&&y>1&&y<height-2&&!blocked.has(Math.floor(y/2)*20+Math.floor(x/2));};
  const start=cell(from),end=cell(to);if(!safe(end))return [];
  const queue=[start],parent=new Map<number,number>([[start,-1]]);
  for(let q=0;q<queue.length&&!parent.has(end);q++){
    const i=queue[q];for(const n of [i-1,i+1,i-width,i+width])if(!parent.has(n)&&safe(n)){parent.set(n,i);queue.push(n);}
  }
  if(!parent.has(end))return [];
  const path:Point[]=[];for(let i=end;i!==start;i=parent.get(i)!){path.unshift({x:(i%width)*16+8,y:Math.floor(i/width)*16+8});}
  path.push(to);return path;
}
