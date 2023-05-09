import * as React from 'react';
import PropTypes from 'prop-types';
import { hashtag } from './icons';
import Tooltip from './Tooltip';
import type { Repo } from '../utils/api';

type MoreInfo = 'created_at' | 'forks' | 'language' | 'updated_at' | 'watchers';
function MoreInfo({
  created_at,
  forks,
  language,
  updated_at,
  watchers,
  login,
}: Pick<Repo, MoreInfo> & { login: string }) {
  return (
    <ul className="tooltip stack">
      <li className="split">
        <span>By:</span> <span>{login}</span>
      </li>
      {language && (
        <li className="split">
          <span>Language:</span> <span>{language}</span>
        </li>
      )}
      <li className="split">
        <span>Created:</span>{' '}
        <span>{new Date(created_at).toLocaleDateString()}</span>
      </li>
      <li className="split">
        <span>Updated:</span>{' '}
        <span>{new Date(updated_at).toLocaleDateString()}</span>
      </li>
      <li className="split">
        <span>Watchers:</span>
        <span>{watchers.toLocaleString()}</span>
      </li>
      {forks && (
        <li className="split">
          <span>Forked:</span> <span>{forks.toLocaleString()}</span>
        </li>
      )}
    </ul>
  );
}

MoreInfo.propTypes = {
  created_at: PropTypes.string.isRequired,
  language: PropTypes.string,
  updated_at: PropTypes.string.isRequired,
  watchers: PropTypes.number.isRequired,
  login: PropTypes.string.isRequired,
  forks: PropTypes.number.isRequired,
};

function TableHead() {
  return (
    <thead>
      <tr>
        <th style={{ width: '5%' }}>{hashtag}</th>
        <th style={{ width: '50%' }}>Repository</th>
        <th style={{ width: '15%' }}>Stars</th>
        <th style={{ width: '15%' }}>Forks</th>
        <th style={{ width: '15%' }}>Open Issue</th>
      </tr>
    </thead>
  );
}

function TableRow({
  index,
  owner,
  stargazers_count,
  forks,
  open_issues,
  name,
  created_at,
  updated_at,
  language,
  watchers,
}: {
  index: number;
} & Repo) {
  const { login, avatar_url } = owner;

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <Tooltip
          element={
            <MoreInfo
              created_at={created_at}
              forks={forks}
              language={language}
              updated_at={updated_at}
              watchers={watchers}
              login={login}
            />
          }
        >
          <div className="row gap-md">
            <img
              width={32}
              height={32}
              className="avatar"
              src={avatar_url}
              alt={`Avatar for ${login}`}
            />
            <a href={`https://github.com/${login}/${name}`}>{name}</a>
          </div>
        </Tooltip>
      </td>
      <td>{stargazers_count}</td>
      <td>{forks}</td>
      <td>{open_issues}</td>
    </tr>
  );
}

TableRow.propTypes = {
  index: PropTypes.number.isRequired,
  owner: PropTypes.object.isRequired,
  stargazers_count: PropTypes.number.isRequired,
  forks: PropTypes.number.isRequired,
  open_issues: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

export default function Table({ repos }: { repos: Repo[] }) {
  return (
    <table>
      <TableHead />
      <tbody>
        {repos.map((repo: Repo, index) => {
          return <TableRow key={index} index={index} {...repo} />;
        })}
      </tbody>
    </table>
  );
}

Table.propTypes = {
  repos: PropTypes.array.isRequired,
};
