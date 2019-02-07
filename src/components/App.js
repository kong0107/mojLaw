import React, {
  PureComponent
} from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import config from '../js/config';
import Catalog from './Catalog';
import Law from './Law';
import '../styles/App.scss';

class App extends PureComponent {
  componentDidMount() {
    document.title = config.siteName;
  }

  render() {
    return (
      <div className="App">
        <div id="main">
          <Router basename={config.basename}>
            <Switch>
              <Route path="/" exact component={Catalog} />
              <Route path="/laws/:pcode" component={Law} />
            </Switch>
          </Router>
        </div>
        <footer>
          <a href="https://github.com/kong0107/mojLaw">網站原始碼</a>
          <a href="https://github.com/kong0107/mojLawSplitJSON/tree/arranged">資料來源</a>
        </footer>
      </div>
    );
  }
}

export default App;
