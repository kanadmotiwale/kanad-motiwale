const GITHUB_USERNAME = "kanadmotiwale";

const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  R: "#198ce7",
  Shell: "#89e051",
};

async function loadGitHubRepos() {
  const grid = document.getElementById("reposGrid");
  if (!grid) return;

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12&type=public`
    );

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const repos = await res.json();
    const filtered = repos.filter((r) => !r.fork);

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="repos-error">No public repositories found.</p>';
      return;
    }

    grid.innerHTML = filtered
      .map((repo) => {
        const langColor = LANG_COLORS[repo.language] || "#8b8b8b";
        const desc = repo.description
          ? `<p class="repo-desc">${repo.description}</p>`
          : `<p class="repo-desc" style="color:var(--text-muted);font-style:italic">No description</p>`;

        const stars = repo.stargazers_count
          ? `<span>★ ${repo.stargazers_count}</span>`
          : "";
        const forks = repo.forks_count
          ? `<span>⑂ ${repo.forks_count}</span>`
          : "";
        const lang = repo.language
          ? `<span class="repo-lang" style="--lang-color:${langColor}">${repo.language}</span>`
          : "";

        return `
          <div class="repo-card">
            <div class="repo-name">
              <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
            </div>
            ${desc}
            <div class="repo-meta">${lang}${stars}${forks}</div>
          </div>`;
      })
      .join("");
  } catch (err) {
    grid.innerHTML = `<p class="repos-error">Could not load repositories. <a href="https://github.com/${GITHUB_USERNAME}" target="_blank">View on GitHub</a></p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadGitHubRepos);
