const postsElement = document.querySelector('#posts');
const postLinksElement = document.querySelector('.post-links');

if(localStorage.postsHTML) {
  postsElement.innerHTML = localStorage.postsHTML;
} else {
  localStorage.clear();
}

loadBlog();

function loadBlog() {
  const ghBlog = new GHBlog('w3cj', 'null.computer');

  ghBlog
    .getPosts()
    .then(addPosts)
    .then(() => {
      localStorage.postsHTML = postsElement.innerHTML;
      document.querySelector('.loading').style.display = 'none';
    }).then(navigateToHash);
}

function addPosts(posts) {
  posts.forEach(post => {
    addPostLink(post);

    const postElement = document.getElementById(post.path);
    if(postElement) {
      if(post.sha != localStorage[`${post.path}-sha`]) {
        postElement.innerHTML = getPostHTML(post);
      }
    } else {
      addPostElement(post);
    }
  });
}

function addPostElement(post) {
  let postElement = document.createElement('section');
  postElement.setAttribute('id', post.path);
  postElement.innerHTML = getPostHTML(post);
  postsElement.insertBefore(postElement, postsElement.firstChild);
  addHR();
}

function getPostHTML(post) {
  return `
  <small><strong>Path:</strong> ${post.path}</small><br>
  <small><strong>Logged:</strong> ${post.commits.created}</small>
  ${ post.commits.updated == post.commits.created ? '' :
      `<br><small><strong>Updated:</strong> ${post.commits.updated}</small>` }
  ${post.html}`;
}

function addHR() {
  const hr = document.createElement('hr');
  postsElement.insertBefore(hr, postsElement.firstChild);
}

function addPostLink(post) {
  const link = document.createElement('li');
  link.innerHTML = `<a href="#${post.path}">${post.path}</a>`;
  postLinksElement.insertBefore(link, postLinksElement.firstChild);
}

function navigateToHash() {
  const currentHash = window.location.hash;
  window.location.hash = '';
  window.location.hash = currentHash;
}
