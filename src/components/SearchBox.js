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
          value={this.props.value}
          placeholder={this.props.placeholder}
          onChange={event => this.props.onChange(event.target.value)}
        />
      </div>
    );
  }
}
