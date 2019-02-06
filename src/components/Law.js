import React, {
  PureComponent
} from 'react';
import {
  Route,
  Switch,
  Link,
  NavLink
} from 'react-router-dom';

import config from '../js/config';
import {
  errorHandler,
  createFilterFunction,
  numf,
  numf_reverse
} from '../js/utility';
import lawtext2obj from '../js/lawtext2obj';
import LawAPI from '../js/LawAPI';
import SearchBox from './SearchBox';

import '../styles/Law.scss';

export default class Law extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      law:{
        articles: [],
        divisions: [],
        flatDivisions: [],
        history: []
      }
    };
  }

  componentDidMount() {
    LawAPI.loadLaw(this.props.match.params.pcode)
    .then(law => {
      document.title = law.title;

      // 只留下編章節結構樹的葉子
      const flatDivisions = law.divisions.slice();
      for(let i = 0; i < flatDivisions.length;) {
        const div = flatDivisions[i];
        if(div.children) {
          const ancestors = (div.ancestors || []).concat(div);
          div.children.forEach(subDiv => subDiv.ancestors = ancestors);
          flatDivisions.splice(i, 1, ...div.children);
        }
        else ++i;
      }
      law.flatDivisions = flatDivisions;
      return this.setState({law});
    })
    .catch(errorHandler);
  }

  componentWillUnmount() {
    document.title = config.siteName;
  }

  render() {
    const { match } = this.props;
    const { law } = this.state;

    return (
      <div className="Law">
        <header>
          <Link className="Home-link" to="/"><i className="fas fa-angle-left" /></Link>
          <div className="Law-title">
            {law.title || '讀取中'}
            {law.isDiscarded && <span className="badge badge-danger">已廢止</span> }
          </div>
          <span className="Setting-link"><i className="fas fa-cog" /></span>
        </header>
        <div className={law.title ? 'Law-meta' : 'd-none'}>
          <div>{law.lastUpdate}</div>
          <div>{law.pcode}</div>
        </div>
        <ul className="Law-tabs nav nav-tabs">
          <li className="nav-item">
            <NavLink className="nav-link"
              to={match.url} exact
              onClick={() => window.location.reload()}
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
        <Switch>
          <Route path={match.path} exact render={() => <ArticlesTab law={law} />} />
          <Route path={`${match.path}/divisions`} render={() => <DivisionsTab {...this.props} divisions={law.divisions} />} />
          <Route path={`${match.path}/history`} children={() => <History history={law.history} />} />
        </Switch>
      </div>
    );
  }
}

class ArticlesTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      query: (new URLSearchParams(window.location.search)).get('query') || ''
    };
  }

  //設定各 sticky 元素的高度。因法規名稱和章節名稱都可能換行而造成不能把高度寫死。
  setStickyElements() {
    const lawHeader = document.querySelector('.Law > header');
    const contentHeader = document.querySelector('.Law-tabContent > header');
    contentHeader.style.top = lawHeader.offsetHeight + 'px';
    const offset = lawHeader.offsetHeight + contentHeader.offsetHeight;
    document.querySelectorAll('section.Law-division').forEach(div => {
      let articleOffset = offset;
      const header = div.querySelector('.DivisionHeader');
      if(header) {
        header.style.top = offset + 'px';
        articleOffset += header.offsetHeight;
      }
      /**
       * 因應法條的 jump link 需求，設定 padding-top 和 margin-top 。
       * @see {@link http://nicolasgallagher.com/jump-links-and-viewport-positioning/demo/ }
       */
      div.querySelectorAll('.Article').forEach(articleElement => {
        const s = articleElement.style;
        s.paddingTop = articleOffset + 'px';
        s.marginTop = `-${articleOffset}px`;
        articleElement.querySelector('.Article-header').style.top = articleOffset + 'px';
      });
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.setStickyElements);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStickyElements);
  }

  componentDidUpdate() {
    this.setStickyElements();
  }

  render() {
    const query = this.state.query;
    const {articles, flatDivisions} = this.props.law;

    let showing = [];
    if(/^[\s\-\d.~,]+$/.test(query)) {
      // 列出條號的情形，要把字串拆回數字再比對
      query.replace(/\s+/g, '').split(',').forEach(numOrRange => {
        const endpoints = numOrRange.split('~');
        if(endpoints.length === 1) {
          const target = articles.find(a => a.number === numf_reverse(numOrRange));
          if(target) showing.push(target);
        }
        else {
          const [start, end] = endpoints.map(numf_reverse);
          showing.push(...articles.filter(a => a.number >= start && a.number <= end));
        }
        showing.sort((a, b) => a.number - b.number);
      });
    }
    else {
      const testFunc = createFilterFunction(query);
      showing = this.props.law.articles.filter(a => testFunc(a.content));
    }

    const sections = [];
    flatDivisions.forEach(div => {
      const articles = showing.filter(a => a.number >= div.start && a.number <= div.end);
      if(!articles.length) return;
      sections.push(Object.assign({articles}, div));
    });
    if(!flatDivisions.length) sections.push({articles: showing});

    return (
      <div className="Law-tabContent">
        <header>
          <SearchBox
            placeholder="法條搜尋"
            value={query}
            onChange={text => {
              this.setState({query: text});
              window.scroll(0, 0);
            }}
          />
          <span className="Law-articlesAmount">
            {showing.length} 筆資料
          </span>
        </header>
        <main>
          <div className="Law-articlesContainer">
            {sections.map(sec =>
              <section key={sec.type + sec.start} className="Law-division">
                <DivisionHeader division={sec} />
                {sec.articles.map(a => <Article key={a.number.toString()} article={a} law={this.props.law} />)}
              </section>
            )}
          </div>
          <div className={showing.length > 2 ? 'Law-articlesSliderContainer d-print-none' : 'd-none'}>
            <input type="range" min="0" max={showing.length - 1}
              onChange={event => {
                const articles = document.querySelectorAll('.Article');
                window.scroll(0, articles[event.target.value].offsetTop);
              }}
            />
          </div>
        </main>
      </div>
    );
  }
}

