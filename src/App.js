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
    lang: 'cn'
  }
  const [state, setState] = useState(initState);
  let content = <span/>;
  switch(state.currentPage) {
    case PAGES.MAIN: content = <Dashboard lang={state.lang} setLang={setState}  setCurrentPage={setState}/>; break;
    case PAGES.ABOUT: content = <About lang={state.lang}/>; break;
    case PAGES.LATEST: content = <Statisitcs lang={state.lang} url={STAT_URLS.LATEST}/>; break;
    case PAGES.CASES: content = <Statisitcs lang={state.lang} url={STAT_URLS.CASES}/>; break;
    case PAGES.BUILDINGS: content = <Statisitcs lang={state.lang} url={STAT_URLS.BUILDINGS}/>; break;
    case PAGES.CONFINEES_BUILDINGS: content = <Statisitcs lang={state.lang} url={STAT_URLS.CONFINEES_BUILDINGS}/>; break;
    default: break;
  }

  return (
    <div className="App">
      <CustomAppBar lang={state.lang} setCurrentPage={setState}/>
      <div style={{marginTop: 74}}>
        {content}
      </div>
    </div>
  );
}

export default App;
