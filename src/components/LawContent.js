import React, {
  Component
} from 'react';
import Article from './Article';
import {numf} from '../js/utility';

class LawContent extends Component {
  render() {
    let divisions = this.props.divisions;
    if(!divisions.length) divisions = [{
        number: 0, start: 100, end: Infinity
    }];

    divisions = divisions.map(div => {
      const id = this.props.divPrefix.concat('-', div.number);
      const articles = this.props.articles.filter(article =>
        article.number >= div.start && article.number <= div.end
      );

      const header = div.number
        ? (
          <header className={`division-title-container division-${div.type}`}>
            <span className="division-number">第 {numf(div.number)} {div.type}</span>
            <span className="division-title">{div.title}</span>
            <span className="division-range">§§ {numf(div.start)}～{numf(div.end)}</span>
          </header>
        ) : null
      ;

      const main = div.children
        ? (<LawContent divPrefix={id} divisions={div.children} articles={articles} />)
        : articles.map(article => (<Article key={article.number} article={article} />))
      ;

      return <li key={id} id={id}>{header}{main}</li>;
    });

    return <ul className="LawContent">{divisions}</ul>;
  }
}

LawContent.defaultProps = {
  divPrefix: 'div',
  divisions: [],
  articles: []
};

export default LawContent;
