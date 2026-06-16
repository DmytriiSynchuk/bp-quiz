// Shared core for the public paddle quiz. Exposes window.bpQuiz with the API
// helper, state container, and a persisted answers store. quiz.js handles the
// flow logic and rendering.

window.bpQuiz = (function(){
  var BACKEND_URL = 'https://script.google.com/macros/s/AKfycbz6R0VAaTHsdqXZmx87wJCLhQrwYfLVW42QGaH4FMKu-wdz50MnPdD-R6ZIE-SK6KdJ/exec';
  var STORAGE_KEY = 'bp_quiz_state_v1';

  function api(action, extra) {
    var payload = Object.assign({ action: action }, extra || {});
    return fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(function(r){ return r.json(); });
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (err) {}
    return { currentIndex: 0, answers: {}, currentPaddleName: '' };
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {}
  }

  function clearState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (err) {}
  }

  function getResultIdFromUrl() {
    try {
      var params = new URLSearchParams(window.location.search);
      var id = (params.get('r') || '').trim();
      if (id) return id;
      // Fallback: support /results/[id] style paths if WordPress ever rewrites to that
      var match = window.location.pathname.match(/\/results\/([A-Za-z0-9_-]+)/);
      if (match) return match[1];
    } catch (err) {}
    return '';
  }

  function setResultIdInUrl(id) {
    if (!id) return;
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('r', id);
      window.history.replaceState({}, '', url.toString());
    } catch (err) {}
  }

  return {
    api: api,
    loadState: loadState,
    saveState: saveState,
    clearState: clearState,
    getResultIdFromUrl: getResultIdFromUrl,
    setResultIdInUrl: setResultIdInUrl
  };
})();
