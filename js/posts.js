if(localStorage.postsHTML) {
  setPostsHTML(localStorage.postsHTML);
} else {
  localStorage.clear();
}

const ghBlog = new GHBlog('w3cj', 'null.computer');

ghBlog
  .getPosts()
  .then(addPostLinks)
  .then(getPostsHTML)
  .then(setPostsHTML)
  .then(navigateToHash);

function addPostLinks(posts) {
  const links = posts.reduce((all, post) => {
    return `${all}<li><a href="#${post.path}">${post.path}</a></li>`;
  }, '');
  document.querySelector('.post-links').innerHTML = links;
  return posts;
};

function getPostsHTML(posts) {
  return posts
          .reduce((html, post) => {
            return `
            ${html}
            <section id="${post.path}">
              <small><strong>Path:</strong> ${post.path}</small><br>
              <small><strong>Logged:</strong> ${post.commits.created}</small>
              ${ post.commits.updated == post.commits.created ? '' :
                  `<br><small><strong>Updated:</strong> ${post.commits.updated}</small>` }
              ${post.html}
            </section>
            <hr>`;
          }, '<hr>');
}

function setPostsHTML(html) {
  localStorage.postsHTML = html;
  document.querySelector('#posts').innerHTML = html;
}

function navigateToHash() {
  const currentHash = window.location.hash;
  window.location.hash = '';
  window.location.hash = currentHash;  
}
