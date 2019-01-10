import React, {
  Component
} from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from "react-router-dom";

import LawList from './LawList';
import Law from './Law';

import {
  fetch,
  log
} from '../js/utility';
import config from '../js/config';
import '../styles/App.scss';

class App extends Component {
  render() {
    return (
      <Router basename={config.basename}>
        <div className="App">
          <Header />
          <div>
            <main className="container">
              <Switch>
                <Route path="/" exact component={LawList} />
                <Route path="/laws/:pcode" component={Law} />
              </Switch>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    fetch(`${config.cdn}/UpdateDate.txt`)
    .then(res => res.text())
    .then(UpdateDate => this.setState({UpdateDate}))
    .catch(log);
  }

  render() {
    const updateDateContainer = this.state.UpdateDate
    ? (
      <div id="updateDateContainer">
        更新日期：
        <time>{this.state.UpdateDate}</time>
      </div>
    )
    : null;

    return (
      <header>
        <div>
          <Link className="title" to="/">法規查詢</Link>
          {updateDateContainer}
        </div>
      </header>
    );
  }
}

class Footer extends Component {
  render() {
    return (
      <footer>
        <div>
          <ul>
            <li><a href="https://data.gov.tw/dataset/18289" title="政府資料開放平台">資料來源</a></li>
            <li><a href="https://github.com/kong0107/mojLawSplit">資料處理</a></li>
          </ul>
        </div>
      </footer>
    );
  }
}

export default App;
