// Small, bounded navigation grid. Routes use the same player radius as keyboard movement.
let walkPath = [], walkTarget = null;
function cameraPosition() {
  return { x: Math.round(Math.max(0, Math.min(World.width-World.viewW, p.x-World.viewW/2))),
    y: Math.round(Math.max(0, Math.min(World.height-World.viewH, p.y-300))) };
}
function stopClickWalk() { walkPath = []; walkTarget = null; }
function walkable(X, Y) {
  return X >= 14 && X <= 946 && Y >= 14 && Y <= 526 &&
    !maps[p.map].obs.some(o => collide(o, X, Y));
}
function clearWalkSegment(a, b) {
  const count = Math.max(1, Math.ceil(Math.hypot(b.x-a.x, b.y-a.y) / 4));
  for (let i = 0; i <= count; i++) {
    if (!walkable(a.x+(b.x-a.x)*i/count, a.y+(b.y-a.y)*i/count)) return false;
  }
  return true;
}
function clickWalkTo(X, Y) {
  stopClickWalk();
  const target = { x: Math.max(14, Math.min(946, X)), y: Math.max(14, Math.min(526, Y)) };
  if (clearWalkSegment(p, target)) { walkPath = [target]; walkTarget = target; return; }
  const nodes = [], cols = 59, rows = 33;
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
    nodes.push({ x: 14+col*16, y: 14+row*16 });
  }
  let start = -1, distance = Infinity;
  for (let i = 0; i < nodes.length; i++) {
    const d = Math.hypot(nodes[i].x-p.x, nodes[i].y-p.y);
    if (d < distance && clearWalkSegment(p, nodes[i])) { distance = d; start = i; }
  }
  if (start < 0) return;
  const parent = new Int32Array(nodes.length).fill(-2), queue = [start];
  parent[start] = -1;
  let best = start, bestDistance = Infinity;
  for (let head = 0; head < queue.length; head++) {
    const id = queue[head], a = nodes[id], col = id%cols, row = Math.floor(id/cols);
    const d = Math.hypot(a.x-target.x, a.y-target.y);
    if (d < bestDistance) { bestDistance = d; best = id; }
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if ((!dx && !dy) || col+dx < 0 || col+dx >= cols || row+dy < 0 || row+dy >= rows) continue;
      const next = (row+dy)*cols+col+dx;
      if (parent[next] !== -2 || !clearWalkSegment(a, nodes[next])) continue;
      parent[next] = id; queue.push(next);
    }
  }
  for (let id = best; id !== -1; id = parent[id]) walkPath.unshift(nodes[id]);
  if (clearWalkSegment(nodes[best], target)) walkPath.push(target);
  walkTarget = walkPath[walkPath.length-1];
}
function updateClickWalk(dt) {
  if (!walkPath.length) return;
  const target = walkPath[0], dx = target.x-p.x, dy = target.y-p.y, d = Math.hypot(dx, dy);
  if (d < .5) { walkPath.shift(); if (!walkPath.length) stopClickWalk(); return; }
  const before = { x: p.x, y: p.y };
  move(dx/d, dy/d, Math.min(dt, d/160));
  if (Math.hypot(p.x-before.x, p.y-before.y) < .001) stopClickWalk();
}
c.onpointerdown = event => {
  if (event.button !== 0 || document.getElementById('msg').style.display === 'block' ||
      document.getElementById('inv').style.display === 'block') return;
  const rect = c.getBoundingClientRect(), camera = cameraPosition();
  const X=(event.clientX-rect.left)*World.viewW/rect.width+camera.x, Y=(event.clientY-rect.top)*World.viewH/rect.height+camera.y;
  combatTarget=mobs.filter(m=>!m.dead&&Math.hypot(X-m.x,Y-(m.y-6))<26).sort((a,b)=>Math.hypot(X-a.x,Y-a.y)-Math.hypot(X-b.x,Y-b.y))[0]||null;
  chaseTimer=0;
  if(combatTarget) stopClickWalk(); else clickWalkTo(X,Y);
};

function updateCombatTarget(dt) {
  if(!combatTarget)return;
  if(combatTarget.dead||p.map!=='f'){combatTarget=null;stopClickWalk();return;}
  if(D(p,combatTarget)<50&&clearWalkSegment(p,combatTarget)){
    stopClickWalk();const dx=combatTarget.x-p.x,dy=combatTarget.y-p.y;
    facing=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
    attack(combatTarget);
  }else{chaseTimer-=dt;if(chaseTimer<=0){clickWalkTo(combatTarget.x,combatTarget.y);chaseTimer=.5;}}
}
