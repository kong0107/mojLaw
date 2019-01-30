import React, {
  PureComponent
} from 'react';

import {
  Link
} from "react-router-dom";

import config from '../js/config';
import {
  fetch2,
  createFilterFunction
} from '../js/utility';
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
    fetch2(`${config.cdn}/index.json`)
    .then(res => res.json())
    .then(catalog => this.setState(
      {catalog: catalog.sort((a, b) => b.lastUpdate - a.lastUpdate)}
    ))
  }

  render() {
    const testFunc = createFilterFunction(this.state.query);
    const showing = this.state.catalog.filter(law => testFunc(law.name));

    return (
      <div className="Catalog">
        <div className="Catalog-searchContainer">
          <i className="fas fa-search" />
          <input className="Catalog-searchInput"
            type="text"
            placeholder="法規搜尋"
            onInput={event => this.setState({
              query: event.target.value,
              renderAmount: showBasicSize
            })}
          />
        </div>
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
    return (
      <li className="CatalogItem">
        <Link className="CatalogItem-link" to={`/laws/${law.pcode}`}>
          <div className="CatalogItem-lastUpdate" title="最新異動日期">
            <time>{law.lastUpdate}</time>
          </div>
          <div className="CatalogItem-name">{law.name}</div>
        </Link>
      </li>
    );
  }
}
