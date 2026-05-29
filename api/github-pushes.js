const GITHUB_REPO = 'HSA615/InvenHelper';

module.exports = async (req, res) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ message: 'Server is not configured with GITHUB_TOKEN.' });
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?sha=main&per_page=5`, {
      headers: {
        'User-Agent': 'HenryFlow-App',
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ message: 'GitHub API error', status: response.status, detail: text });
    }

    const commits = await response.json();
    const formattedCommits = commits.map(commit => ({
      message: commit.commit?.message || 'No commit message',
      sha: commit.sha,
      author: commit.commit?.author?.name || commit.author?.login || 'Unknown',
      date: commit.commit?.author?.date || commit.commit?.committer?.date || '',
      url: commit.html_url
    }));

    const pushEvents = [{
      actor: 'HSA615',
      branch: 'main',
      commitCount: formattedCommits.length,
      commits: formattedCommits,
      pushedAt: formattedCommits[0]?.date || new Date().toISOString()
    }];

    res.status(200).json({ repo: GITHUB_REPO, pushEvents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
