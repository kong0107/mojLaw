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

class LawList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      laws: [],
      page: 1
    };
  }

  componentDidMount() {
    fetch('http://localhost/kong0107/mojLawSplitJSON/index.json')
    .then(res => res.json())
    .then(laws => this.setState({laws}));
  }

  render() {
    const ipp = 20;
    const page = this.state.page;
    const matchedLaws = this.state.laws.filter(() => true);
    const listLaws = matchedLaws.slice((page - 1) * ipp, page * ipp).map(law =>
      <li key={law.PCode}>
        <Link to={`/laws/${law.PCode}`}>{law.name}</Link>
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
      <div>
        <div>Page: {page}</div>
        <div>{pagination}</div>
        <ul>{listLaws}</ul>
      </div>
    );
  }
}

export default LawList;
