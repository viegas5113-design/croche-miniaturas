/**
 * Ateliê de Croché & Renda - Aplicação Principal (PWA Móvel)
 */
(function () {
  'use strict';

  const { getAllPhotos, savePhoto, deletePhoto, getMeta, setMeta, compressImageFile } = window.CrocheDB;
  const { BUILTIN_SCHEMAS, STITCH_DICTIONARY, THREAD_HOOK_TABLE } = window.CrocheCharts;

  const DEFAULT_VIDEOS = [
    {
      id: 'def-1',
      title: 'Pontos Base de Croché para Iniciantes',
      category: 'Pontos Base',
      searchQuery: 'croche pontos base iniciantes portugues',
      youtubeId: '',
      builtin: true
    },
    {
      id: 'def-2',
      title: 'Flor em Miniatura Passo a Passo',
      category: 'Flores em Miniatura',
      searchQuery: 'flor croche miniatura passo a passo portugues',
      youtubeId: '',
      builtin: true
    },
    {
      id: 'def-3',
      title: 'Miniaturas Amigurumi (Anel Mágico e Aumentos)',
      category: 'Miniaturas Amigurumi',
      searchQuery: 'amigurumi miniatura croche passo a passo portugues',
      youtubeId: '',
      builtin: true
    },
    {
      id: 'def-4',
      title: 'Bicos de Renda e Picô em Croché',
      category: 'Rendas e Bicos',
      searchQuery: 'bico de renda croche pico passo a passo portugues',
      youtubeId: '',
      builtin: true
    }
  ];

  const state = {
    videoCat: 'Todos',
    videos: [],
    photos: [],
    currentProject: { name: 'O Meu Trabalho', count: 0 },
    savedProjects: [],
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
      url: rawUrl,
      builtin: false
    });
    await setMeta('videos', state.videos);
    $('vidTitleInput').value = '';
    $('vidUrlInput').value = '';
    renderVideos();
    showToast('🎥 Vídeo guardado na sua lista!');
  });

  function renderVideos() {
    const list = $('videosList');
    const all = [...state.videos, ...DEFAULT_VIDEOS];
    const filtered = state.videoCat === 'Todos'
      ? all
      : all.filter((v) => v.category === state.videoCat);

    list.innerHTML = '';
    filtered.forEach((v) => {
      const card = document.createElement('div');
      card.className = 'card';
      const searchHref = `https://www.youtube.com/results?search_query=${encodeURIComponent(v.searchQuery || v.title)}`;
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
          <div>
            <div style="font-weight:800;font-size:14.5px;">${escapeHtml(v.title)}</div>
            <span class="muted">Categoria: ${escapeHtml(v.category)}</span>
          </div>
          ${!v.builtin ? `<button class="btn btn-danger btn-sm" data-del="${v.id}">🗑️</button>` : ''}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${v.youtubeId
            ? `<button class="btn btn-rose btn-sm" data-play="${v.youtubeId}">▶️ Ver Aqui</button>`
            : ''}
          <a class="btn btn-sage btn-sm" target="_blank" rel="noopener" href="${searchHref}">🔎 Abrir no YouTube</a>
        </div>
      `;
      const playBtn = card.querySelector('[data-play]');
      if (playBtn) playBtn.addEventListener('click', () => playYoutube(v.youtubeId, v.title));
      const delBtn = card.querySelector('[data-del]');
      if (delBtn) {
        delBtn.addEventListener('click', async () => {
          state.videos = state.videos.filter((x) => x.id !== v.id);
          await setMeta('videos', state.videos);
          renderVideos();
        });
      }
      list.appendChild(card);
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

  // --- Cópia de Segurança JSON ---
  $('btnOpenBackup').addEventListener('click', () => $('backupModal').classList.add('open'));
  $('btnCloseBackup').addEventListener('click', () => $('backupModal').classList.remove('open'));

  $('btnExportBackup').addEventListener('click', async () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      currentProject: state.currentProject,
      savedProjects: state.savedProjects,
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
        if (Array.isArray(data.videos)) {
          state.videos = data.videos;
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
    state.videos = await getMeta('videos', []);
    state.savedProjects = await getMeta('savedProjects', []);
    state.currentProject = await getMeta('currentProject', { name: 'O Meu Trabalho', count: 0 });
    state.photos = await getAllPhotos();

    $('projectNameInput').value = state.currentProject.name || 'O Meu Trabalho';
    $('counterValue').textContent = state.currentProject.count || 0;

    renderVideos();
    renderBuiltinGallery();
    renderUserGallery();
    renderSavedProjects();
    renderGuideTables();
  }

  boot();
})();
