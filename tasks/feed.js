const fs = require('fs');
const cheerio = require('cheerio');
const marked = require('marked');
const {exec} = require('child_process');

const Feed = require('./lib/jpmonette.feed');

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

getPosts()
  .then(posts => Promise.all(
    posts.map(post => {
      return getCommits(post.path)
              .then(commits => {
                post.commits = commits;
                return post;
              });
    }))
  ).then(addPostsToFeed)
  .then(createFeed('atom-1.0', 'feed.atom'))
  .then(createFeed('rss-2.0', 'feed.rss'));


function getPosts() {
  return new Promise((resolve, reject) => {
    const dir = 'posts'
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err);
      resolve(files.reverse().map(file => {
        const path = `${dir}/${file}`;
        const contents = fs.readFileSync(path, 'utf-8');
        const html = marked(contents);
        const $ = cheerio.load(html);
        const title = $($('h2')[0]).text();
        const url = `${feedURL}#${path}`;
        return {
          title,
          path,
          html,
          url
        };
      }));
    });
  });
}

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

function addPostsToFeed(posts) {
  posts.forEach(post => {
    feed.addItem({
      title: post.title,
      id: post.url,
      link: post.url,
      description: post.html,
      author: [author],
      published: post.commits.created,
      date: post.commits.updated
    });
  });
}

function createFeed(type, name) {
  return function() {
    const render = feed.render(type);
    return new Promise((resolve, reject) => {
      fs.writeFile(name, render, (err) => {
        resolve();
      });
    });
  }
}
