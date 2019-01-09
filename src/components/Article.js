import React, {
  Component
} from 'react';

import * as lawtext2obj from '../js/lawtext2obj';
import {numf} from '../js/utility';

const createList = paras => {
  if(!paras.length) return null;
  const stratum = paras[0].stratum;
  const items = paras.map((para, i) => {
    const child = createList(para.children);
    const frags = para.text.split(/\r?\n/).map((frag, i) => <p key={i}>{frag}</p>);
    return (<li key={i}>{frags}{child}</li>);
  });
  return <ol className={`stratum-${stratum}`}>{items}</ol>;
};

class Article extends Component {
  render() {
    const article = this.props.article;
    const content = lawtext2obj(article.content);
    return (
      <dl id={`article-${article.number}`}>
        <dt>第 {numf(article.number)} 條</dt>
        <dd className="Article-content">{createList(content)}</dd>
      </dl>
    );
  }
}

export default Article;
