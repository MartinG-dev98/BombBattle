
/* [b5 · 1857-1862] */
/* ================= MAIN LOOP ================= */
let last=0;function loop(t){const dt=Math.min(.05,(t-last)/1000||0);last=t;tm+=dt;fdt=dt||1/60;bgDraw(dt);
 if(net.role=='guest'){flushSnap();if(pl&&st!='menu')guestTick(dt)}
 else{applyRemote();if(['count','play','over','match'].includes(st))update(dt)}
 netTick(t);touchSync();if(st!='menu'&&pl)draw();tap={};requestAnimationFrame(loop)}
hudLayout();setDims(W,H);fit();netUI();sel();requestAnimationFrame(loop);
