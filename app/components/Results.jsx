import React, { useEffect, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import { battle } from "../utils/api";
import PropTypes from "prop-types";
import Loading from "./Loading";
import { Link } from "react-router-dom";

function Card({ profile }) {
  const {
    login,
    avatar_url,
    html_url,
    followers,
    following,
    public_repos,
    location,
    company,
  } = profile;

  return (
    <div className="card bg-light">
      <header className="split">
        <div>
          <h4>
            <a href={html_url}>{login}</a>
          </h4>
          <p>{location || "unknown"}</p>
        </div>
        <img
          className="avatar large"
          src={avatar_url}
          alt={`Avatar for ${login}`}
        />
      </header>
      <ul className="stack">
        <li className="split">
          <span>Name:</span> <span>{login || "n/a"}</span>
        </li>
        <li className="split">
          <span>Company:</span> <span>{company || "n/a"}</span>
        </li>
        <li className="split">
          <span>Followers:</span> <span>{followers}</span>
        </li>
        <li className="split">
          <span>Following:</span> <span>{following}</span>
        </li>
        <li className="split">
          <span>Repositories:</span> <span>{public_repos}</span>
        </li>
      </ul>
    </div>
  );
}

Card.propTypes = {
  profile: PropTypes.shape({
    login: PropTypes.string.isRequired,
    avatar_url: PropTypes.string.isRequired,
    html_url: PropTypes.string.isRequired,
    followers: PropTypes.number.isRequired,
    following: PropTypes.number.isRequired,
    repositories: PropTypes.number,
    location: PropTypes.string,
    company: PropTypes.string,
  }).isRequired,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'error': 
      return {
        ...state,
        error: action.error.message,
        loading: false
      }
    case 'success' :
      return {
        ...state,
        loading: false,
        winner: action.winner,
        loser: action.loser
      }
    default: console.error(`Action type ${action.type} is not supported`)
  }
}

export default function Results() {
  const [state, dispatch] = useReducer(reducer, { loading: true })
  const [sp] = useSearchParams();
  const playerOne = sp.get("playerOne");
  const playerTwo = sp.get("playerTwo");

  useEffect(() => {
    battle([playerOne, playerTwo])
    .then((players) => {
      dispatch({ type: 'success', winner: players[0], loser: players[1] });
    })
    .catch(({ message }) => {
      dispatch({ type: 'error' })
    });
  }, [playerOne, playerTwo]);

  const { winner, loser, error, loading } = state;

  if (loading === true) {
    return <Loading text="Battling" />;
  }

  if (error) {
    return <p className="text-center error">{error}</p>;
  }

  return (
    <main className="animate-in stack main-stack">
      <div className="split">
        <h1>Results</h1>
        <Link to="/battle" className="btn secondary">
          Reset
        </Link>
      </div>
      <section className="grid">
        <article className="results-container">
          <Card profile={winner.profile} />
          <p className="results">
            <span>
              {winner.score === loser.score ? "Tie" : "Winner"}{" "}
              {winner.score.toLocaleString()}
            </span>
            {winner.score !== loser.score && (
              <img
                width={80}
                src="https://ui.dev/images/certificate.svg"
                alt="Certificate"
              />
            )}
          </p>
        </article>
        <article className="results-container">
          <Card profile={loser.profile} />
          <p className="results">
            <span>
              {winner.score === loser.score ? "Tie" : "Loser"}{" "}
              {loser.score.toLocaleString()}
            </span>
          </p>
        </article>
      </section>
    </main>
  );
}
