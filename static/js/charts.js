/**
 * Esquemas Gráficos SVG, Dicionário Ilustrado de Pontos e Tabela de Linhas/Agulhas
 */
(function (global) {
  'use strict';

  function svgToDataUrl(svg) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  const BUILTIN_SCHEMAS = [
    {
      id: 'schema-flor-6',
      title: 'Flor em Miniatura (6 Pétalas)',
      category: 'Flores em Miniatura',
      desc: 'Anel mágico, 12 pb na 1.ª carreira, arcos de 3 corr e pétalas de 5 pa com picô.',
      src: svgToDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" style="background:#fdf8f4">
          <circle cx="180" cy="180" r="22" fill="none" stroke="#b85d73" stroke-width="3"/>
          <text x="180" y="185" text-anchor="middle" font-size="11" fill="#2d2424" font-family="sans-serif" font-weight="bold">Anel</text>
          ${[0, 60, 120, 180, 240, 300].map((ang) => `
            <g transform="rotate(${ang} 180 180)">
              <ellipse cx="180" cy="132" rx="14" ry="24" fill="rgba(184,93,115,0.12)" stroke="#b85d73" stroke-width="2.2"/>
              <line x1="180" y1="154" x2="180" y2="112" stroke="#5b8a72" stroke-width="2"/>
              <line x1="172" y1="133" x2="188" y2="133" stroke="#5b8a72" stroke-width="2"/>
              <circle cx="180" cy="96" r="5" fill="none" stroke="#b85d73" stroke-width="2"/>
              <path d="M168 108 Q180 78 192 108" fill="none" stroke="#8c6d62" stroke-width="1.6" stroke-dasharray="3,2"/>
            </g>
          `).join('')}
          <text x="180" y="342" text-anchor="middle" font-size="12" fill="#6b5b5b" font-family="sans-serif">Esquema: Anel + 6 Pétalas (pa + picô)</text>
        </svg>
      `)
    },
    {
      id: 'schema-bico-renda',
      title: 'Bico de Renda em Arcos & Picô',
      category: 'Rendas e Bicos',
      desc: 'Base em ponto baixo, arcos de 5 correntinhas e acabamento em leque com picô.',
      src: svgToDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 240" style="background:#fdf8f4">
          <line x1="20" y1="190" x2="360" y2="190" stroke="#8c6d62" stroke-width="2.5"/>
          ${[50, 110, 170, 230, 290, 350].map((x) => `
            <text x="${x}" y="185" text-anchor="middle" font-size="14" fill="#2d2424" font-family="sans-serif" font-weight="bold">×</text>
          `).join('')}
          ${[80, 200, 320].map((cx) => `
            <path d="M${cx - 55} 175 Q${cx} 120 ${cx + 55} 175" fill="none" stroke="#5b8a72" stroke-width="2.2" stroke-dasharray="5,3"/>
            <line x1="${cx}" y1="145" x2="${cx - 24}" y2="95" stroke="#b85d73" stroke-width="2.2"/>
            <line x1="${cx}" y1="145" x2="${cx - 10}" y2="88" stroke="#b85d73" stroke-width="2.2"/>
            <line x1="${cx}" y1="145" x2="${cx}" y2="85" stroke="#b85d73" stroke-width="2.2"/>
            <line x1="${cx}" y1="145" x2="${cx + 10}" y2="88" stroke="#b85d73" stroke-width="2.2"/>
            <line x1="${cx}" y1="145" x2="${cx + 24}" y2="95" stroke="#b85d73" stroke-width="2.2"/>
            <circle cx="${cx}" cy="70" r="6" fill="none" stroke="#b85d73" stroke-width="2.2"/>
          `).join('')}
          <text x="190" y="225" text-anchor="middle" font-size="12" fill="#6b5b5b" font-family="sans-serif">1.ª Carr: pb · 2.ª Carr: arcos 5 corr · 3.ª Carr: leque 5 pa + picô</text>
        </svg>
      `)
    },
    {
      id: 'schema-amigurumi',
      title: 'Base Circular Amigurumi (6 → 24 pts)',
      category: 'Miniaturas Amigurumi',
      desc: 'Círculo mágico com 6 pb, aumentos regulares (2 pb em cada ponto) até 24 pontos.',
      src: svgToDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" style="background:#fdf8f4">
          <circle cx="180" cy="180" r="24" fill="rgba(91,138,114,0.12)" stroke="#5b8a72" stroke-width="2.2"/>
          <circle cx="180" cy="180" r="58" fill="none" stroke="#8c6d62" stroke-width="1.5" stroke-dasharray="4,3"/>
          <circle cx="180" cy="180" r="94" fill="none" stroke="#8c6d62" stroke-width="1.5" stroke-dasharray="4,3"/>
          <circle cx="180" cy="180" r="130" fill="none" stroke="#b85d73" stroke-width="2"/>
          <text x="180" y="184" text-anchor="middle" font-size="11" fill="#2d2424" font-family="sans-serif" font-weight="bold">6 pb</text>
          <text x="180" y="130" text-anchor="middle" font-size="11" fill="#5b8a72" font-family="sans-serif" font-weight="bold">12 pb (6 aum)</text>
          <text x="180" y="94" text-anchor="middle" font-size="11" fill="#8c6d62" font-family="sans-serif" font-weight="bold">18 pb (1 pb, 1 aum)</text>
          <text x="180" y="58" text-anchor="middle" font-size="11" fill="#b85d73" font-family="sans-serif" font-weight="bold">24 pb (2 pb, 1 aum)</text>
          ${Array.from({ length: 12 }, (_, i) => i * 30).map((a) => `
            <text x="180" y="42" transform="rotate(${a} 180 180)" text-anchor="middle" font-size="13" fill="#b85d73" font-weight="bold">V</text>
          `).join('')}
        </svg>
      `)
    },
    {
      id: 'schema-rede-filet',
      title: 'Ponto Rede / Renda Filet',
      category: 'Rendas e Bicos',
      desc: 'Quadrícula aberta (1 pa, 2 corr) e quadrícula cheia (3 pa) para barrados e panos.',
      src: svgToDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" style="background:#fdf8f4">
          ${[45, 95, 145].map((y, row) => `
            <g>
              ${[45, 105, 165, 225, 285].map((x, col) => `
                <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 40}" stroke="#2d2424" stroke-width="2.5"/>
                <line x1="${x - 6}" y1="${y}" x2="${x + 6}" y2="${y}" stroke="#2d2424" stroke-width="2.2"/>
                <line x1="${x - 5}" y1="${y + 20}" x2="${x + 5}" y2="${y + 16}" stroke="#b85d73" stroke-width="2"/>
                ${col < 4 ? (
                  (row === 1 && (col === 1 || col === 2))
                    ? `<line x1="${x + 20}" y1="${y}" x2="${x + 20}" y2="${y + 40}" stroke="#5b8a72" stroke-width="2.2"/>
                       <line x1="${x + 40}" y1="${y}" x2="${x + 40}" y2="${y + 40}" stroke="#5b8a72" stroke-width="2.2"/>`
                    : `<ellipse cx="${x + 20}" cy="${y + 2}" rx="6" ry="3.5" fill="none" stroke="#8c6d62" stroke-width="1.8"/>
                       <ellipse cx="${x + 40}" cy="${y + 2}" rx="6" ry="3.5" fill="none" stroke="#8c6d62" stroke-width="1.8"/>`
                ) : ''}
              `).join('')}
            </g>
          `).join('')}
          <text x="180" y="205" text-anchor="middle" font-size="12" fill="#6b5b5b" font-family="sans-serif">Rede aberta: 1 pa + 2 corr · Bloco cheio: 3 pa</text>
        </svg>
      `)
    }
  ];

  const STITCH_DICTIONARY = [
    {
      name: 'Correntinha (corr)',
      desc: 'Base de quase todos os trabalhos e arcos de renda.',
      svg: `<svg viewBox="0 0 48 48"><ellipse cx="24" cy="24" rx="14" ry="7" fill="none" stroke="#b85d73" stroke-width="3"/></svg>`
    },
    {
      name: 'Ponto Baixíssimo (pbx)',
      desc: 'Serve para fechar carreiras em círculo ou deslizar sem altura.',
      svg: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="6.5" fill="#2d2424"/></svg>`
    },
    {
      name: 'Ponto Baixo (pb)',
      desc: 'Ponto firme e fechado, ideal para miniaturas Amigurumi.',
      svg: `<svg viewBox="0 0 48 48"><line x1="14" y1="14" x2="34" y2="34" stroke="#5b8a72" stroke-width="3.2" stroke-linecap="round"/><line x1="34" y1="14" x2="14" y2="34" stroke="#5b8a72" stroke-width="3.2" stroke-linecap="round"/></svg>`
    },
    {
      name: 'Meio Ponto Alto (mpa)',
      desc: 'Altura intermédia, dá textura macia e flexível.',
      svg: `<svg viewBox="0 0 48 48"><line x1="24" y1="10" x2="24" y2="38" stroke="#2d2424" stroke-width="3" stroke-linecap="round"/><line x1="14" y1="10" x2="34" y2="10" stroke="#2d2424" stroke-width="3" stroke-linecap="round"/></svg>`
    },
    {
      name: 'Ponto Alto (pa)',
      desc: 'Muito usado em rendas, bicos, flores e ponto rede.',
      svg: `<svg viewBox="0 0 48 48"><line x1="24" y1="9" x2="24" y2="39" stroke="#b85d73" stroke-width="3" stroke-linecap="round"/><line x1="14" y1="9" x2="34" y2="9" stroke="#b85d73" stroke-width="3" stroke-linecap="round"/><line x1="17" y1="25" x2="31" y2="20" stroke="#b85d73" stroke-width="2.8" stroke-linecap="round"/></svg>`
    },
    {
      name: 'Ponto Picô (picô)',
      desc: '3 correntinhas fechadas com pbx na base; cria pontas delicadas na renda.',
      svg: `<svg viewBox="0 0 48 48"><path d="M12 34 Q24 8 36 34" fill="none" stroke="#5b8a72" stroke-width="2.6"/><circle cx="24" cy="17" r="4.5" fill="none" stroke="#b85d73" stroke-width="2.6"/><circle cx="24" cy="34" r="3" fill="#2d2424"/></svg>`
    }
  ];

  const THREAD_HOOK_TABLE = [
    { thread: 'Linha n.º 10 (grossa)', hook: '1,25 mm – 1,50 mm', use: 'Bases, cestinhos e flores maiores' },
    { thread: 'Linha n.º 20 (média)', hook: '1,00 mm – 1,25 mm', use: 'Bicos de renda, toalhinhas e amigurumis médios' },
    { thread: 'Linha n.º 40 (fina)', hook: '0,75 mm – 0,90 mm', use: 'Renda fina e miniaturas delicadas' },
    { thread: 'Linha n.º 60 (muito fina)', hook: '0,60 mm – 0,70 mm', use: 'Micro-croché e flores em miniatura' },
    { thread: 'Linha n.º 80 (extra fina)', hook: '0,50 mm – 0,55 mm', use: 'Brincos, renda antiga e micro-amigurumi' }
  ];

  global.CrocheCharts = {
    BUILTIN_SCHEMAS,
    STITCH_DICTIONARY,
    THREAD_HOOK_TABLE
  };
})(window);
