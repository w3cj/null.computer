## Github API Based Static Blog
Instead of using a static site generator to create a blog hosted on github-pages, I thought it would be an interesting challenge to create a static blog using only the [github API](https://developer.github.com/v3/).

The github API offers up a few endpoints of interest:
* [Repo Contents](https://developer.github.com/v3/repos/contents/)
* [Media Types](https://developer.github.com/v3/media/)

### Basic Idea
Store blog [posts in markdown files in a git repo](https://github.com/w3cj/null.computer/tree/master/posts). Then use the github repo contents API to dynamically retrieve and render those markdown files.

### Easy Enough
It actually didn't take too much code for a basic proof of concept with post caching in localStorage!

This is the code making this page work (as of December 31st 2016 10:39 AM):

```js
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
```

### Future Plans
Right now, all files in the [`posts` folder of this repo](https://github.com/w3cj/null.computer/tree/master/posts) will be added to this page. As this blog grows, this will not scale. Eventually I would like to add SPA style single page posts and lazy loading.

The posts are simple markdown files right now. In the future, I could incorporate metadata at the top of a file to add title, date, tags etc.
