const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.GITHUB_TOKEN;
const repo = 'HSA615/InvenHelper';
if (!token) {
  console.error('no token');
  process.exit(1);
}
(async () => {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        'User-Agent': 'HenryFlow-App',
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json'
      }
    });
    console.log('status', res.status);
    const text = await res.text();
    console.log(text.slice(0, 500));
  } catch (e) {
    console.error(e);
  }
})();
