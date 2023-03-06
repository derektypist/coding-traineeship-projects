import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "../features/Theme/theme.css";
import Header from "../features/Header/Header";
import Home from "../features/Home/Home";
import Subreddit from "../features/Subreddit/Subreddit";
import SearchResults from "../features/SearchResults/SearchResults";
import SubredditsAside from "../features/SubredditsAside/SubredditsAside";
import NotFoundPage from "../features/NotFoundPage/NotFoundPage";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../features/Theme/themeSlice";

function App() {

  const darkMode = useSelector(selectDarkMode);

  return (
    <Router>
      <div id="app-container" className={darkMode ? "dark" : "light"}>
        <Header />
        <main>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/r/:id" component={Subreddit} />
            <Route path="/search/:id" component={SearchResults} />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
        <aside>
          <SubredditsAside />
        </aside>
      </div>
    </Router>
  );
}

export default App;