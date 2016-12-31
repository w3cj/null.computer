## Using the Github Commits API for Post Metadata
I wanted to add a dynamic `created` and `updated` date to the posts. For this I found the [commits API endpoint](https://developer.github.com/v3/repos/commits/).

Using this endpoint, I was able to get and append all of the commits for each post!

The commits link directly to the github diff page were you can see what updates were made.

```js
`<strong class="commit-date">${commit.date}</strong> <a href="${commit.url}">${commit.message}</a>`
```

I also did a little refactoring and will potentially move the blog code into an npm module. For now, this site now comprises of 2 JS files instead of 1! 🤓
