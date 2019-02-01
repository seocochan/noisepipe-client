import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { Input } from 'antd';

import styles from './SearchInput.module.less';

interface Props extends RouteComponentProps {}
interface State {
  q: string;
}

class SearchInput extends React.Component<Props, State> {
  public readonly state: State = {
    q: ''
  };

  private handleSearch = (value: string) => {
    const {
      history: { push },
      location: { pathname }
    } = this.props;

    // When route is already in '/search', preserve current search category
    if (/\/search\/(collections|items|users)/.test(pathname)) {
      push(`${pathname}?q=${value}`);
    } else {
      push(`/search/collections?q=${value}`);
    }
  };

  public render(): React.ReactNode {
    const { q } = this.state;

    return (
      <Input.Search
        className={styles.search}
        placeholder="검색"
        value={q}
        onChange={e => this.setState({ q: e.currentTarget.value })}
        onSearch={this.handleSearch}
        style={{ margin: '10px 12px' }}
      />
    );
  }
}

export default withRouter(SearchInput);
