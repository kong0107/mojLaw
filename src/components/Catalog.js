import React, {
  PureComponent
} from 'react';
import {
  Link
} from 'react-router-dom';

import config from '../js/config';
import {
  errorHandler,
  createFilterFunction
} from '../js/utility';
import LawAPI from '../js/LawAPI';
import SearchBox from './SearchBox';

import '../styles/Catalog.scss';

const showBasicSize = 20;
export default class Catalog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      catalog: [],
      query: '',
      renderAmount: showBasicSize // 目前能顯示的列表長度
    };
  }

  componentDidMount() {
    LawAPI.loadCatalog()
    .then(catalog => this.setState(
      {catalog: catalog.sort((a, b) => b.lastUpdate - a.lastUpdate)}
    ))
    .catch(errorHandler);
  }

  render() {
    const testFunc = createFilterFunction(this.state.query);
    const showing = this.state.catalog.filter(law => testFunc(law.name));

    return (
      <div className="Catalog">
        <header>
          <div className="title">{config.siteName}</div>
          <SearchBox
            value={this.state.query}
            onChange={text => this.setState({
              query: text,
              renderAmount: showBasicSize
            })}
          />
          <span className="Catalog-amount">
            {showing.length} 筆資料
          </span>
        </header>
        <ul className="Catalog-list">
          {showing.slice(0, this.state.renderAmount).map(law =>
            <CatalogItem key={law.pcode} law={law} />
          )}
        </ul>
        <button type="button"
          className={showing.length > this.state.renderAmount ? 'btn btn-sm btn-outline-secondary' : 'd-none'}
          onClick={() => this.setState({renderAmount: this.state.renderAmount + showBasicSize})}
        >顯示更多</button>
      </div>
    );
  }
}

class CatalogItem extends PureComponent {
  render() {
    const {law} = this.props;

    let badge;
    if(law.pcode === 'A0000001' || law.pcode === 'A0000002')
      badge = <span title="憲法" className="badge badge-warning">憲</span>;
    else if(/([^辦]法|律|條例|通則)$/.test(law.name))
      /**
       * 應該也要排除「自治條例」，但 FireFox 和 IE 看不懂 (?<!y)x 規則，幸好全國法規資料庫也沒有自治條例。
       * 注意因為有「動物傳染病防治條例」和「妨害國幣懲治條例」，所以不能用 /[^自][^治]條例$/ 。
       */
      badge = <span title="法律" className="badge badge-primary">法</span>;
    else badge = <span title="命令" className="badge badge-success">令</span>;

    return (
      <li className="CatalogItem">
        <Link className="CatalogItem-link" to={`/laws/${law.pcode}`}>
          {badge}
          <time className="CatalogItem-lastUpdate" title="最新異動日期">
            {law.lastUpdate}
          </time>
          <div className="CatalogItem-name">{law.name}</div>
        </Link>
      </li>
    );
  }
}
