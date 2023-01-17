import React, { useState } from "react";
import PropTypes from "prop-types";
import { close } from "./icons";
import { Link } from "react-router-dom";

function Instructions() {
  return (
    <section className="instructions-container">
      <h2>Instructions</h2>
      <ol>
        <li>Enter 2 Github users</li>
        <li>Battle</li>
        <li>See the winners</li>
      </ol>
    </section>
  );
}

function PlayerInput({ onSubmit, label }) {
  const [username, setUsername] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username);
  }
  const handleChange = (e) => setUsername(e.target.value);
  return (
    <form className="card" onSubmit={handleSubmit}>
      <label htmlFor="username" className="player-label">
        {label}
      </label>
      <div className="input-row">
        <input
          type="text"
          id="username"
          placeholder="github username"
          autoComplete="off"
          value={username}
          onChange={handleChange}
        />
        <button
          className="btn link"
          type="submit"
          disabled={!username}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

function PlayerPreview({ username, onReset, label }) {
  return (
    <article className="card">
      <h3 className="player-label">{label}</h3>
      <div className="split">
        <div className="row gap-md">
          <img
            width={32}
            height={32}
            className="avatar"
            src={`https://github.com/${username}.png?size=200`}
            alt={`Avatar for ${username}`}
          />
          <a href={`https://github.com/${username}`} className="link">
            {username}
          </a>
        </div>
        <button onClick={onReset} className="btn secondary icon">
          {close}
        </button>
      </div>
    </article>
  );
}

PlayerPreview.propTypes = {
  username: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default function Battle() {
  const [playerOne, setPlayerOne] = useState(null);
  const [playerTwo, setPlayerTwo] = useState(null);
  const handleSetPlayer = (id, player) => {
    id === "playerOne" 
      ? setPlayerOne(player)
      : setPlayerTwo(player);
  }
  const disabled = !playerOne || !playerTwo;

  return (
    <main className="stack main-stack animate-in">
      <div className="split">
        <h1>Players</h1>
        <Link
          to={{
            pathname: "/results",
            search: `?playerOne=${playerOne}&playerTwo=${playerTwo}`,
          }}
          className={`btn primary ${disabled ? "disabled" : ""}`}
        >
          Battle
        </Link>
      </div>
      <section className="grid">
        {playerOne === null ? (
          <PlayerInput
            label="Player One"
            onSubmit={(player) => handleSetPlayer("playerOne", player)}
          />
        ) : (
          <PlayerPreview
            label="Player One"
            username={playerOne}
            onReset={() => handleSetPlayer("playerOne", null)}
          />
        )}
        {playerTwo === null ? (
          <PlayerInput
            label="Player Two"
            onSubmit={(player) => handleSetPlayer("playerTwo", player)}
          />
        ) : (
          <PlayerPreview
            label="Player Two"
            username={playerTwo}
            onReset={() => handleSetPlayer("playerTwo", null)}
          />
        )}
      </section>
      <Instructions />
    </main>
  );
}