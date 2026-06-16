// External loader for the BePickleballer Paddle Finder Quiz iframe.
// Lives outside the WordPress page so wpautop cannot mangle inline JS.
// The Custom HTML block in WordPress only needs to include the iframe + a
// <script src="..."> tag pointing here.
(function(){
  var QUIZ_BASE = 'https://dmytriisynchuk.github.io/bp-quiz/';
  var ALLOWED_ORIGIN = 'https://dmytriisynchuk.github.io';
  var iframe = document.getElementById('bp-paddle-quiz-iframe');
  if (!iframe) return;

  // Forward parent's ?r=<id> (if any) into the iframe src so a shared
  // results link like /quiz/?r=abc123 loads that saved result.
  if (window.location.search) {
    iframe.src = QUIZ_BASE + window.location.search;
  }

  window.addEventListener('message', function(e){
    if (e.origin !== ALLOWED_ORIGIN) return;
    if (!e.data || !e.data.type) return;
    if (e.data.type === 'bp-quiz-height') {
      var h = parseInt(e.data.height, 10);
      if (isNaN(h) || h < 200) return;
      iframe.style.height = (h + 20) + 'px';
    }
    if (e.data.type === 'bp-quiz-result-id' && e.data.id) {
      try {
        var url = new URL(window.location.href);
        url.searchParams.set('r', String(e.data.id));
        window.history.replaceState({}, '', url.toString());
      } catch (err) {}
    }
  });
})();
