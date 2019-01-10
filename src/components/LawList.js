import React, {
  Component
} from 'react';

import {
  Link
} from "react-router-dom";

import {
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';

import config from '../js/config';
import '../styles/LawList.scss';

class LawList extends Component {
  constructor(props) {
    super(props);
    this.query = this.query.bind(this);
    this.state = {
      query: '',
      laws: [],
      matchedLaws: [],
      page: 1
    };
  }

  componentDidMount() {
    fetch(`${config.cdn}/index.json`)
    .then(res => res.json())
    .then(laws => this.setState({laws}))
    .then(this.query);
  }

  query() {
    const query = document.querySelector('input').value.trim();
    if(!query) return this.setState({matchedLaws: this.state.laws});
    this.setState({matchedLaws: this.state.laws.filter(law => {
      if(law.name.indexOf(query) !== -1) return true;
      if(law.english && law.english.indexOf(query) !== -1) return true;
      return false;
    })});
  }

  render() {
    const ipp = 20;
    const page = this.state.page;
    const matchedLaws = this.state.matchedLaws;
    const listLaws = matchedLaws.slice((page - 1) * ipp, page * ipp).map(law =>
      <li key={law.PCode}>
        <div className="LawList-lastUpdate" title="最新異動日期"><time>{law.lastUpdate}</time></div>
        <Link to={`/laws/${law.PCode}`} className="LawList-name">{law.name}</Link>
        <div className="LawList-english">{law.english}</div>
      </li>
    );
    const pagination = matchedLaws.length <= ipp ? null : (
      <Pagination aria-label="Page navigation">
        <PaginationItem disabled={page===1}>
          <PaginationLink previous onClick={()=>this.setState({page: page - 1})} />
        </PaginationItem>
        <PaginationItem disabled={page > matchedLaws / ipp}>
          <PaginationLink next onClick={()=>this.setState({page: page + 1})} />
        </PaginationItem>
      </Pagination>
    );

    return (
      <div className="LawList">
        <input type="text" placeholder="搜尋" onInput={this.query} />
        <div>Page: {page}</div>
        <div>{pagination}</div>
        <ul className="LawList-main">{listLaws}</ul>
      </div>
    );
  }
}

export default LawList;
