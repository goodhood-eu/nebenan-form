import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

import { getDateDiff } from './utils';

const MIN_UPDATE_RATE = 1000 * 60;


class TimeAgo extends PureComponent {
  constructor(props) {
    super(props);
    this.updateTime = this.updateTime.bind(this);

    this.state = {
      date: null,
    };
  }

  componentDidMount() {
    this.updateTime();

    if (this.props.updateInterval) {
      const rate = Math.max(MIN_UPDATE_RATE, this.props.updateInterval);
      const heartbeat = require('nebenan-helpers/lib/heartbeat').default;
      this.cancelHeartbeat = heartbeat(rate, this.updateTime);
    }
  }

  componentWillUnmount() {
    if (this.cancelHeartbeat) this.cancelHeartbeat();
  }


  updateTime() {
    this.setState((state, props) => ({ date: getDateDiff(Date.now(), props.date) }));
  }

  render() {
    const cleanProps = omit(this.props, 'children', 'date', 'updateInterval');
    const { children, date } = this.props;
    return <time {...cleanProps} dateTime={date}>{this.state.date} {children}</time>;
  }
}

TimeAgo.propTypes = {
  className: PropTypes.string,
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  updateInterval: PropTypes.number,
  children: PropTypes.node,
};

export default TimeAgo;
