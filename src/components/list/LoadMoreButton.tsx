import * as React from 'react';

import { Button, message } from 'antd';

interface Props {
  loadMore: () => Promise<void>;
}
interface State {
  loading: boolean;
}

class LoadMoreButton extends React.Component<Props, State> {
  public readonly state: State = {
    loading: false
  };

  private handleLoadMore = async () => {
    const { loadMore } = this.props;
    try {
      this.setState({ loading: true });
      await loadMore();
    } catch (error) {
      message.error('에러가 발생했습니다');
    }
    this.setState({ loading: false });
  };

  public render(): React.ReactNode {
    const { loading } = this.state;

    return (
      <Button onClick={this.handleLoadMore} loading={loading} block={true}>
        더 보기
      </Button>
    );
  }
}

export default LoadMoreButton;
