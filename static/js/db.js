/**
 * Armazenamento Local (IndexedDB + fallback localStorage) para Ateliê de Croché & Renda
 */
(function (global) {
  'use strict';

  const DB_NAME = 'atelie_croche_db_v1';
  const DB_VERSION = 1;
  const STORE_PHOTOS = 'fotos';
  const STORE_META = 'dados';
  const LS_META_KEY = 'atelie_croche_meta_v1';
  const LS_NOTEBOOK_KEY = 'atelie_croche_caderno_v1';
  const LS_RULER_KEY = 'atelie_croche_regua_px_v1';
  const LS_RATE_KEY = 'atelie_croche_valor_hora_v1';

  let dbInstance = null;

  function openDB() {
    if (dbInstance) return Promise.resolve(dbInstance);
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB indisponível'));
        return;
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
          db.createObjectStore(STORE_PHOTOS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_META)) {
          db.createObjectStore(STORE_META, { keyPath: 'key' });
        }
      };
      req.onsuccess = () => {
        dbInstance = req.result;
        resolve(dbInstance);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async function getAllPhotos() {
    try {
      const db = await openDB();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_PHOTOS, 'readonly');
        const req = tx.objectStore(STORE_PHOTOS).getAll();
        req.onsuccess = () => {
          const list = req.result || [];
          list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          resolve(list);
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  }

  async function savePhoto(photoObj) {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PHOTOS, 'readwrite');
      tx.objectStore(STORE_PHOTOS).put(photoObj);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function deletePhoto(id) {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PHOTOS, 'readwrite');
      tx.objectStore(STORE_PHOTOS).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getMeta(key, defaultValue) {
    try {
      const db = await openDB();
      const val = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_META, 'readonly');
        const req = tx.objectStore(STORE_META).get(key);
        req.onsuccess = () => resolve(req.result ? req.result.value : undefined);
        req.onerror = () => reject(req.error);
      });
      if (val !== undefined) return val;
    } catch (_) {}

    try {
      const ls = JSON.parse(localStorage.getItem(LS_META_KEY) || '{}');
      return ls[key] !== undefined ? ls[key] : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  async function setMeta(key, value) {
    try {
      const ls = JSON.parse(localStorage.getItem(LS_META_KEY) || '{}');
      ls[key] = value;
      localStorage.setItem(LS_META_KEY, JSON.stringify(ls));
    } catch (_) {}

    try {
      const db = await openDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_META, 'readwrite');
        tx.objectStore(STORE_META).put({ key, value });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (_) {}
  }

  function compressImageFile(file, maxWidth = 1080, quality = 0.78) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Erro ao ler imagem'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Imagem inválida'));
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          canvas.width = 0;
          canvas.height = 0;
          img.src = '';
          resolve(dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function getProjectsNotebook() {
    try {
      const raw = localStorage.getItem(LS_NOTEBOOK_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveProjectsNotebook(list) {
    localStorage.setItem(LS_NOTEBOOK_KEY, JSON.stringify(list));
  }

  function getRulerPxPerCm() {
    try {
      const val = parseFloat(localStorage.getItem(LS_RULER_KEY));
      return Number.isFinite(val) && val > 15 && val < 150 ? val : null;
    } catch {
      return null;
    }
  }

  function setRulerPxPerCm(px) {
    try {
      if (px === null) {
        localStorage.removeItem(LS_RULER_KEY);
      } else {
        localStorage.setItem(LS_RULER_KEY, String(px));
      }
    } catch (_) {}
  }

  function getHourlyRate() {
    try {
      const val = parseFloat(localStorage.getItem(LS_RATE_KEY));
      return Number.isFinite(val) && val >= 0 ? val : 10;
    } catch {
      return 10;
    }
  }

  function setHourlyRate(rate) {
    try {
      localStorage.setItem(LS_RATE_KEY, String(rate));
    } catch (_) {}
  }

  global.CrocheDB = {
    getAllPhotos,
    savePhoto,
    deletePhoto,
    getMeta,
    setMeta,
    compressImageFile,
    getProjectsNotebook,
    saveProjectsNotebook,
    getRulerPxPerCm,
    setRulerPxPerCm,
    getHourlyRate,
    setHourlyRate
  };
})(window);
