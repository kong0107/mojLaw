import React, {
  PureComponent
} from 'react';
import {
  Route,
  Switch,
  Link,
  NavLink
} from 'react-router-dom';
import cpi from 'chinese-parseint';

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
      catalog: [],
      law: {
        articles: [],
        divisions: [],
        flatDivisions: [],
        history: []
      }
    };
  }

  componentDidMount() {
    LawAPI.loadCatalog()
    .then(catalog => this.setState(
      {catalog: catalog.sort((a, b) => b.name.length - a.name.length)}
    ))
    .catch(errorHandler);
  }

  componentDidUpdate() {
    const pcode = this.props.match.params.pcode;
    if(pcode === this.state.law.pcode) return;
    LawAPI.loadLaw(this.props.match.params.pcode)
    .then(law => {
      document.title = law.title;
      window.scroll(0, 0); // 否則會停在前一個法規的卷軸位置。

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

      this.setState({law});
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
          <div className="d-none Law-headerSearchButton">
            <button className="btn btn-sm" type="button">
              <i className="fas fa-search" />
            </button>
          </div>
          <div className="dropdown">
            <button className="btn btn-sm" type="button"
              data-toggle="dropdown" id="lawDropdownMenuButton"
              aria-haspopup="true" aria-expanded="false"
            ><i className="fas fa-ellipsis-v" /></button>
            <div className="dropdown-menu dropdown-menu-right"
              aria-labelledby="lawDropdownMenuButton"
            >
              <div className="dropdown-item disabled small">
                更新日期：{law.lastUpdate}
              </div>
              <NavLink className="dropdown-item"
                to={match.url} exact
                activeClassName="d-none"
              >條文</NavLink>
              <NavLink className={law.divisions.length ? 'dropdown-item' : 'd-none'}
                to={`${match.url}/divisions`}
                activeClassName="d-none"
              >編章節</NavLink>
              <NavLink className="dropdown-item"
                to={`${match.url}/history`}
                activeClassName="d-none"
              >沿革</NavLink>
              <a className="dropdown-item"
                href={`https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=${law.pcode}`}
              >全國法規資料庫<i className="pl-1 fas fa-external-link-alt" /></a>
            </div>
          </div>
        </header>
        <Switch>
          <Route path={match.path} exact children={routeProps => <ArticlesTab {...routeProps} law={law} catalog={this.state.catalog} />} />
          <Route path={`${match.path}/divisions`} children={routeProps => <DivisionsTab {...routeProps} divisions={law.divisions} />} />
          <Route path={`${match.path}/history`} children={() => <History history={law.history} />} />
        </Switch>
      </div>
    );
  }
}

class ArticlesTab extends PureComponent {

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

  scrollToHash() {
    const hash = window.location.hash;
    if(hash) {
      const target = document.querySelector(hash);
      if(target) window.scroll(0, target.offsetTop);
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.setStickyElements);
    this.setStickyElements();
    this.scrollToHash();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStickyElements);
  }

  componentDidUpdate() {
    this.setStickyElements();
    this.scrollToHash();
  }

  render() {
    const query = (new URLSearchParams(this.props.location.search)).get('query') || '';
    const {articles, flatDivisions, preamble} = this.props.law;
    const preambleObj = preamble && {number: 0, content: preamble};

    let showing = [];
    if(/^[\s\-\d.~,]+$/.test(query)) {
      // 列出條號的情形，要把字串拆回數字再比對
      query.replace(/\s+/g, '').split(',').forEach(numOrRange => {
        const endpoints = numOrRange.split('~');
        if(endpoints.length === 1) {
          if(preamble && numOrRange === '0') showing.push(preambleObj);
          else {
            const target = articles.find(a => a.number === numf_reverse(numOrRange));
            if(target) showing.push(target);
          }
        }
        else {
          const [start, end] = endpoints.map(numf_reverse);
          if(preamble && start === 0) showing.unshift(preambleObj);
          showing.push(...articles.filter(a => a.number >= start && a.number <= end));
        }
        showing.sort((a, b) => a.number - b.number);
      });
    }
    else {
      const testFunc = createFilterFunction(query);
      showing = this.props.law.articles.filter(a => testFunc(a.content));
      if(preamble && testFunc(preamble)) showing.unshift(preambleObj);
    }

    const sections = [];
    flatDivisions.forEach(div => {
      const articles = showing.filter(a => a.number >= div.start && a.number <= div.end);
      if(!articles.length) return;
      sections.push(Object.assign({articles}, div));
    });
    if(!flatDivisions.length) sections.push({articles: showing});
    else if(showing.length && !showing[0].number) // 前言
      sections.unshift({articles: [showing[0]]});

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
                {sec.articles.map(a => <Article key={a.number.toString()} {...this.props} article={a} />)}
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
    const result = law.title + ' '
      + (article.number ? `第 ${numText} 條` : '前言') + '\n'
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
          <span className="Article-number">{article.number ? `第 ${numText} 條` : '前言'}</span>
          <div className="dropleft dropdown">
            <button className="btn btn-sm" type="button"
              data-toggle="dropdown" id={`articleDropdownButton${numText}`}
              aria-haspopup="true" aria-expanded="false"
            ><i className="fas fa-ellipsis-v" /></button>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby={`articleDropdownButton${numText}`}>
              <Link className="dropdown-item" to={`${this.props.match.url}?query=${numText}`}>法條連結</Link>
              <button className="dropdown-item" onClick={this.copyContent}
              >複製內文</button>
              <a className="dropdown-item"
                href={`https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=${law.pcode}&flno=${numText}`}
              >全國法規資料庫<i className="pl-1 fas fa-external-link-alt" /></a>
            </div>
          </div>
        </dt>
        <dd className="Article-content">
          <ParaList {...this.props} items={lawtext2obj(article.content)} />
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
              {text.split('\n').map((p, j) => <Paragraph key={j} {...this.props}>{p}</Paragraph>)}
              {item.children && <ParaList {...this.props} items={item.children} />}
            </dd>
          </dl>
        </li>
      );
    });
    return <ol className={`ParaList-stratum${stratum}`}>{children}</ol>;
  }
}

