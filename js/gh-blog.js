class GHBlog {
  constructor(user, repo) {
    this.API_URL = 'https://api.github.com';
    this.POSTS_URL = `${this.API_URL}/repos/${user}/${repo}/contents/posts`;
    this.COMMITS_URL = `${this.API_URL}/repos/${user}/${repo}/commits?path=`;
  }

  getPosts() {
    return fetch(this.POSTS_URL)
      .then(result => result.json())
      .then(infos => Promise.all(infos.map(this.loadPost.bind(this))));
    }

  loadPost(info) {
    const loadedSha = localStorage[`${info.path}-sha`];
    if(loadedSha && loadedSha == info.sha) {
      const html = localStorage[`${info.path}-html`];
      const commits = JSON.parse(localStorage[`${info.path}-commits`]);
      return Promise.resolve({html, commits, path: info.path, sha: info.sha});
    } else {
      return Promise.all([
          this.fetchPost(info.url),
          this.fetchCommits(info.path)
        ]).then(results => {
          const [html, commits] = results;
          localStorage[`${info.path}-sha`] = info.sha;
          localStorage[`${info.path}-html`] = html;
          localStorage[`${info.path}-commits`] = JSON.stringify(commits);
          return {html, commits, path: info.path, sha: info.sha};
        });
    }
  }

  fetchPost(url) {
    return fetch(url, {
        headers: {
          accept: 'application/vnd.github.v3.html+json'
        }
      }).then(result => result.text());
  }

  fetchCommits(path) {
    return fetch(`${this.COMMITS_URL}${path}`)
      .then(result => result.json())
      .then(commits => {
        const created = commits[commits.length - 1].commit.author.date;
        const updated = commits[0].commit.author.date;
        return {
          created: new Date(created).toLocaleString(),
          updated: new Date(updated).toLocaleString()
        };
      });
  }
}
