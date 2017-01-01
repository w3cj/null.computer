## Using the Github Commits API for Post Metadata
I wanted to add a dynamic `created` and `updated` date to the posts for this blog. For this I found the [commits API endpoint](https://developer.github.com/v3/repos/commits/).

Using this endpoint, I was able to get all of the commits for each post and determine a created and updated date.

```js
const created = commits[commits.length - 1].commit.author.date;
const updated = commits[0].commit.author.date;
```

My JS template literals are starting to look a lot like jsx...

```js
`
<small><strong>Path:</strong> ${post.path}</small><br>
<small><strong>Logged:</strong> ${post.commits.created}</small>
${ post.commits.updated == post.commits.created ? '' :
    `<br><small><strong>Updated:</strong> ${post.commits.updated}</small>` }
`
```

I also did a little refactoring and will potentially move the blog code into an npm module. For now, this site now comprises of 2 JS files instead of 1! 🤓
