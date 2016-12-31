## Github API Blog
Instead of using a static site generator to create a blog hosted on github-pages, I thought it would be an interesting challenge to create a static blog using only the [github API](https://developer.github.com/v3/).

### Basic Idea
* Step 1: Use the github repo contents API endpoint to enumerate all markdown files inside a folder in a github repo.
* Step 3: For each markdown file, render the contents using the github markdown API endpoint.
* Step 4: Append the posts to the page.
* Step 5: Profit!!!

### Easy Enough
It actually didn't take too much code for a basic proof of concept. This is the actual code making this page work (as of December 31st 2016 7:19 AM):

```js
const API_URL = 'https://api.github.com';
const REPO_URL = `${API_URL}/repos/w3cj/null.computer/contents/posts`;

fetch(REPO_URL)
  .then(result => result.json())
  .then(posts => {
    return Promise.all(posts.map(loadPost));
  }).then(posts => {
    let html = '<hr>';
    posts.reverse().forEach(post => {
      html += `<section>${post}</section><hr>`;
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
        // Cache the rendered html for faster load times!
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
```

### Future Plans
Right now, all files in the `posts` folder of this repo will be added to this page. As this blog grows, this will not scale as well. It would be nice to show individual posts SPA style.

The posts are simple markdown files right now. In the future, I could incorporate metadata at the top of a file to add title, date, tags etc.

<small>Saturday, December 31st, 07:19:42 AM</small>
