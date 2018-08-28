import { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';

export default class PageHeader extends PureComponent {
  static contextTypes = {
    record: PropTypes.object,
  };

  state = {};

  componentDidMount() {}

  componentDidUpdate(preProps) {}

  render() {
    const { val, record, max = 6 } = this.props;
    const length = val.length;
    const breif = val.substr(0, max);

    // const title = (
    //   <Fragment>
    //     <b>{record.name}</b>的名称
    //   </Fragment>
    // );

    return (
      <Popover content={val} trigger="hover">
        {breif}
        {length > max ? '...' : null}
      </Popover>
    );
  }
}
