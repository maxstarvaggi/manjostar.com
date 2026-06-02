(function () {
  function loadPartial(id, url) {
    var el = document.getElementById(id);
    if (!el) return;
    fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (html) { el.innerHTML = html; });
  }

  loadPartial('header', '/assets/partials/header.html');
  loadPartial('footer', '/assets/partials/footer.html');
})();
