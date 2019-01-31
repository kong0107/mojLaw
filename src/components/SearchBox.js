import React, {
  PureComponent
} from 'react';

import '../styles/SearchBox.scss';

export default class SearchBox extends PureComponent {
  render() {
    let className = 'SearchBox';
    if(this.props.className) className += ' ' + this.props.className;

    return (
      <div className={className}>
        <i className="fas fa-search" />
        <input className="SearchBox-input"
          type="text"
          placeholder={this.props.placeholder}
          onInput={event => this.props.onInput(event.target.value)}
        />
      </div>
    );
  }
}
