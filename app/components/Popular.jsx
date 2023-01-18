import React, { useEffect, useState, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api";
import Loading from './Loading';
import Table from "./Table";

function LanguagesNav({ selected, onUpdateLanguage }) {
  const languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];

  return (
    <select
      onChange={(e) => onUpdateLanguage(e.target.value)}
      selected={selected}
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

const initialState = {
    loading: false,
    repos: {},
    error: '',
}
const reducer = (state, action) => {
    switch (action.type) {
        case 'setLoading': return {
            ...state,
            loading: true,
            error: ''
        };
        case 'setRepo' : return {
            loading: false,
            repos: { ...state.repos, [action.repo.selectedLanguage]: action.repo.repos }
        };
        case 'setError' : return {
            ...state,
            error: action.error.message,
            loading: false
         }
        default: throw Error(`Unknown action ${action.type} was passed to the reducer`);
    }
}
export default function Popular() {
   const [state, dispatch] = useReducer(reducer, initialState);
   const [selectedLanguage, setSelectedLanguage] = useState('All');
   const fetchedLanguages = useRef([]);
   useEffect(() => {
        if (fetchedLanguages.current.includes(selectedLanguage)) return;
        dispatch({ type: 'setLoading' });
        fetchPopularRepos(selectedLanguage)
            .then((repos) => {
                fetchedLanguages.current.push(selectedLanguage);
                console.log('fetched languages.current', fetchedLanguages.current);
                dispatch({ type: 'setRepo', repo: { selectedLanguage, repos } });
            })
            .catch((error) => {
                console.error(error.messag);
                dispatch({ type: 'setError', error })
            })
   }, [fetchedLanguages, selectedLanguage])
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
        {loading && <Loading text={`Fetching ${selectedLanguage} Repositories`} /> }
        {error && <p className="text-center error">{error}</p>}
        {repos[selectedLanguage] && <Table repos={repos[selectedLanguage]} />}
    </main>
  );
}
