import * as React from 'react';

import { List } from 'antd';

interface Props<T = any> {
  dataSource: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  isLast: boolean;
  loadMoreButton: React.ReactChild;
}

class GridCardList<T> extends React.Component<Props<T>, {}> {
  public render() {
    const { dataSource, renderCard, isLast, loadMoreButton } = this.props;

    return (
      <div>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
          dataSource={dataSource}
          renderItem={(item: T, index: number) => (
            <List.Item key={index}>{renderCard(item, index)}</List.Item>
          )}
        />
        {!isLast && loadMoreButton}
      </div>
    );
  }
}

export default GridCardList;
