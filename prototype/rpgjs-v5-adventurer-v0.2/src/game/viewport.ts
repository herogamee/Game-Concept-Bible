export function viewportSize(width:number,height:number){
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return {width:800,height:450};
  const scale=Math.max(width/800,height/450);
  return {width:Math.max(1,Math.round(width/scale)),height:Math.max(1,Math.round(height/scale))};
}
export function cameraPosition(player:{x:number;y:number},view:{width:number;height:number},map:{width:number;height:number}){
  return {x:Math.max(0,Math.min(map.width-view.width,player.x-view.width/2)),y:Math.max(0,Math.min(map.height-view.height,player.y-view.height*2/3))};
}
