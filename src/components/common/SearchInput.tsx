import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { Input } from 'antd';
import Search from 'antd/lib/input/Search';
import * as qs from 'qs';

interface Props extends RouteComponentProps {
  className?: string;
  autoFocus?: boolean;
  large?: boolean;
}
interface State {
  value: string;
}

class SearchInput extends React.Component<Props, State> {
  public static defaultProps = {
    autoFocus: false,
    large: false
  };
  public readonly state: State = {
    value: ''
  };

  public componentDidMount() {
    const { pathname, search } = this.props.location;
    if (pathname.startsWith('/search')) {
      this.setState({
        value: qs.parse(search, { ignoreQueryPrefix: true }).q
      });
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { key, pathname, search } = this.props.location;
    if (key !== prevProps.location.key) {
      if (pathname.startsWith('/search')) {
        this.setState({
          value: qs.parse(search, { ignoreQueryPrefix: true }).q
        });
      } else {
        this.setState({ value: '' });
      }
      return this.ref && this.ref.blur();
    }
  }

  private ref: Search | null;
  private handleSearch = () => {
    const {
      history: { push },
      location: { pathname }
    } = this.props;
    const { value } = this.state;

    const q = value.trim();
    if (q.length <= 0) {
      return;
    }

    // When route is already in '/search', preserve current search category
    if (/\/search\/(collections|items|users)/.test(pathname)) {
      push(`${pathname}?q=${q}`);
    } else {
      push(`/search/collections?q=${q}`);
    }
  };

  public render(): React.ReactNode {
    const { className, autoFocus, large } = this.props;
    const { value } = this.state;

    return (
      <Input.Search
        className={className}
        placeholder="검색"
        value={value}
        onChange={e => this.setState({ value: e.currentTarget.value })}
        onSearch={this.handleSearch}
        ref={search => (this.ref = search)}
        autoFocus={autoFocus}
        size={large ? 'large' : 'default'}
      />
    );
  }
}

export default withRouter(SearchInput);
