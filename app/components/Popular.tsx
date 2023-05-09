import React, {
  useEffect,
  useState,
  useReducer,
  useRef,
  SelectHTMLAttributes,
} from 'react';
import PropTypes from 'prop-types';
import { type Repo, type Languages, fetchPopularRepos } from '../utils/api';
import Loading from './Loading';
import Table from './Table';
type Selected = React.DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

function LanguagesNav({
  selected,
  onUpdateLanguage,
}: {
  selected: Languages;
  onUpdateLanguage: (e: Languages) => void;
}) {
  const languages: Languages[] = [
    'All',
    'JavaScript',
    'Ruby',
    'Java',
    'CSS',
    'Python',
  ];

  return (
    <select
      onChange={(e) => {
        onUpdateLanguage(e.target.value as Languages);
      }}
      value={selected}
    >
      {languages.map((language) => (
        <option key={language} value={language}>
          {language}
        </option>
      ))}
    </select>
  );
}

LanguagesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdateLanguage: PropTypes.func.isRequired,
};

export type Repos = Partial<Record<Languages, Repo[]>>;

interface ReducerState {
  loading: boolean;
  repos: Repos;
  error: string;
}

interface LoadingAction {
  type: 'setLoading';
}
interface RepoAction {
  type: 'setRepo';
  repo: { selectedLanguage: Languages; repos: Repo[] };
}
interface ErrorAction {
  type: 'setError';
  error: Error;
}
type Action = LoadingAction | RepoAction | ErrorAction;
const initialState: ReducerState = {
  loading: false,
  repos: {},
  error: '',
};

const reducer = (state: ReducerState, action: Action): ReducerState => {
  switch (action.type) {
    case 'setLoading':
      return {
        ...state,
        loading: true,
        error: '',
      };
    case 'setRepo':
      return {
        loading: false,
        error: '',
        repos: {
          ...state.repos,
          [action.repo.selectedLanguage]: action.repo.repos,
        },
      };
    case 'setError':
      return {
        ...state,
        error: action.error.message,
        loading: false,
      };
    default:
      return state;
  }
};
export default function Popular() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedLanguage, setSelectedLanguage] = useState<Languages>('All');
  const fetchedLanguages = useRef<Languages[]>([]);
  useEffect(() => {
    if (fetchedLanguages.current.includes(selectedLanguage)) return;
    dispatch({ type: 'setLoading' });
    fetchPopularRepos(selectedLanguage)
      .then((repos) => {
        fetchedLanguages.current.push(selectedLanguage);
        dispatch({ type: 'setRepo', repo: { selectedLanguage, repos } });
      })
      .catch((error) => {
        console.error(error.messag);
        dispatch({ type: 'setError', error });
      });
  }, [fetchedLanguages, selectedLanguage]);
  const { error, loading, repos } = state;
  return (
    <main className="stack main-stack animate-in">
      <div className="split">
        <h1>Popular</h1>
        <LanguagesNav
          selected={selectedLanguage}
          onUpdateLanguage={setSelectedLanguage}
        />
      </div>
      {loading && (
        <Loading text={`Fetching ${selectedLanguage} Repositories`} />
      )}
      {error && <p className="text-center error">{error}</p>}
      {repos[selectedLanguage] && <Table repos={repos[selectedLanguage]!} />}
    </main>
  );
}
