## RSS/Atom Feed Generator
The fantastic [Mr. Fritz](https://github.com/dannyfritz) (aka Danny) [pointed out](https://github.com/w3cj/null.computer/issues/1) that every great blog has a consumable feed. Well Mr. Fritz, this one is for you!

null.computer now proudly broadcasts updates to the world!

Feeds are available as [RSS 2.0](http://null.computer/feed.rss) and [Atom 1.0](http://null.computer/feed.atom)

### How you do that?
For my first attempt at this, I re-used my existing github API code to retrieve rendered posts and commit history. I soon ran into the dreaded `Github API Rate limit exceeded` message and decided an entirely local approach was the way to go.

I used a few awesome modules from npm to accomplish this.

[`marked`](https://www.npmjs.com/package/marked) was used to generate the markdown for each post.

To get the created/updated dates for each post, I explored using an [npm module for git logs](https://www.npmjs.com/search?q=git%20log%20parse), but ultimately could not find one that would allow me to get the logs for a single file. I ended up using [`child_process.exec`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) with `git log --follow <path>` to get the created/updated dates (commit history) for each post.

```js
const {exec} = require('child_process');

function getCommits(path) {
  return new Promise((resolve, reject) => {
    exec(`git log --follow ${path}`, (err, stdout, stderr) => {
      let created = new Date();
      let updated = new Date();

      if(!err && stdout) {
        const commits = stdout.match(/Date:(.*)/g);
        if(commits.length > 0) {
          created = new Date(commits[commits.length - 1].split('Date:')[1]);
          updated = new Date(commits[0].split('Date:')[1]);
        }
      } else {
        console.log('no commit history found', path);
      }

      resolve({
        created,
        updated
      });
    });
  });
}
```

Lastly, I used [`feed`](https://www.npmjs.com/package/feed) to generate the RSS 2.0 and Atom 1.0 feeds.

[`feed`](https://www.npmjs.com/package/feed) has a simple API:

```js
const Feed = require('feed');

const author = {
  name: 'CJ R.',
  email: 'hello@cjr.co.de',
  link: 'https://github.com/w3cj'
};

const feedURL = 'http://null.computer';

const feed = new Feed({
  title: 'null.computer',
  description: 'A web log by w3cj',
  id: feedURL,
  link: feedURL,
  author
});

feed.addItem({
  title: 'Hello Friend',
  id: `${feedURL}#posts/01-hello-friend.md`,
  link: `${feedURL}#posts/01-hello-friend.md`,
  description: '<h2>Hello Friend</h2>',
  author: [author],
  published: new Date(),
  date: new Date()
});

const xml = feed.render('atom-1.0');
console.log(xml);
```

The full code to generate the feeds can be found [here](https://github.com/w3cj/null.computer/blob/master/tasks/feed.js).

The only downside to all of this, is that I'll need to re-generate the feed each time I write a new post. Maybe I'll add a pre-commit task? This is slowly turning into a static site generator...
