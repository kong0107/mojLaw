import React, {
  Component
} from 'react';

import {numf} from '../js/utility';

class DivisionList extends Component {
  render() {
    const divisions = this.props.divisions.map(div => {
      const id = this.props.prefix.concat('-', div.number);

      const child = div.children
        ? (<DivisionList prefix={id} divisions={div.children} />)
        : null
      ;

      return (
        <li key={id} className={`division-${div.type}`}>
          <div className="division-title-container">
            <span className="division-number">第 {numf(div.number)} {div.type}</span>
            <a className="division-title"
              title={`§§${numf(div.start)}～${numf(div.end)}`}
              href={`#${id}`}
            >{div.title}</a>
          </div>
          {child}
        </li>
      );
    });

    return <ul className="DivisionList">{divisions}</ul>;
  }
}

DivisionList.defaultProps = {
    prefix: 'div'
};

export default DivisionList;
