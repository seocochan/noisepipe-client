import * as React from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';

import { Button } from 'antd';
import { IItemResponse } from 'payloads';

import styles from './CollectionItem.module.less';

interface Props {
  item: IItemResponse;
  itemIndex: number;
  onClickItem: (e: React.MouseEvent) => void;
}

const DragIcon = ({ size = 16, color = '#fff' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
  >
    <path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" fill={color} />
  </svg>
);

const DragHandle = SortableHandle(() => (
  <div className={styles.dragHandle}>
    <DragIcon size={16} color={'#555'} />
  </div>
));

class CollectionItem extends React.Component<Props, {}> {
  // FIXME: currentUser와 collection의 소유자가 다르면 handle 출력 X
  public render(): React.ReactNode {
    const {
      itemIndex,
      onClickItem,
      item: { title, tags }
    } = this.props;

    return (
      <div className={styles.itemContainer}>
        <Button icon="caret-right" shape="circle" size="small" />
        <div
          className={styles.itemContent}
          id={itemIndex.toString()}
          onClick={onClickItem}
        >
          <div className={styles.title}>{title}</div>
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <span key={index}>{`#${tag}`}</span>
            ))}
          </div>
        </div>
        <DragHandle />
      </div>
    );
  }
}

export default SortableElement(CollectionItem);
