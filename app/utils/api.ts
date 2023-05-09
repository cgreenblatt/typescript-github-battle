const id = 'YOUR_CLIENT_ID';
const sec = 'YOUR_SECRET_ID';
const params = `?client_id=${id}&client_secret=${sec}`;
export type Languages =
  | 'All'
  | 'JavaScript'
  | 'Ruby'
  | 'Java'
  | 'CSS'
  | 'Python';

export function fetchPopularRepos(language: Languages) {
  const endpoint = window.encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
  );

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      if (!data.items) {
        throw new Error(data.message);
      }

      return data.items as Repo[];
    });
}

function getErrorMsg(message: string, username: string) {
  if (message === 'Not Found') {
    return `${username} doesn't exist`;
  }

  return message;
}

export interface Profile {
  login: string;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  location?: string;
  company?: string;
}

function getProfile(username: string): Promise<Profile> {
  return fetch(`https://api.github.com/users/${username}${params}`)
    .then((res) => res.json())
    .then((profile) => {
      if (profile.message) {
        throw new Error(getErrorMsg(profile.message, username));
      }

      return profile;
    });
}

function getRepos(username: string): Promise<Repo[]> {
  return fetch(
    `https://api.github.com/users/${username}/repos${params}&per_page=100`
  )
    .then((res) => res.json())
    .then((repos) => {
      if (repos.message) {
        throw new Error(getErrorMsg(repos.message, username));
      }

      return repos;
    });
}

export interface Repo {
  owner: Pick<Profile, 'login' | 'avatar_url'>;
  stargazers_count: number;
  forks: number;
  open_issues: number;
  name: string;
  created_at: string;
  updated_at: string;
  language: string;
  watchers: number;
}

function getStarCount(repos: Repo[]) {
  return repos.reduce((count, { stargazers_count }) => {
    return count + stargazers_count;
  }, 0);
}

function calculateScore(followers: number, repos: Repo[]) {
  return followers * 3 + getStarCount(repos);
}

function getUserData(player: string): Promise<Player> {
  return Promise.all([getProfile(player), getRepos(player)]).then(
    ([profile, repos]) => ({
      profile,
      score: calculateScore(profile.followers, repos),
    })
  );
}

export interface Player {
  score: number;
  profile: Profile;
}

function sortPlayers(players: [Player, Player]) {
  return players.sort((a, b) => b.score - a.score);
}

export function battle(players: [string, string]): Promise<[Player, Player]> {
  return Promise.all([getUserData(players[0]), getUserData(players[1])]).then(
    sortPlayers
  );
}
