'use strict';
// Reisechronik: Nur statisches HTML/CSS/JS. Kein Konto, keine Datenbank, kein Tracking.
// Abspielpositionen bleiben lokal auf dem jeweiligen Browser/Gerät gespeichert.
(() => {
  const library = window.REISECHRONIK_DATA;
  if (!library || !Array.isArray(library.trips)) {
    document.getElementById('trip-grid').textContent = 'Die Reisedaten konnten nicht geladen werden.';
    return;
  }
  const $ = (id) => document.getElementById(id);
  const audio = $('audio');
  const state = { trip: null, chapterIndex: -1, duration: 0, pendingSeek: 0, lastSaveSecond: -1 };
  const STORAGE = 'reisechronik:v1:';
  const getStored = (key, fallback) => { try { const value = localStorage.getItem(STORAGE + key); return value === null ? fallback : JSON.parse(value); } catch { return fallback; } };
  const setStored = (key, value) => { try { localStorage.setItem(STORAGE + key, JSON.stringify(value)); } catch { /* Speichern im Browser nicht möglich */ } };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const playable = (ch) => ch?.audio === true || (typeof ch?.audio === 'string' && ch.audio.trim().length > 0);
  const chapterAudio = (trip, ch) => ch.audio === true ? `${trip.audioFolder}/${ch.file}.mp3` : ch.audio;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'];
  // Ein Bild mit gleichem Dateistamm wie die MP3. Fehlende Bilder zeigen ein Fallback.
  function useImage(img, stem, fallback) {
    if (!img) return;
    img.onerror = null;
    let current = 0;
    img.onerror = () => {
      if (++current < imageExtensions.length) {
        img.src = stem + imageExtensions[current];
      } else {
        img.onerror = null;
        img.src = fallback;
      }
    };
    img.src = stem + imageExtensions[0];
  }
  function chapterImageStem(trip, chapter) {
    if (!trip.audioFolder || !chapter.file) return null;
    return `${trip.audioFolder}/${chapter.file}`;
  }
  function initImages(root) {
    root.querySelectorAll('img[data-image-stem]').forEach(img =>
      useImage(img, img.dataset.imageStem, img.dataset.fallback || 'assets/chapter-placeholder.svg'));
  }
  const playableCount = (trip) => trip.chapters.filter(playable).length;
  const fmt = (seconds) => { seconds = Math.max(0, Math.floor(Number(seconds) || 0)); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; };
  const escapeAttr = escapeHtml;
  const cardStatus = (trip) => { const count = playableCount(trip); return count ? `${count} Hörbuchkapitel verfügbar` : 'Hörbücher in Vorbereitung'; };

  const search = $('trip-search');
  function renderTrips() {
    const term = search.value.trim().toLocaleLowerCase('de');
    const matches = library.trips.filter(trip => [trip.title,trip.region,trip.year,trip.subtitle].join(' ').toLocaleLowerCase('de').includes(term));
    $('trip-grid').innerHTML = matches.length ? matches.map(trip => `
      <article class="trip-card">
        <div class="trip-cover"><img data-image-stem="${escapeAttr(trip.audioFolder + '/' + (trip.coverBase || '0-cover'))}" data-fallback="${escapeAttr(trip.fallbackCover)}" src="${escapeAttr(trip.fallbackCover)}" loading="lazy" alt="Vorschaubild zur Reise ${escapeAttr(trip.title)}">
          <span class="trip-pill">${escapeHtml(trip.region)}</span>
          <span class="trip-cover-status">${escapeHtml(cardStatus(trip))}</span>
        </div>
        <div class="trip-body"><h3>${escapeHtml(trip.title)}</h3><p>${escapeHtml(trip.subtitle)}</p>
          <div class="trip-foot"><span>${escapeHtml(trip.period)}</span><button type="button" data-trip="${escapeAttr(trip.id)}">Kapitel ansehen ↗</button></div>
        </div>
      </article>`).join('') : '<div class="empty-search">Keine passende Reise gefunden.</div>';
    initImages($('trip-grid'));
    $('trip-grid').querySelectorAll('[data-trip]').forEach(btn => btn.addEventListener('click', () => openTrip(btn.dataset.trip)));
  }
  function findTrip(id) { return library.trips.find(trip => trip.id === id); }
  function openTrip(id, updateHash = true) {
    const trip = findTrip(id); if (!trip) return;
    // Der aktuelle Player bleibt bestehen, auch wenn eine andere Reise geöffnet wird.
    $('detail-region').textContent = trip.region;
    $('detail-title').textContent = trip.title;
    $('detail-subtitle').textContent = trip.subtitle;
    $('detail-count').textContent = `${trip.chapters.length} ${trip.chapters.length === 1 ? 'Kapitel' : 'Kapitel'} · Arbeitstitel`;
    const available = playableCount(trip);
    $('detail-info').textContent = available ? `${available} Kapitel verfügbar · thematische Folgen von ungefähr 15 Minuten` : 'Arbeitstitel · thematische Folgen von ungefähr 15 Minuten';
    $('play-trip').disabled = available === 0;
    $('play-trip').onclick = () => { const idx = trip.chapters.findIndex(playable); if (idx >= 0) playChapter(trip, idx); };
    $('chapter-list').innerHTML = trip.chapters.length ? trip.chapters.map((chapter, index) => {
      const availableAudio = playable(chapter);
      const progress = getStored('position:' + chapter.id, null);
      const progressText = availableAudio && progress?.completed ? ' · Abgeschlossen' : availableAudio && progress?.position > 10 ? ` · Bei ${fmt(progress.position)} fortsetzen` : '';
      const markers = availableAudio && Array.isArray(chapter.markers) && chapter.markers.length ? `<div class="chapter-markers" aria-label="Zeitmarken">${chapter.markers.map(mark => `<button type="button" class="marker-chip" data-marker="${index}" data-time="${Number(mark.time) || 0}" title="Zu dieser Stelle springen">${escapeHtml(fmt(mark.time))} · ${escapeHtml(mark.label)}</button>`).join('')}</div>` : '';
      const imageStem = chapterImageStem(trip, chapter);
      const chapterVisual = imageStem
        ? `<div class="chapter-art-wrap"><img class="chapter-art" data-image-stem="${escapeAttr(imageStem)}" data-fallback="assets/chapter-placeholder.svg" src="assets/chapter-placeholder.svg" loading="lazy" alt="Bild zu ${escapeAttr(chapter.title)}"><span class="chapter-index">${String(index + 1).padStart(2, '0')}</span></div>`
        : `<div class="chapter-number">${String(index + 1).padStart(2, '0')}</div>`;
      return `<li class="chapter-item" data-chapter-id="${escapeAttr(chapter.id)}">
        ${chapterVisual}
        <div><h3 class="chapter-name">${escapeHtml(chapter.title)}</h3><p class="chapter-sub">${escapeHtml(chapter.subtitle ?? '')}</p>
        <p class="chapter-meta">${availableAudio ? 'Hörbuch verfügbar' : 'Geplant'}${progressText}</p>${markers}</div>
        <div class="chapter-actions">${availableAudio ? `<button type="button" class="chapter-play" data-play="${index}">▶ Anhören</button>` : '<span class="chapter-placeholder">Audio folgt</span>'}</div>
      </li>`;
    }).join('') : '<li class="chapter-empty">Für diese Reise sind noch keine Hörbuchkapitel angelegt.</li>';
    initImages($('chapter-list'));
    $('chapter-list').querySelectorAll('[data-play]').forEach(btn => btn.addEventListener('click', () => playChapter(trip, Number(btn.dataset.play))));
    $('chapter-list').querySelectorAll('[data-marker]').forEach(btn => btn.addEventListener('click', () => {
      const index = Number(btn.dataset.marker); const seconds = Number(btn.dataset.time);
      const same = state.trip?.id === trip.id && state.chapterIndex === index;
      if (same && audio.readyState >= 1) { audio.currentTime = seconds; if (audio.paused) audio.play().catch(showBlocked); }
      else playChapter(trip, index, seconds);
    }));
    $('trip-detail').hidden = false;
    if (updateHash) location.hash = `reise/${encodeURIComponent(id)}`;
    $('trip-detail').scrollIntoView({behavior:'smooth',block:'start'});
    updateActiveChapter();
  }
  function clearTrip() {
    $('trip-detail').hidden = true;
    const anchor = $('reisen'); anchor.scrollIntoView({behavior:'smooth'});
    if (location.hash.startsWith('#reise/')) location.hash = 'reisen';
  }
  function updateActiveChapter() {
    $('chapter-list').querySelectorAll('.chapter-item').forEach(row => {
      row.classList.toggle('is-playing', row.dataset.chapterId === state.trip?.chapters[state.chapterIndex]?.id && !audio.paused);
    });
  }
  function showNotice(text) { $('player-notice').textContent = text; }
  function showBlocked() { showNotice('Der Browser hat die automatische Wiedergabe blockiert. Bitte ▶ drücken, um fortzufahren.'); updatePlayButton(); }
  function loadProgress(id) { const saved = getStored('position:' + id, null); return saved && !saved.completed ? Number(saved.position) || 0 : 0; }
  function playChapter(trip, index, startTime = null) {
    const chapter = trip.chapters[index]; if (!playable(chapter)) return;
    if (!audio.ended) persistProgress();
    audio.pause();
    state.trip = trip;
    state.chapterIndex = index;
    state.duration = 0;
    state.pendingSeek = startTime === null ? loadProgress(chapter.id) : Math.max(0, Number(startTime) || 0);
    state.lastSaveSecond = -1;
    showNotice('');
    audio.src = chapterAudio(trip, chapter);
    useImage($('player-art'), chapterImageStem(trip, chapter), 'assets/chapter-placeholder.svg');
    audio.load();
    audio.playbackRate = Number($('speed').value) || 1;
    $('player-title').textContent = chapter.title;
    $('player-trip').textContent = trip.title;
    $('current-time').textContent = fmt(state.pendingSeek);
    $('total-time').textContent = '0:00';
    $('seek').value = 0;
    $('player-shell').hidden = false;
    document.body.classList.add('has-player');
    setStored('last', {tripId: trip.id, chapterId: chapter.id});
    setNeighbors();
    audio.play().catch(showBlocked);
    updatePlayButton(); updateActiveChapter();
  }
  function persistProgress(completed = false) {
    const chapter = state.trip?.chapters[state.chapterIndex];
    if (!chapter || !playable(chapter)) return;
    const position = completed ? 0 : Math.max(0, Number(audio.currentTime) || 0);
    if (completed || position > 0) setStored('position:' + chapter.id, {position, completed, savedAt:Date.now()});
  }
  function findPlayableNeighbor(dir) {
    if (!state.trip) return -1;
    for (let i = state.chapterIndex + dir; i >= 0 && i < state.trip.chapters.length; i += dir) {
      if (playable(state.trip.chapters[i])) return i;
    }
    return -1;
  }
  function setNeighbors() {
    $('previous').disabled = findPlayableNeighbor(-1) < 0;
    $('next').disabled = findPlayableNeighbor(1) < 0;
  }
  function updatePlayButton() {
    $('toggle-play').textContent = audio.paused ? '▶' : '❚❚';
    $('toggle-play').setAttribute('aria-label', audio.paused ? 'Wiedergabe starten' : 'Wiedergabe pausieren');
    updateActiveChapter();
  }
  function fromHash() {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash.startsWith('reise/')) { const id = hash.slice(6); if (findTrip(id)) openTrip(id, false); }
  }
  search.addEventListener('input', renderTrips);
  $('back-to-trips').addEventListener('click', clearTrip);
  $('close-player').addEventListener('click', () => { persistProgress(); audio.pause(); $('player-shell').hidden = true; document.body.classList.remove('has-player'); updatePlayButton(); });
  $('toggle-play').addEventListener('click', () => { if (!audio.src) return; if (audio.paused) audio.play().catch(showBlocked); else audio.pause(); });
  $('previous').addEventListener('click', () => { if (audio.currentTime > 5) audio.currentTime = 0; else { const idx = findPlayableNeighbor(-1); if (idx >= 0) playChapter(state.trip, idx); } });
  $('next').addEventListener('click', () => { const idx = findPlayableNeighbor(1); if (idx >= 0) playChapter(state.trip, idx); });
  $('seek').addEventListener('input', (event) => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) audio.currentTime = Number(event.target.value) / 100 * audio.duration;
  });
  $('speed').value = String(getStored('speed', 1));
  if (![...$('speed').options].some(o => o.value === $('speed').value)) $('speed').value = '1';
  $('speed').addEventListener('change', () => { audio.playbackRate = Number($('speed').value); setStored('speed', Number($('speed').value)); });
  $('autonext').checked = getStored('autonext', true) !== false;
  $('autonext').addEventListener('change', () => setStored('autonext', $('autonext').checked));
  audio.addEventListener('loadedmetadata', () => {
    state.duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    $('total-time').textContent = fmt(state.duration);
    if (state.pendingSeek > 0 && state.duration > state.pendingSeek + 2) {
      try { audio.currentTime = state.pendingSeek; } catch { /* Browser noch nicht seekbar */ }
    }
    state.pendingSeek = 0;
  });
  audio.addEventListener('timeupdate', () => {
    $('current-time').textContent = fmt(audio.currentTime);
    $('seek').value = Number.isFinite(audio.duration) && audio.duration > 0 ? String(Math.min(100, audio.currentTime / audio.duration * 100)) : '0';
    const current = Math.floor(audio.currentTime);
    if (current % 5 === 0 && current !== state.lastSaveSecond) { state.lastSaveSecond = current; persistProgress(); }
  });
  audio.addEventListener('pause', () => { persistProgress(); updatePlayButton(); });
  audio.addEventListener('play', () => { showNotice(''); updatePlayButton(); });
  audio.addEventListener('error', () => showNotice('Die MP3 konnte nicht geladen werden. Bitte Dateipfad und Groß-/Kleinschreibung prüfen.'));
  audio.addEventListener('ended', () => {
    persistProgress(true);
    const next = findPlayableNeighbor(1);
    if ($('autonext').checked && next >= 0) {
      playChapter(state.trip, next);
    } else {
      showNotice(next >= 0 ? 'Kapitel beendet. Du kannst das nächste Kapitel starten.' : 'Du hast das letzte verfügbare Kapitel dieser Reise gehört.');
    }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) persistProgress(); });
  window.addEventListener('beforeunload', () => persistProgress());
  window.addEventListener('hashchange', fromHash);
  renderTrips(); fromHash();
})();
