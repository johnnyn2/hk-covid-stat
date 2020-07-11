import React, {useState} from 'react';
import './App.css';
import {CustomAppBar} from './components/AppBar'
import { Dashboard } from './pages/Dashboard';
import { Statisitcs} from './pages/Statistics';
import { About } from './pages/About';
import {PAGES,STAT_URLS} from './constants/constants';

function App() {
  const initState = {
    currentPage: PAGES.MAIN,
    isLoading: false,
  }
  const [state, setState] = useState(initState);
  let content = <span/>;
  switch(state.currentPage) {
    case PAGES.MAIN: content = <Dashboard setCurrentPage={setState}/>; break;
    case PAGES.ABOUT: content = <About/>; break;
    case PAGES.LATEST: content = <Statisitcs url={STAT_URLS.LATEST}/>; break;
    case PAGES.CASES: content = <Statisitcs url={STAT_URLS.CASES}/>; break;
    case PAGES.BUILDINGS: content = <Statisitcs url={STAT_URLS.BUILDINGS}/>; break;
    case PAGES.CONFINEES_BUILDINGS: content = <Statisitcs url={STAT_URLS.CONFINEES_BUILDINGS}/>; break;
    default: break;
  }

  return (
    <div className="App">
      <CustomAppBar setCurrentPage={setState}/>
      {content}
    </div>
  );
}

export default App;
