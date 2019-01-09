import React, {
  Component
} from 'react';

import DivisionList from './DivisionList';
import LawContent from './LawContent';

import config from '../js/config';
import {
  fetch,
  log
} from '../js/utility';

import '../styles/Law.scss';

class Law extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lawInfo: {
        divisions: [],
        articles: []
      }
    };
  }

  componentDidMount() {
    fetch(`${config.cdn}/FalVMingLing/${this.props.match.params.pcode}.json`)
    .then(res => res.json())
    .then(lawInfo => this.setState({lawInfo}))
    .catch(log);
  }

  render() {
    const law = this.state.lawInfo;

    const dl = [];
    if(law.preamble) dl.push(
      <dl key="preamble">
        <dt>前言</dt>
        <dd>{law.preamble}</dd>
      </dl>
    );

    return (
      <div className="Law">
        <div className="Law-divisions-container"><DivisionList divisions={law.divisions} /></div>
        <div className="Law-main">
          <header>
            <h2 className="Law-title">{law.title}</h2>
          </header>
          {dl}
          <LawContent divisions={law.divisions} articles={law.articles} />
        </div>
      </div>
    );
  }
}

export default Law;
