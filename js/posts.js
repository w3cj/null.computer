if(localStorage.postsHTML) {
  setPostsHTML(localStorage.postsHTML);
}

const ghBlog = new GHBlog('w3cj', 'null.computer');

ghBlog
  .getPosts()
  .then(getPostsHTML)
  .then(setPostsHTML);

function getPostsHTML(posts) {
  return posts
          .reduce((html, post) => {
            return `
            ${html}
            <section>
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
