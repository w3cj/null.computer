const API_URL = 'https://api.github.com';
const REPO_URL = `${API_URL}/repos/w3cj/null.computer/contents/posts`;

fetch(REPO_URL)
  .then(result => result.json())
  .then(infos => Promise.all(infos.reverse().map(loadPost)))
  .then(posts => posts
                  .reduce((html, post) =>
                  `${html}<section>${post}</section><hr>`,
                  '<hr>'))
  .then(html => document.querySelector('#posts').innerHTML = html);

function loadPost(info) {
  const loadedSha = localStorage[`${info.path}-sha`];
  if(loadedSha && loadedSha == info.sha) {
    const loadedHTML = localStorage[`${info.path}-html`];
    return Promise.resolve(loadedHTML);
  } else {
    return fetch(info.url, {
        headers: {
          accept: 'application/vnd.github.v3.html+json'
        }
      }).then(result => result.text())
      .then(html => {
        localStorage[`${info.path}-sha`] = info.sha;
        localStorage[`${info.path}-html`] = html;
        return html;
      });
  }
}
