import React, {
  PureComponent
} from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Catalog from './Catalog';
import Law from './Law';

import config from '../js/config';
import '../styles/App.scss';

class App extends PureComponent {
  render() {return (
    <div className="App">
      <Router basename={config.basename}>
        <Switch>
          <Route path="/" exact component={Catalog} />
          <Route path="/laws/:pcode" component={Law} />
        </Switch>
      </Router>
    </div>
  );
  }
}

export default App;
