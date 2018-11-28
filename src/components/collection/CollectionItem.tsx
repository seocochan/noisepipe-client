import * as React from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';

import { Icon } from 'antd';
import * as moment from 'moment';
import { IItemResponse } from 'payloads';

interface Props {
  item: IItemResponse;
  itemIndex: number;
  onClickItem: (e: React.MouseEvent) => void;
}

const DragHandle = SortableHandle(() => (
  <Icon type="drag" style={{ fontSize: 20 }} />
));

class CollectionItem extends React.Component<Props, {}> {
  // FIXME: currentUser와 collection의 소유자가 다르면 handle 출력 X
  public render(): React.ReactNode {
    const {
      itemIndex,
      onClickItem,
      item: { title, position, description, createdAt }
    } = this.props;

    return (
      <div>
        <DragHandle />
        <a id={itemIndex.toString()} onClick={onClickItem}>
          {title} {position} | {description} |{' '}
          {moment(createdAt).from(moment.now())}
        </a>
      </div>
    );
  }
}

export default SortableElement(CollectionItem);