const reArtNum = /(第[一二三四五六七八九十百千]+[條項類款目](之[一二三四五六七八九十]+)?)+([、及與或至](第([一二三四五六七八九十百千]+)[條項類款目](之[一二三四五六七八九十]+)?)+)*/;
class Paragraph extends PureComponent {
  render() {
    //return <p>{this.props.children}</p>;

    const frags = [this.props.children];

    // 在提及其他法律的地方切斷
    this.props.catalog.forEach(law => {
      for(let i = 0; i < frags.length; ++i) {
        if(typeof frags[i] !== 'string') continue;
        if(frags[i].length < law.name.length) continue;
        const pos = frags[i].indexOf(law.name);
        if(pos === -1) continue;

        // 刪掉原本的，替換成更小的碎片。
        frags.splice(i, 1,
          frags[i].substring(0, pos),
          law,
          frags[i].substring(pos + law.name.length)
        );
      }
    });

    // 在提及其他法條的地方切斷
    for(let i = 0; i < frags.length; ++i) {
      if(typeof frags[i] !== 'string') continue;
      const match = reArtNum.exec(frags[i]);
      if(match) {
        const ranges = [];
        /**
         * 分析提到哪些條文
         * 最後如為 [307, 400, [1003, 1100]]
         * 則表示第三條之七、第四條、第十條之三至第十一條
         */
        // 分析提到哪些條文
        match[0].split(/[、及與或]/).forEach(s => {
          const re = /第([一二三四五六七八九十百千]+)條(之([一二三四五六七八九十]+))?/g;
          const mm = re.exec(s), mm2 = re.exec(s);
          if(!mm) return; // 沒有提到任何「條」
          const start = cpi(mm[1]) * 100 + cpi(mm[2] ? mm[3] : 0);
          if(!mm2) return ranges.push(start); // 只有提到一條
          const end = cpi(mm2[1]) * 100 + cpi(mm2[2] ? mm2[3] : 0);
          ranges.push([start, end]); // 提及一個範圍
        });

        const numberedText = match[0].replace(/[一二三四五六七八九十百千]+/g, cn => ` ${cpi(cn)} `);

        frags.splice(i, 1,
          frags[i].substring(0, match.index),
          {ranges, numberedText, origin: match[0]},
          frags[i].substring(match.index + match[0].length)
        );
        ++i;
      }
    }

    const children = [];
    frags.filter(f => f).forEach((frag, index, frags) => {
      if(!frag) return;
      if(typeof frag === 'string') {
        if(typeof children[children.length - 1] === 'string')
          children[children.length - 1] += frag;
        else children.push(frag);
        return;
      }
      if(frag.pcode) {
        return children.push(
          <Link key={index} to={'/laws/' + frag.pcode}>{frag.name}</Link>
        );
      }
      if(frag.ranges) {
        if(!frag.ranges.length) {
          return children.push(
            <span key={index} style={{color: 'green'}}>{frag.numberedText}</span>
          );
        }
        const query = frag.ranges.reduce((acc, cur) => {
          if(acc) acc += ',';
          if(typeof cur === 'number') return acc + numf(cur);
          else return acc + cur.map(numf).join('~');
        }, '');
        const law = (index && frags[index - 1].pcode) ? frags[index - 1] : this.props.law;
        children.push(<Link key={index} to={`/laws/${law.pcode}?query=${query}`}>{frag.numberedText}</Link>);
        return;
      }
      throw new RangeError('Unkown frag');
    });

    return <p>{children}</p>;
  }
}


class DivisionsTab extends PureComponent {
  render() {
    const {pcode} = this.props.match.params;
    const children = this.props.divisions.map(div =>
      <li key={div.type + div.start}>
        <Link className="DivisionItem"
          to={`/laws/${pcode}#article${numf(div.start)}`}
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
