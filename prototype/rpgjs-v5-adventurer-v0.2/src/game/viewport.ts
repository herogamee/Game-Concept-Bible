export function viewportSize(width:number,height:number,distance=100){
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return {width:800,height:450};
  const scale=Math.max(width/800,height/450);
  const zoom=Math.max(.8,Math.min(1.5,Number.isFinite(distance)?distance/100:1));
  // Fit within the authored map at maximum distance, with the same scale on both axes.
  const fit=Math.min(zoom,960/(width/scale),540/(height/scale));
  return {width:Math.max(1,Math.round(width/scale*fit)),height:Math.max(1,Math.round(height/scale*fit))};
}
export function cameraPosition(player:{x:number;y:number},view:{width:number;height:number},map:{width:number;height:number},height=.67){
  return {x:Math.max(0,Math.min(map.width-view.width,player.x-view.width/2)),y:Math.max(0,Math.min(map.height-view.height,player.y-view.height*height))};
}