class DivisionHeader extends PureComponent {
  render() {
    const {division} = this.props;
    if(!division.title) return null;
    const ancestors = division.ancestors || [];
    const divList = [...ancestors, division];
    return (
      <div className="DivisionHeader">
        {divList.map(div =>
          <div key={div.type + div.start} className="DivisionHeader-part">
            <div className="DivisionHeader-partNumber">第 {numf(div.number)} {div.type}</div>
            <div className="DivisionHeader-partTitle">{div.title}</div>
          </div>
        )}
      </div>
    );
  }
}

class Article extends PureComponent {
  constructor(props) {
    super(props);
    this.copyContent = this.copyContent.bind(this);
  }

  copyContent() {
    if(!navigator.clipboard) return;
    const {article, law} = this.props;
    const numText = numf(article.number);
    const result = `${law.title} 第 ${numText} 條\n`
      + article.content
      + `\n${window.location.origin}${window.location.pathname}?query=${numText}`
    ;
    navigator.clipboard.writeText(result);
  }


  render() {
    const {article, law} = this.props;
    const numText = numf(article.number);
    return (
      <dl className="Article" id={`article${numText}`}>
        <dt className="Article-header">
          <span className="Article-number">第 {numText} 條</span>
          <div className="dropleft dropdown">
            <button className="btn btn-sm"
              type="button" id={`articleDropdownButton${numText}`} data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false"
            ><i className="fas fa-ellipsis-h" /></button>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby={`articleDropdownButton${numText}`}>
              <a className="dropdown-item" href={`?query=${numText}`}>法條連結</a>
              <button className="dropdown-item" onClick={this.copyContent}
              >複製內文</button>
              <a className="dropdown-item" href={`https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=${law.pcode}&flno=${numText}`}>全國法規資料庫</a>
            </div>
          </div>
        </dt>
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
          if(/^[一二三四五六七八九十]+$/.test(ordinal)) ordinal += '　'; // for 憲法§108
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
    const children = this.props.divisions.map(div => {
      return (
        <li key={div.type + div.start}>
          <Link className="DivisionItem"
            to={`${this.props.match.url}?query=${numf(div.start)}~${numf(div.end)}`}
          >
            <span className="DivisionItem-number">第 {numf(div.number)} {div.type}</span>
            <div className="DivisionItem-contentContainer">
              <span className="DivisionItem-title">{div.title}</span>
              <span className="DivisionItem-range">§§{numf(div.start)}～{numf(div.end)}</span>
            </div>
          </Link>
          {div.children && <DivisionsTab {...this.props} divisions={div.children} />}
        </li>
      );
    });
    return <ol className="DivisionList">{children}</ol>;
  }
}

class History extends PureComponent {
  render() {
    const children = this.props.history.map((item, index) =>
      <li key={index}>{item}</li>
    );
    return <ol className="History">{children}</ol>;
  }
}
