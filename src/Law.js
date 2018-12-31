import React, {
    Component
  } from 'react';

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
      .then(lawInfo => this.setState({lawInfo}));
    }

    render() {
      const lawContentItems = this.state.lawInfo['法規內容'].map(item =>
          item['編章節'] ? (
            <h3 key={item['編章節']}>{item['編章節']}</h3>
          ) : (
            <dl key={item['條號']}>
              <dt>{item['條號']}</dt>
              <dd>{item['條文內容']}</dd>
            </dl>
          )
      );


      return (
        <div>
          <h2>{this.state.lawInfo['法規名稱']}</h2>
          {lawContentItems}
        </div>
      );
    }
  }

  export default Law;
