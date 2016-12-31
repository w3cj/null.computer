const ghBlog = new GHBlog('w3cj', 'null.computer');

ghBlog
  .getPosts()
  .then(posts => {
    const postsHTML = posts
                        .reduce((html, post) => {
                          const created = post.commits[post.commits.length - 1].date;
                          const updated = post.commits[0].date;
                          return `
                          ${html}
                          <section>
                            <small><strong>Path:</strong> ${post.path}</small><br>
                            <small><strong>Logged:</strong> ${created}</small>
                            ${ updated == created ? '' : `<br><small><strong>Updated:</strong> ${updated}</small>` }
                            ${post.html}
                            <div>
                              <h3>Post History</h3>
                              ${createCommitList(post.commits)}
                            </div>
                          </section>
                          <hr>`;
                        }, '<hr>');
    document.querySelector('#posts').innerHTML = postsHTML;
  });

function createCommitList(commits) {
  return commits.reduce((commits, commit) => {
    return `
    ${commits}
    <li>
      <strong class="commit-date">${commit.date}</strong> <a href="${commit.url}">${commit.message}</a>
    </li>`;
  }, '<ul>') + '</ul>';
}
