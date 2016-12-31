const API_URL = 'https://api.github.com/repos/w3cj/null.computer/contents/posts';

fetch(API_URL)
  .then(result => result.json())
  .then(json => {
    console.log(json);
  });
