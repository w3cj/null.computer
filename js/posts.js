const API_URL = 'https://api.github.com';
const REPO_URL = `${API_URL}/repos/w3cj/null.computer/contents/posts`;

fetch(REPO_URL)
  .then(result => result.json())
  .then(posts => {
    return Promise.all(posts.map(loadPost));
  }).then(posts => {
    let html = '';
    posts.forEach(post => {
      html += `<section>${post}</section>`;
    });
    document.querySelector('#posts').innerHTML = html;
  });

function loadPost(post) {
  const loadedPost = localStorage[post.path + post.sha];
  if(loadedPost) {
    return Promise.resolve(loadedPost);
  } else {
    return fetch(post.path)
      .then(result => result.text())
      .then(renderMarkdown)
      .then(html => {
        localStorage[post.path + post.sha] = html;
        return html;
      });
  }
}

function renderMarkdown(text) {
  return fetch(`${API_URL}/markdown`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              text
            })
          }).then(result => result.text());
}
