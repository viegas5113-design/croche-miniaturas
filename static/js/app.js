/**
 * Ateliê de Croché & Renda - Aplicação Principal (PWA Móvel)
 */
(function () {
  'use strict';

  const {
    getAllPhotos, savePhoto, deletePhoto, getMeta, setMeta, compressImageFile,
    getProjectsNotebook, saveProjectsNotebook, getRulerPxPerCm, setRulerPxPerCm,
    getHourlyRate, setHourlyRate
  } = window.CrocheDB;
  const {
    BUILTIN_SCHEMAS, STITCH_DICTIONARY, HOOK_EQUIVALENCE_TABLE, THREAD_HOOK_TABLE
  } = window.CrocheCharts;

  const LS_FAV_VIDEOS_KEY = 'atelie_croche_videos_fav_v1';

  const DEFAULT_VIDEOS = [
    // Categoria 1 — Costura e Montagem de Peças
    {
      id: 'tut-costura-1',
      title: 'Como Costurar seu Amigurumi (Dicas da Glê)',
      category: 'Costura e Montagem de Peças',
      desc: 'Técnica completa para prender e coser peças sem ficarem tortas.',
      duration: '39 min',
      url: 'https://www.youtube.com/watch?v=Bw815iKFPKw',
      youtubeId: 'Bw815iKFPKw',
      builtin: true
    },
    {
      id: 'tut-costura-2',
      title: 'Costura Perfeita e Invisível (Deisi Cardoso)',
      category: 'Costura e Montagem de Peças',
      desc: 'Como unir peças já cheias sem deixar a linha à vista.',
      duration: '12 min',
      url: 'https://www.youtube.com/watch?v=nJID7p5tHVk',
      youtubeId: 'nJID7p5tHVk',
      builtin: true
    },
    {
      id: 'tut-costura-3',
      title: 'Corpo Base de Boneca sem Costuras (Mari Trevisan)',
      category: 'Costura e Montagem de Peças',
      desc: 'Como unir pernas, tronco, braços e cabeça diretamente na agulha.',
      duration: '45 min',
      url: 'https://www.youtube.com/watch?v=tnbTH57TgaI',
      youtubeId: 'tnbTH57TgaI',
      builtin: true
    },
    // Categoria 2 — Bonecos com Cabeça de Madeira e Saias Rodadas
    {
      id: 'tut-boneco-1',
      title: 'Anjinho de Croché com Bola de Madeira (Atelier Renata Almeida)',
      category: 'Bonecos com Cabeça de Madeira e Saias Rodadas',
      desc: 'Vestido rendado com cabeça em bola de madeira.',
      duration: '15 min',
      url: 'https://www.youtube.com/watch?v=OKSOK2UuBvg',
      youtubeId: 'OKSOK2UuBvg',
      builtin: true
    },
    {
      id: 'tut-boneco-2',
      title: 'Anjo Rápido em Ponto Leque e Bola de Madeira (AmaArte Ateliê)',
      category: 'Bonecos com Cabeça de Madeira e Saias Rodadas',
      desc: 'Modelo rápido para enfeites e lembranças.',
      duration: '16 min',
      url: 'https://www.youtube.com/watch?v=2DD9ANw1Fpc',
      youtubeId: '2DD9ANw1Fpc',
      builtin: true
    },
    {
      id: 'tut-boneco-3',
      title: 'Saia Rodada em Croché para Boneca / Busto (Lena Artes)',
      category: 'Bonecos com Cabeça de Madeira e Saias Rodadas',
      desc: 'Como tecer saia aberta a partir da cintura.',
      duration: '37 min',
      url: 'https://www.youtube.com/watch?v=2_0yp55zshY',
      youtubeId: '2_0yp55zshY',
      builtin: true
    },
    {
      id: 'tut-boneco-4',
      title: 'Saias e Vestidos Godê para Qualquer Boneca (Fátima Moraes)',
      category: 'Bonecos com Cabeça de Madeira e Saias Rodadas',
      desc: 'Regra dos aumentos para adaptar a qualquer tamanho.',
      duration: '8 min',
      url: 'https://www.youtube.com/watch?v=n2f_9-gQKTA',
      youtubeId: 'n2f_9-gQKTA',
      builtin: true
    },
    {
      id: 'tut-boneco-5',
      title: 'Porta-Chaves Bonequinha Simples (Artes da Márcia)',
      category: 'Bonecos com Cabeça de Madeira e Saias Rodadas',
      desc: 'Passo a passo para miniatura de porta-chaves.',
      duration: '31 min',
      url: 'https://www.youtube.com/watch?v=ag6XcGzD6g8',
      youtubeId: 'ag6XcGzD6g8',
      builtin: true
    },
    // Outras categorias de pesquisa rápida
    {
      id: 'def-1',
      title: 'Pontos Base de Croché para Iniciantes',
      category: 'Pontos Base',
      desc: 'Pesquisa direta de aulas em português para pontos base.',
      searchQuery: 'croche pontos base iniciantes portugues',
      youtubeId: '',
      builtin: true
    },
    {
      id: 'def-2',
      title: 'Flor em Miniatura Passo a Passo',
      category: 'Flores em Miniatura',
      desc: 'Pesquisa direta de flores em miniatura.',
      searchQuery: 'flor croche miniatura passo a passo portugues',
      youtubeId: '',
      builtin: true
    },
    {
      id: 'def-3',
      title: 'Miniaturas Amigurumi (Anel Mágico e Aumentos)',
      category: 'Miniaturas Amigurumi',
      desc: 'Pesquisa direta de miniaturas amigurumi.',
      searchQuery: 'amigurumi miniatura croche passo a passo portugues',
      youtubeId: '',
      builtin: true
    },
    {
      id: 'def-4',
      title: 'Bicos de Renda e Picô em Croché',
      category: 'Rendas e Bicos',
      desc: 'Pesquisa direta de bicos de renda e picô.',
      searchQuery: 'bico de renda croche pico passo a passo portugues',
      youtubeId: '',
      builtin: true
    }
  ];

  const DEFAULT_PX_PER_CM = 37.79527559;

  const state = {
    videoCat: 'Todos',
    videos: [],
    photos: [],
    currentProject: { name: 'O Meu Trabalho', count: 0 },
    savedProjects: [],
    notebookProjects: [],
    editingNotebookId: null,
    pendingNotebookPhoto: '',
    pxPerCm: DEFAULT_PX_PER_CM,
    zoomScale: 1,
    deferredInstallPrompt: null
  };

  const $ = (id) => document.getElementById(id);

  function showToast(msg, ms = 2500) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), ms);
  }

  // --- Navegação ---
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      $(btn.dataset.tab).classList.add('active');
    });
  });

  // --- Instalação PWA ---
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredInstallPrompt = e;
    $('btnInstallApp').classList.add('visible');
  });

  $('btnInstallApp').addEventListener('click', async () => {
    if (!state.deferredInstallPrompt) {
      showToast('No menu do browser escolha "Adicionar ao Ecrã Principal".');
      return;
    }
    state.deferredInstallPrompt.prompt();
    const res = await state.deferredInstallPrompt.userChoice;
    if (res.outcome === 'accepted') {
      $('btnInstallApp').classList.remove('visible');
      showToast('Ateliê de Croché instalado!');
    }
    state.deferredInstallPrompt = null;
  });

  // --- Vídeos & Aulas ---
  function extractYoutubeId(url) {
    if (!url) return '';
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
      /^([A-Za-z0-9_-]{11})$/
    ];
    for (const p of patterns) {
      const m = url.trim().match(p);
      if (m) return m[1];
    }
    return '';
  }

  function playYoutube(ytId, title) {
    if (!ytId) return;
    $('playerTitle').textContent = title;
    $('videoIframe').src = `https://www.youtube.com/embed/${ytId}?rel=0`;
    $('videoPlayerWrap').classList.add('visible');
    $('videoPlayerWrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  $('btnClosePlayer').addEventListener('click', () => {
    $('videoIframe').src = '';
    $('videoPlayerWrap').classList.remove('visible');
  });

  $('videoCatChips').querySelectorAll('.chip').forEach((c) => {
    c.addEventListener('click', () => {
      $('videoCatChips').querySelectorAll('.chip').forEach((x) => x.classList.remove('active'));
      c.classList.add('active');
      state.videoCat = c.dataset.cat;
      renderVideos();
    });
  });

  function saveFavVideosLocal(list) {
    try {
      localStorage.setItem(LS_FAV_VIDEOS_KEY, JSON.stringify(list));
    } catch (_) {}
  }

  function loadFavVideosLocal() {
    try {
      const raw = localStorage.getItem(LS_FAV_VIDEOS_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  $('btnAddVideo').addEventListener('click', async () => {
    const title = $('vidTitleInput').value.trim();
    const category = $('vidCatInput').value;
    const rawUrl = $('vidUrlInput').value.trim();
    const ytId = extractYoutubeId(rawUrl);

    if (!title || !ytId) {
      showToast('Indique um título e um link válido do YouTube.');
      return;
    }

    state.videos.unshift({
      id: 'vid-' + Date.now(),
      title,
      category,
      youtubeId: ytId,
      url: `https://www.youtube.com/watch?v=${ytId}`,
      builtin: false
    });
    saveFavVideosLocal(state.videos);
    await setMeta('videos', state.videos);
    $('vidTitleInput').value = '';
    $('vidUrlInput').value = '';
    renderVideos();
    showToast('🎬 Vídeo guardado nos seus favoritos!');
  });

  function createVideoCard(v) {
    const card = document.createElement('div');
    card.className = 'card';
    const watchHref = v.url || (v.youtubeId
      ? `https://www.youtube.com/watch?v=${v.youtubeId}`
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(v.searchQuery || v.title)}`);
    const btnLabel = (v.url || v.youtubeId) ? '▶️ Ver Vídeo no YouTube' : '🔎 Pesquisar no YouTube';

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
        <div style="flex:1;">
          <div style="font-weight:800;font-size:15px;">${escapeHtml(v.title)}</div>
          ${v.desc ? `<p class="muted" style="margin:4px 0 0;">${escapeHtml(v.desc)}</p>` : ''}
          <div class="project-meta-chips" style="margin-top:6px;">
            <span class="meta-pill">${escapeHtml(v.category)}</span>
            ${v.duration ? `<span class="meta-pill">⏱️ ${escapeHtml(v.duration)}</span>` : ''}
          </div>
        </div>
        ${!v.builtin ? `<button class="btn btn-danger btn-sm" data-del="${v.id}" title="Apagar vídeo">🗑️</button>` : ''}
      </div>
      <a class="btn btn-rose" target="_blank" rel="noopener" href="${watchHref}">${btnLabel}</a>
    `;

    const delBtn = card.querySelector('[data-del]');
    if (delBtn) {
      delBtn.addEventListener('click', async () => {
        if (!confirm(`Remover "${v.title}" dos favoritos?`)) return;
        state.videos = state.videos.filter((x) => x.id !== v.id);
        saveFavVideosLocal(state.videos);
        await setMeta('videos', state.videos);
        renderVideos();
      });
    }
    return card;
  }

  function renderVideos() {
    const list = $('videosList');
    list.innerHTML = '';

    const userFiltered = state.videoCat === 'Todos'
      ? state.videos
      : state.videos.filter((v) => v.category === state.videoCat);

    if (userFiltered.length) {
      const h = document.createElement('h3');
      h.className = 'section-title';
      h.style.padding = '0 4px';
      h.textContent = '⭐ Os Meus Vídeos Guardados';
      list.appendChild(h);
      userFiltered.forEach((v) => list.appendChild(createVideoCard(v)));
    }

    const builtinFiltered = state.videoCat === 'Todos'
      ? DEFAULT_VIDEOS
      : DEFAULT_VIDEOS.filter((v) => v.category === state.videoCat);

    const catOrder = [
      { key: 'Costura e Montagem de Peças', label: '🪡 Categoria 1 — Costura e Montagem de Peças' },
      { key: 'Bonecos com Cabeça de Madeira e Saias Rodadas', label: '👼 Categoria 2 — Bonecos com Cabeça de Madeira e Saias Rodadas' },
      { key: 'Pontos Base', label: '🧶 Pontos Base & Outras Aulas' },
      { key: 'Flores em Miniatura', label: '🌸 Flores em Miniatura' },
      { key: 'Miniaturas Amigurumi', label: '🧸 Miniaturas Amigurumi' },
      { key: 'Rendas e Bicos', label: '🪡 Rendas e Bicos' }
    ];

    catOrder.forEach((cat) => {
      const items = builtinFiltered.filter((v) => v.category === cat.key);
      if (!items.length) return;
      const h = document.createElement('h3');
      h.className = 'section-title';
      h.style.padding = '4px 4px 0';
      h.textContent = cat.label;
      list.appendChild(h);
      items.forEach((v) => list.appendChild(createVideoCard(v)));
    });
  }

  // --- Imagens, Esquemas & Zoom ---
  function openZoomModal(src, title) {
    state.zoomScale = 1;
    $('zoomTitle').textContent = title || 'Esquema';
    $('zoomImg').src = src;
    $('zoomImg').style.transform = 'scale(1)';
    $('zoomModal').classList.add('open');
  }

  $('btnZoomIn').addEventListener('click', () => {
    state.zoomScale = Math.min(3.5, state.zoomScale + 0.4);
    $('zoomImg').style.transform = `scale(${state.zoomScale})`;
  });

  $('btnZoomOut').addEventListener('click', () => {
    state.zoomScale = Math.max(0.6, state.zoomScale - 0.4);
    $('zoomImg').style.transform = `scale(${state.zoomScale})`;
  });

  $('btnZoomReset').addEventListener('click', () => {
    state.zoomScale = 1;
    $('zoomImg').style.transform = 'scale(1)';
  });

  $('btnZoomClose').addEventListener('click', () => {
    $('zoomModal').classList.remove('open');
  });

  $('photoFileInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      showToast('A guardar imagem...');
      const dataUrl = await compressImageFile(file, 1080, 0.78);
      const title = $('photoTitleInput').value.trim() || `Trabalho ${new Date().toLocaleDateString('pt-PT')}`;
      await savePhoto({
        id: 'foto-' + Date.now(),
        timestamp: Date.now(),
        dateStr: new Date().toLocaleDateString('pt-PT'),
        title,
        src: dataUrl
      });
      $('photoTitleInput').value = '';
      e.target.value = '';
      state.photos = await getAllPhotos();
      renderUserGallery();
      showToast('📸 Imagem guardada na galeria!');
    } catch (_) {
      showToast('Erro ao processar imagem.');
    }
  });

  function renderBuiltinGallery() {
    const grid = $('builtinGallery');
    grid.innerHTML = '';
    BUILTIN_SCHEMAS.forEach((s) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `
        <img class="gallery-thumb" src="${s.src}" alt="${escapeHtml(s.title)}">
        <div class="gallery-meta">
          <div class="gallery-title">${escapeHtml(s.title)}</div>
          <div class="muted">${escapeHtml(s.category)}</div>
        </div>
      `;
      item.querySelector('img').addEventListener('click', () => openZoomModal(s.src, s.title));
      grid.appendChild(item);
    });
  }

  function renderUserGallery() {
    const grid = $('userGallery');
    if (!state.photos.length) {
      grid.innerHTML = '<div class="card" style="grid-column:span 2;"><span class="muted">Ainda não guardou fotos de esquemas ou trabalhos.</span></div>';
      return;
    }
    grid.innerHTML = '';
    state.photos.forEach((p) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `
        <img class="gallery-thumb" src="${p.src}" alt="${escapeHtml(p.title)}">
        <div class="gallery-meta">
          <div class="gallery-title">${escapeHtml(p.title)}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="muted">${p.dateStr || ''}</span>
            <button class="btn btn-danger btn-sm" style="padding:3px 7px;" data-del="${p.id}">🗑️</button>
          </div>
        </div>
      `;
      item.querySelector('img').addEventListener('click', () => openZoomModal(p.src, p.title));
      item.querySelector('[data-del]').addEventListener('click', async () => {
        if (!confirm('Apagar esta imagem?')) return;
        await deletePhoto(p.id);
        state.photos = await getAllPhotos();
        renderUserGallery();
      });
      grid.appendChild(item);
    });
  }

  // --- Contador de Carreiras & Guia ---
  async function updateCounter(newVal) {
    state.currentProject.count = Math.max(0, newVal);
    state.currentProject.name = $('projectNameInput').value.trim() || 'O Meu Trabalho';
    $('counterValue').textContent = state.currentProject.count;
    await setMeta('currentProject', state.currentProject);
  }

  $('btnCountPlus').addEventListener('click', () => updateCounter(state.currentProject.count + 1));
  $('btnCountMinus').addEventListener('click', () => updateCounter(state.currentProject.count - 1));
  $('btnCountReset').addEventListener('click', () => {
    if (state.currentProject.count > 0 && confirm('Zerar o contador de carreiras?')) {
      updateCounter(0);
    }
  });
  $('projectNameInput').addEventListener('change', () => updateCounter(state.currentProject.count));

  $('btnSaveProject').addEventListener('click', async () => {
    const name = $('projectNameInput').value.trim() || 'Projeto Sem Nome';
    const existing = state.savedProjects.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      existing.count = state.currentProject.count;
      existing.updatedAt = new Date().toLocaleDateString('pt-PT');
    } else {
      state.savedProjects.unshift({
        id: 'proj-' + Date.now(),
        name,
        count: state.currentProject.count,
        updatedAt: new Date().toLocaleDateString('pt-PT')
      });
    }
    await setMeta('savedProjects', state.savedProjects);
    renderSavedProjects();
    showToast(`🧶 Projeto "${name}" guardado!`);
  });

  function renderSavedProjects() {
    const list = $('savedProjectsList');
    if (!state.savedProjects.length) {
      list.innerHTML = '';
      return;
    }
    list.innerHTML = '<span class="muted" style="margin-top:4px;">Projetos guardados (toque para carregar):</span>';
    state.savedProjects.forEach((p) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:var(--card-soft);border-radius:10px;border:1px solid var(--border);';
      row.innerHTML = `
        <div style="cursor:pointer;flex:1;" data-load="${p.id}">
          <strong>${escapeHtml(p.name)}</strong> · <span style="color:var(--rose);font-weight:800;">${p.count} carr.</span>
        </div>
        <button class="btn btn-danger btn-sm" style="padding:3px 7px;" data-del="${p.id}">✕</button>
      `;
      row.querySelector('[data-load]').addEventListener('click', async () => {
        state.currentProject = { name: p.name, count: p.count };
        $('projectNameInput').value = p.name;
        $('counterValue').textContent = p.count;
        await setMeta('currentProject', state.currentProject);
        showToast(`Carregado: ${p.name}`);
      });
      row.querySelector('[data-del]').addEventListener('click', async () => {
        state.savedProjects = state.savedProjects.filter((x) => x.id !== p.id);
        await setMeta('savedProjects', state.savedProjects);
        renderSavedProjects();
      });
      list.appendChild(row);
    });
  }

  function renderGuideTables() {
    $('hookEquivBody').innerHTML = HOOK_EQUIVALENCE_TABLE.map((r) => `
      <tr>
        <td style="color:var(--rose);font-weight:800;">${escapeHtml(r.mm)}</td>
        <td><strong>${escapeHtml(r.oldNum)}</strong></td>
        <td class="muted">${escapeHtml(r.threadType)}</td>
      </tr>
    `).join('');

    $('threadHookBody').innerHTML = THREAD_HOOK_TABLE.map((r) => `
      <tr>
        <td><strong>${escapeHtml(r.thread)}</strong></td>
        <td style="color:var(--rose);font-weight:700;">${escapeHtml(r.hook)}</td>
        <td class="muted">${escapeHtml(r.use)}</td>
      </tr>
    `).join('');

    $('stitchDictGrid').innerHTML = STITCH_DICTIONARY.map((s) => `
      <div class="stitch-card">
        ${s.svg}
        <strong style="font-size:13px;">${escapeHtml(s.name)}</strong>
        <span class="muted" style="font-size:11.5px;">${escapeHtml(s.desc)}</span>
      </div>
    `).join('');
  }

  // --- Sub-navegação Ferramentas ---
  document.querySelectorAll('.tool-subbtn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tool-subbtn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tool-pane').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      $(btn.dataset.tool).classList.add('active');
    });
  });

  // --- Caderno de Projetos em Curso (localStorage) ---
  function resetNotebookForm() {
    state.editingNotebookId = null;
    state.pendingNotebookPhoto = '';
    $('projFormTitle').textContent = '📓 Caderno de Projetos em Curso';
    $('btnCancelEditProj').style.display = 'none';
    $('btnSaveNbProject').textContent = '💾 Guardar Ficha de Projeto';
    $('nbNameInput').value = '';
    $('nbHookInput').value = '';
    $('nbRowInput').value = '0';
    $('nbThreadInput').value = '';
    $('nbNotesInput').value = '';
    $('nbPhotoPreviewBox').classList.remove('visible');
    $('nbPhotoPreviewImg').src = '';
  }

  async function handleNotebookPhotoSelect(file) {
    if (!file) return;
    try {
      showToast('A comprimir foto...');
      const dataUrl = await compressImageFile(file, 640, 0.65);
      state.pendingNotebookPhoto = dataUrl;
      $('nbPhotoPreviewImg').src = dataUrl;
      $('nbPhotoPreviewBox').classList.add('visible');
      showToast('📸 Foto pronta!');
    } catch (_) {
      showToast('Não foi possível ler a imagem.');
    }
  }

  $('nbPhotoCamInput').addEventListener('change', (e) => {
    handleNotebookPhotoSelect(e.target.files[0]);
    e.target.value = '';
  });

  $('nbPhotoGalInput').addEventListener('change', (e) => {
    handleNotebookPhotoSelect(e.target.files[0]);
    e.target.value = '';
  });

  $('btnRemoveNbPhoto').addEventListener('click', () => {
    state.pendingNotebookPhoto = '';
    $('nbPhotoPreviewImg').src = '';
    $('nbPhotoPreviewBox').classList.remove('visible');
  });

  $('btnCancelEditProj').addEventListener('click', resetNotebookForm);

  function persistNotebook() {
    try {
      saveProjectsNotebook(state.notebookProjects);
      return true;
    } catch (_) {
      showToast('Memória local cheia! Apague uma foto ou projeto antigo.');
      return false;
    }
  }

  $('btnSaveNbProject').addEventListener('click', () => {
    const name = $('nbNameInput').value.trim();
    if (!name) {
      showToast('Indique o nome do projeto.');
      return;
    }
    const hook = $('nbHookInput').value.trim();
    const row = Math.max(0, parseInt($('nbRowInput').value, 10) || 0);
    const thread = $('nbThreadInput').value.trim();
    const notes = $('nbNotesInput').value.trim();
    const nowStr = new Date().toLocaleDateString('pt-PT');

    const prevList = [...state.notebookProjects];
    if (state.editingNotebookId) {
      const idx = state.notebookProjects.findIndex((p) => p.id === state.editingNotebookId);
      if (idx !== -1) {
        state.notebookProjects[idx] = {
          ...state.notebookProjects[idx],
          name,
          hook,
          row,
          thread,
          notes,
          photo: state.pendingNotebookPhoto,
          updatedAt: nowStr
        };
      }
    } else {
      state.notebookProjects.unshift({
        id: 'nb-' + Date.now(),
        name,
        hook,
        row,
        thread,
        notes,
        photo: state.pendingNotebookPhoto,
        updatedAt: nowStr
      });
    }

    if (!persistNotebook()) {
      state.notebookProjects = prevList;
      return;
    }

    const wasEdit = Boolean(state.editingNotebookId);
    resetNotebookForm();
    renderNotebookProjects();
    showToast(wasEdit ? '✏️ Ficha atualizada!' : '📓 Projeto guardado no caderno!');
  });

  function renderNotebookProjects() {
    const list = $('projectsNotebookList');
    if (!state.notebookProjects.length) {
      list.innerHTML = '<div class="card"><span class="muted">Ainda não tem projetos registados no caderno. Preencha o formulário acima para começar.</span></div>';
      return;
    }

    list.innerHTML = '';
    state.notebookProjects.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-top">
          ${p.photo ? `<img class="project-thumb" src="${p.photo}" alt="${escapeHtml(p.name)}" data-zoom="1">` : ''}
          <div style="flex:1;min-width:0;">
            <div style="font-weight:800;font-size:15.5px;">${escapeHtml(p.name)}</div>
            <div class="project-meta-chips">
              ${p.hook ? `<span class="meta-pill">🪡 ${escapeHtml(p.hook)}</span>` : ''}
              ${p.thread ? `<span class="meta-pill">🧵 ${escapeHtml(p.thread)}</span>` : ''}
            </div>
            <div class="muted" style="margin-top:4px;font-size:11.5px;">Atualizado: ${escapeHtml(p.updatedAt || '')}</div>
          </div>
        </div>
        ${p.notes ? `<div class="project-notes">${escapeHtml(p.notes)}</div>` : ''}
        <div class="project-row-bar">
          <div>
            <span class="muted" style="font-size:11.5px;display:block;">Carreira atual</span>
            <strong style="font-size:20px;color:var(--rose);">${p.row || 0}</strong>
          </div>
          <div class="project-row-btns">
            <button class="btn btn-sm" data-row-delta="-1" style="min-width:46px;">−1</button>
            <button class="btn btn-rose btn-sm" data-row-delta="1" style="min-width:54px;">+1</button>
          </div>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;">
          <button class="btn btn-sm" data-edit="${p.id}">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" data-del="${p.id}">🗑️ Apagar</button>
        </div>
      `;

      const img = card.querySelector('[data-zoom]');
      if (img) img.addEventListener('click', () => openZoomModal(p.photo, p.name));

      card.querySelectorAll('[data-row-delta]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const delta = parseInt(btn.dataset.rowDelta, 10);
          p.row = Math.max(0, (p.row || 0) + delta);
          p.updatedAt = new Date().toLocaleDateString('pt-PT');
          persistNotebook();
          renderNotebookProjects();
        });
      });

      card.querySelector('[data-edit]').addEventListener('click', () => {
        state.editingNotebookId = p.id;
        state.pendingNotebookPhoto = p.photo || '';
        $('projFormTitle').textContent = '✏️ Editar Ficha de Projeto';
        $('btnCancelEditProj').style.display = 'inline-flex';
        $('btnSaveNbProject').textContent = '💾 Guardar Alterações';
        $('nbNameInput').value = p.name || '';
        $('nbHookInput').value = p.hook || '';
        $('nbRowInput').value = p.row || 0;
        $('nbThreadInput').value = p.thread || '';
        $('nbNotesInput').value = p.notes || '';
        if (p.photo) {
          $('nbPhotoPreviewImg').src = p.photo;
          $('nbPhotoPreviewBox').classList.add('visible');
        } else {
          $('nbPhotoPreviewImg').src = '';
          $('nbPhotoPreviewBox').classList.remove('visible');
        }
        $('tabProjetos').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      card.querySelector('[data-del]').addEventListener('click', () => {
        if (!confirm(`Apagar a ficha "${p.name}"?`)) return;
        state.notebookProjects = state.notebookProjects.filter((x) => x.id !== p.id);
        if (state.editingNotebookId === p.id) resetNotebookForm();
        persistNotebook();
        renderNotebookProjects();
        showToast('Ficha apagada.');
      });

      list.appendChild(card);
    });
  }

  // --- Régua de Medição (cm) & Calibração (Cartão MB 8,56 cm) ---
  function renderRuler() {
    const pxPerCm = state.pxPerCm;
    const totalCm = 20;
    const padLeft = 14;
    const width = Math.ceil(totalCm * pxPerCm + padLeft * 2);
    const svg = $('rulerSvg');
    svg.setAttribute('width', width);
    svg.setAttribute('viewBox', `0 0 ${width} 96`);

    let marks = `<rect x="0" y="0" width="${width}" height="96" fill="#fffdf9"/>`;
    marks += `<line x1="0" y1="2" x2="${width}" y2="2" stroke="#b85d73" stroke-width="2"/>`;

    const totalMm = totalCm * 10;
    for (let mm = 0; mm <= totalMm; mm++) {
      const x = (padLeft + (mm / 10) * pxPerCm).toFixed(2);
      const isCm = mm % 10 === 0;
      const isHalf = mm % 5 === 0 && !isCm;
      const h = isCm ? 42 : (isHalf ? 28 : 16);
      const stroke = isCm ? '#b85d73' : (isHalf ? '#5b8a72' : '#8c7a74');
      const sw = isCm ? '2' : (isHalf ? '1.5' : '1');
      marks += `<line x1="${x}" y1="2" x2="${x}" y2="${h}" stroke="${stroke}" stroke-width="${sw}"/>`;
      if (isCm) {
        const cmNum = mm / 10;
        marks += `<text x="${x}" y="66" text-anchor="middle" font-size="14" font-weight="800" fill="#2d2424" font-family="sans-serif">${cmNum}</text>`;
        if (cmNum === 0) {
          marks += `<text x="${x}" y="84" text-anchor="middle" font-size="10" font-weight="700" fill="#b85d73" font-family="sans-serif">cm</text>`;
        }
      }
    }
    svg.innerHTML = marks;

    const cardWidthPx = Math.round(8.56 * pxPerCm);
    $('calibCardBox').style.width = `${cardWidthPx}px`;
    $('calibRange').value = pxPerCm.toFixed(1);
  }

  function updateRulerStatusBadge(isCalibrated) {
    const badge = $('rulerStatusBadge');
    if (isCalibrated) {
      badge.textContent = 'Calibrada ✓';
      badge.style.background = 'var(--sage-soft)';
      badge.style.color = 'var(--sage)';
    } else {
      badge.textContent = 'Padrão';
      badge.style.background = 'var(--card-soft)';
      badge.style.color = 'var(--muted)';
    }
  }

  $('btnToggleCalib').addEventListener('click', () => {
    $('calibPanel').classList.toggle('open');
  });

  $('calibRange').addEventListener('input', (e) => {
    state.pxPerCm = parseFloat(e.target.value);
    renderRuler();
  });

  $('btnCalibMinus').addEventListener('click', () => {
    state.pxPerCm = Math.max(24, +(state.pxPerCm - 0.5).toFixed(1));
    renderRuler();
  });

  $('btnCalibPlus').addEventListener('click', () => {
    state.pxPerCm = Math.min(90, +(state.pxPerCm + 0.5).toFixed(1));
    renderRuler();
  });

  $('btnSaveCalib').addEventListener('click', () => {
    setRulerPxPerCm(state.pxPerCm);
    updateRulerStatusBadge(true);
    $('calibPanel').classList.remove('open');
    showToast('📏 Calibração da régua guardada!');
  });

  $('btnResetCalib').addEventListener('click', () => {
    state.pxPerCm = DEFAULT_PX_PER_CM;
    setRulerPxPerCm(null);
    updateRulerStatusBadge(false);
    renderRuler();
    showToast('Régua reposta para o padrão.');
  });

  // --- Calculadora de Custo & Preço ---
  function formatEuro(val) {
    return val.toFixed(2).replace('.', ',') + ' €';
  }

  function updateCostCalculator() {
    const thread = Math.max(0, parseFloat($('calcThreadCost').value) || 0);
    const other = Math.max(0, parseFloat($('calcOtherCost').value) || 0);
    const hours = Math.max(0, parseFloat($('calcHours').value) || 0);
    const rate = Math.max(0, parseFloat($('calcHourlyRate').value) || 0);

    const materials = thread + other;
    const labor = hours * rate;
    const total = materials + labor;
    const suggested = total * 1.3;

    $('calcMaterialsOut').textContent = formatEuro(materials);
    $('calcLaborOut').textContent = formatEuro(labor);
    $('calcTotalOut').textContent = formatEuro(total);
    $('calcSuggestedOut').textContent = formatEuro(suggested);
  }

  ['calcThreadCost', 'calcOtherCost', 'calcHours'].forEach((id) => {
    $(id).addEventListener('input', updateCostCalculator);
  });

  $('calcHourlyRate').addEventListener('input', () => {
    const rate = Math.max(0, parseFloat($('calcHourlyRate').value) || 0);
    setHourlyRate(rate);
    updateCostCalculator();
  });

  $('btnClearCalc').addEventListener('click', () => {
    $('calcThreadCost').value = '';
    $('calcOtherCost').value = '';
    $('calcHours').value = '';
    updateCostCalculator();
  });

  // --- Cópia de Segurança JSON ---
  $('btnOpenBackup').addEventListener('click', () => $('backupModal').classList.add('open'));
  $('btnCloseBackup').addEventListener('click', () => $('backupModal').classList.remove('open'));

  $('btnExportBackup').addEventListener('click', async () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      currentProject: state.currentProject,
      savedProjects: state.savedProjects,
      notebookProjects: state.notebookProjects,
      videos: state.videos,
      photos: state.photos
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `atelie_croche_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    showToast('Cópia de segurança exportada!');
  });

  $('importBackupInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.currentProject) {
          state.currentProject = data.currentProject;
          await setMeta('currentProject', state.currentProject);
        }
        if (Array.isArray(data.savedProjects)) {
          state.savedProjects = data.savedProjects;
          await setMeta('savedProjects', state.savedProjects);
        }
        if (Array.isArray(data.notebookProjects)) {
          state.notebookProjects = data.notebookProjects;
          persistNotebook();
        }
        if (Array.isArray(data.videos)) {
          state.videos = data.videos;
          saveFavVideosLocal(state.videos);
          await setMeta('videos', state.videos);
        }
        if (Array.isArray(data.photos)) {
          for (const p of data.photos) {
            if (p && p.id && p.src) await savePhoto(p);
          }
          state.photos = await getAllPhotos();
        }
        $('projectNameInput').value = state.currentProject.name;
        $('counterValue').textContent = state.currentProject.count;
        renderVideos();
        renderUserGallery();
        renderSavedProjects();
        renderNotebookProjects();
        $('backupModal').classList.remove('open');
        showToast('Cópia de segurança restaurada!');
      } catch (_) {
        showToast('Erro ao importar ficheiro JSON.');
      }
    };
    reader.readAsText(file);
  });

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  // Arranque
  async function boot() {
    const localFavs = loadFavVideosLocal();
    state.videos = localFavs !== null ? localFavs : await getMeta('videos', []);
    state.savedProjects = await getMeta('savedProjects', []);
    state.currentProject = await getMeta('currentProject', { name: 'O Meu Trabalho', count: 0 });
    state.photos = await getAllPhotos();
    state.notebookProjects = getProjectsNotebook();

    const savedPx = getRulerPxPerCm();
    if (savedPx) {
      state.pxPerCm = savedPx;
      updateRulerStatusBadge(true);
    } else {
      updateRulerStatusBadge(false);
    }

    $('calcHourlyRate').value = getHourlyRate();
    $('projectNameInput').value = state.currentProject.name || 'O Meu Trabalho';
    $('counterValue').textContent = state.currentProject.count || 0;

    renderVideos();
    renderBuiltinGallery();
    renderUserGallery();
    renderSavedProjects();
    renderNotebookProjects();
    renderRuler();
    updateCostCalculator();
    renderGuideTables();
  }

  boot();
})();
