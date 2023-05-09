import React, { useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Loading from './components/Loading';
import { useThemeContext, ThemeContextProvider } from './contexts/theme';

const Results = React.lazy(() => import('./components/Results'));
const Popular = React.lazy(() => import('./components/Popular'));
const Battle = React.lazy(() => import('./components/Battle'));

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const toggleTheme = () =>
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));

  return (
    <Router>
      <div className={theme}>
        <div className="container">
          <Nav theme={theme} toggleTheme={toggleTheme} />
          <React.Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Popular />} />
              <Route path="/battle" element={<Battle />} />
              <Route path="/results" element={<Results />} />
            </Routes>
          </React.Suspense>
        </div>
      </div>
    </Router>
  );
}

const rootElement = document.getElementById('app') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
