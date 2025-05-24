document.addEventListener('DOMContentLoaded', () => {
  // Menú tipo pestañas
  const tabs = document.querySelectorAll('nav ul li');
  const sections = document.querySelectorAll('.content-section');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      sections.forEach(sec => sec.style.display = 'none');
      document.getElementById(tab.dataset.target).style.display = 'block';
    });
  });
  // Mostrar inicio por defecto
  document.querySelector('nav ul li.active').click();

  // Cálculo de energía (Caso 1)
  document.getElementById('btnEnergia').addEventListener('click', () => {
    const F0    = parseFloat(document.getElementById('F0').value);
    const omega = parseFloat(document.getElementById('omega').value);
    const T     = parseFloat(document.getElementById('T').value);
    const h     = parseFloat(document.getElementById('h').value);

    // Método del Trapecio
    let trap = 0;
    for (let t = 0; t < T; t += h) {
      const F1 = F0 * Math.sin(omega * t);
      const F2 = F0 * Math.sin(omega * (t + h));
      trap += (h / 2) * (F1*F1 + F2*F2);
    }

    // Método de Simpson 1/3
    let simp13 = 0;
    if (((T / h) % 2) === 0) { // Simpson 1/3 requiere número par de subintervalos
      const n = T / h;
      for (let i = 0; i < n; i += 2) {
        const t0 = i * h;
        const t1 = (i + 1) * h;
        const t2 = (i + 2) * h;
        const f0 = F0*Math.sin(omega*t0), f1 = F0*Math.sin(omega*t1), f2 = F0*Math.sin(omega*t2);
        simp13 += (h/3)*(f0*f0 + 4*(f1*f1) + f2*f2);
      }
    }

    // Método de Simpson 3/8
    let simp38 = 0;
    if (((T / h) % 3) === 0) { // Simpson 3/8 requiere múltiplo de 3 subintervalos
      const n3 = T / h;
      for (let i = 0; i < n3; i += 3) {
        const t0 = i*h, t1 = (i+1)*h, t2 = (i+2)*h, t3 = (i+3)*h;
        const f0 = F0*Math.sin(omega*t0), f1 = F0*Math.sin(omega*t1),
              f2 = F0*Math.sin(omega*t2), f3 = F0*Math.sin(omega*t3);
        simp38 += (3*h/8)*(f0*f0 + 3*(f1*f1 + f2*f2) + f3*f3);
      }
    }

    // Mostrar resultados
    document.getElementById('resultado').innerText = 
      `Trapecio: ${trap.toFixed(2)} J`;
    document.getElementById('energyTrap').innerText    = trap.toFixed(2);
    document.getElementById('energySimp13').innerText  = simp13 ? simp13.toFixed(2) : 'N/A';
    document.getElementById('energySimp38').innerText  = simp38 ? simp38.toFixed(2) : 'N/A';
  });

  // Cálculo de gradientes hidráulicos (Caso 2)
  document.getElementById('btnGradiente').addEventListener('click', () => {
    const lines = document.getElementById('datos').value.trim().split('\n');
    const xs = [], hs = [];
    lines.forEach(l => {
      const [x, h] = l.split(',').map(Number);
      xs.push(x);
      hs.push(h);
    });
    const dx = xs[1] - xs[0];
    const table = document.getElementById('tablaGradientes');
    table.innerHTML = '<tr><th>x (m)</th><th>h (m)</th><th>Hacia Delante</th><th>Hacia Atrás</th><th>Centrada</th></tr>';
    xs.forEach((x, i) => {
      const fwd = i < xs.length - 1 ? ((hs[i+1] - hs[i]) / (xs[i+1] - xs[i])).toFixed(4) : '—';
      const bwd = i > 0 ? ((hs[i] - hs[i-1]) / (xs[i] - xs[i-1])).toFixed(4) : '—';
      const ctr = (i > 0 && i < xs.length - 1) ? ((hs[i+1] - hs[i-1]) / (2 * dx)).toFixed(4) : '—';
      const row = table.insertRow();
      [x, hs[i], fwd, bwd, ctr].forEach(text => row.insertCell().innerText = text);
    });
  });
});
