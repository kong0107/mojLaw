import React, {
  PureComponent
} from 'react';
import {
  Route,
  Switch,
  NavLink
} from 'react-router-dom';

import SearchBox from './SearchBox';
import config from '../js/config';
import {
  errorHandler,
  fetch2,
  createFilterFunction,
  numf
} from '../js/utility';
import lawtext2obj from '../js/lawtext2obj';

import '../styles/Law.scss';

export default class Law extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      law:{
        articles: [],
        divisions: []
      }
    };
  }

  componentDidMount() {
    fetch2(`${config.cdn}/FalVMingLing/${this.props.match.params.pcode}.json`)
    .then(res => res.json())
    .then(law => this.setState({law}))
    .catch(errorHandler);
  }

  render() {
    const { match } = this.props;
    const { law } = this.state;
    return (
      <div className="Law">
        <header>
          <div className="Law-title">{law.title}</div>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <NavLink className="nav-link"
                to={match.url} exact
              >條文</NavLink>
            </li>
            <li className={law.divisions.length ? 'nav-item' : 'd-none'}>
              <NavLink className="nav-link"
                to={`${match.url}/divisions`}
              >編章節</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link"
                to={`${match.url}/history`}
              >沿革</NavLink>
            </li>
          </ul>
        </header>
        <Switch>
          <Route path={match.path} exact render={() => <ArticlesTab law={law} />} />
          <Route path={`${match.path}/divisions`} render={() => <DivisionsTab divisions={law.divisions} />} />
          <Route path={`${match.path}/history`} children={() => <History {...this.props} />} />
        </Switch>
      </div>
    );
  }
}

class ArticlesTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
  }

  render() {
    const testFunc = createFilterFunction(this.state.query);
    const showing = this.props.law.articles.filter(a => testFunc(a.content));

    return (
      <div className="Law-tabContent">
        <header>
          <SearchBox
            placeholder="法條搜尋"
            onInput={text => this.setState({
              query: text
            })}
          />
          <span className="Law-articlesAmount">
            {showing.length} 筆資料
          </span>
        </header>
        <main>
          {showing.map(article =>
            <Article key={article.number.toString()}
              article={article}
            />
          )}
        </main>
      </div>
    );
  }
}

class Article extends PureComponent {
  render() {
    const {article} = this.props;
    return (
      <dl className="Article">
        <dt className="Article-number">第 {numf(article.number)} 條</dt>
        <dd className="Article-content">
          <ParaList items={lawtext2obj(article.content)} />
        </dd>
      </dl>
    );
  }
}

class ParaList extends PureComponent {
  render() {
    const {items} = this.props;
    if(!items.length) return null;
    const stratum = items[0].stratum;

    const children = items.map((item, index) => {
      let ordinal = '', text = item.text;
      if(stratum) {
        const match = text.match(/^[第（()]?[\d一二三四五六七八九十]+(類：|[)）、.])?\s*/);
        if(match) {
          ordinal = match[0].trim();
          text = text.substring(match[0].length);
        }
      }
      return (
        <li key={index}>
          <dl>
            <dt>{ordinal}</dt>
            <dd>
              {text.split('\n').map((p, j) => <p key={j}>{p}</p>)}
              {item.children && <ParaList items={item.children} />}
            </dd>
          </dl>
        </li>
      );
    });
    return <ol className={`ParaList-stratum${stratum}`}>{children}</ol>;
  }
}


class DivisionsTab extends PureComponent {
  render() {
    return (
      <span>divisions</span>
    );
  }
}

class History extends PureComponent {
  constructor(props) {
    super(props);
    console.log('history');
  }

  componentWillUnmount() {
    console.log('unmounting history');
  }

  render() {
    return (
      <span>history</span>
    );
  }
}
