import React, {
  Component
} from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from "react-router-dom";

import {
  Tooltip
} from 'reactstrap';

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
      <Router>
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
    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false
    };
  }

  componentDidMount() {
    fetch(`${config.cdn}/UpdateDate.txt`)
    .then(res => res.text())
    .then(UpdateDate => this.setState({UpdateDate}))
    .catch(log);
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  render() {
    return (
      <header>
        <div>
          <Link className="title" to="/">法規查詢</Link>
          <div id="UpdateDateContainer">
            更新日期：
            <time id="UpdateDate">{this.state.UpdateDate}</time>
            <Tooltip target="UpdateDateContainer" placement="bottom-end" isOpen={this.state.tooltipOpen} toggle={this.toggle}>
              依照「全國法規資料庫」的「法規整編資料截止日」。<br />詳閱「資料來源」連結。
            </Tooltip>
          </div>
        </div>
      </header>
    );
  }
}

class Footer extends Component {
  render() {
    return (
      <footer>
        <div className="container">
          FOOTER
        </div>
      </footer>
    );
  }
}

export default App;
