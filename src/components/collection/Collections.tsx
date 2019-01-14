import * as React from 'react';

import { Button, List } from 'antd';
import { ICollectionSummary } from 'payloads';

interface Props {
  collections: ICollectionSummary[];
  renderCard: (collection: ICollectionSummary) => any;
  // CollectionsContainer에서 collection => <CollectionCard collection={item} isOwnder={collection.createdBy.id === currentUser.id} />
  // loading: boolean; // 첫 로딩이 아닌 loadmore 로딩만
  // isLast: boolean; // loadmore 버튼 비활성화
}

const Collections: React.SFC<Props> = ({ collections, renderCard }) => {
  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
      loadMore={<Button>더 보기</Button>}
      dataSource={collections}
      renderItem={(item: ICollectionSummary, index: number) => (
        <List.Item key={index}>{renderCard(item)}</List.Item>
      )}
    />
  );
};

export default Collections;
