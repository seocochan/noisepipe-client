import * as React from 'react';

import { List } from 'antd';
import { ICollectionSummary } from 'payloads';

interface Props {
  collections: ICollectionSummary[];
  renderCard: (collection: ICollectionSummary) => any;
  isLast: boolean;
  loadMoreButton: React.ReactChild;
}

const GridCardList: React.SFC<Props> = ({
  collections,
  renderCard,
  isLast,
  loadMoreButton
}) => {
  return (
    <div>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
        dataSource={collections}
        renderItem={(item: ICollectionSummary, index: number) => (
          <List.Item key={index}>{renderCard(item)}</List.Item>
        )}
      />
      {!isLast && loadMoreButton}
    </div>
  );
};

export default GridCardList;
