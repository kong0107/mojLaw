import React, {
  Component
} from 'react';

import {
  fetch,
  log
} from '../js/utility';

import './Law.scss';

class Law extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lawInfo: {
        '法規內容': []
      }
    };
  }

  componentDidMount() {
    fetch(`http://localhost/kong0107/mojLawSplitJSON/FalVMingLing/${this.props.match.params.pcode}.json`)
    .then(res => res.json())
    .then(lawInfo => this.setState({lawInfo}))
    .catch(log);
  }

  render() {
    const divisions = [];
    const lawContentItems = [];
    this.state.lawInfo['法規內容'].forEach(item => {
      if(item['編章節']) {
        divisions.push(
          <div key={item['編章節']}>
            <a href={`#${item['編章節']}`}>{item['編章節']}</a>
          </div>
        );
        lawContentItems.push(
          <h3 key={item['編章節']} id={item['編章節']}>{item['編章節']}</h3>
        );
        return;
      }
      lawContentItems.push(
        <dl key={item['條號']}>
          <dt>{item['條號']}</dt>
          <dd>{item['條文內容']}</dd>
        </dl>
      );
    });

    return (
      <div>
        <h2>{this.state.lawInfo['法規名稱']}</h2>
        <div className="Law-content">
          <div className="Law-divisions">{divisions}</div>
          <div className="Law-articles">{lawContentItems}</div>
        </div>
      </div>
    );
  }
}

export default Law;
