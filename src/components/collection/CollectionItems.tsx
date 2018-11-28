import * as React from 'react';
import { SortableContainer } from 'react-sortable-hoc';

import { LoadingIndicator } from 'components/common';
import { IItemResponse } from 'payloads';

import CollectionItem from './CollectionItem';

interface Props {
  items: IItemResponse[] | null;
  onClickItem: (e: React.MouseEvent) => void;
}

// FIXME: Hide editables when auth not exist
class CollectionItems extends React.Component<Props, {}> {
  public render(): React.ReactNode {
    const { items, onClickItem } = this.props;

    if (items == null) {
      return <LoadingIndicator />;
    }
    if (items.length === 0) {
      return <div>아이템이 없습니다.</div>;
    }
    return (
      <>
        <ul>
          {items.map((item, index) => (
            <CollectionItem
              key={item.id}
              itemIndex={index}
              index={index}
              item={item}
              onClickItem={onClickItem}
            />
          ))}
        </ul>
      </>
    );
  }
}

export default SortableContainer(CollectionItems);
