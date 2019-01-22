import * as React from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';

import { Button, Icon } from 'antd';
import { DragIcon, SoundCloudIcon } from 'icons';
import { IItemResponse } from 'payloads';
import { Provider } from 'types';

import styles from './CollectionItem.module.less';

const DragHandle = SortableHandle(() => (
  <div className={styles.dragHandle}>
    <DragIcon style={{ fontSize: 24, color: '#555' }} />
  </div>
));
const iconStyles = {
  fontSize: 21,
  color: '#333',
  marginRight: 4
};

interface Props {
  item: IItemResponse;
  itemIndex: number;
  showDragHandle: boolean;
  isSet: boolean;
  isPlaying: boolean;
  onClickItem: (e: React.MouseEvent) => void;
  playItem: (item: IItemResponse) => void;
  resumeItem: (item: IItemResponse) => void;
  pauseItem: (item: IItemResponse) => void;
}

class CollectionItem extends React.Component<Props, {}> {
  public render(): React.ReactNode {
    const {
      item,
      item: { title, tags, sourceProvider },
      itemIndex,
      showDragHandle,
      isSet,
      isPlaying,
      playItem,
      resumeItem,
      pauseItem,
      onClickItem
    } = this.props;

    return (
      <div className={styles.itemContainer}>
        {isPlaying ? (
          <Button
            type="primary"
            icon="pause"
            shape="circle"
            onClick={() => pauseItem(item)}
          />
        ) : isSet ? (
          <Button
            type="primary"
            icon="caret-right"
            shape="circle"
            onClick={() => resumeItem(item)}
          />
        ) : (
          <Button
            icon="caret-right"
            shape="circle"
            onClick={() => playItem(item)}
          />
        )}
        <div
          className={styles.itemContent}
          id={itemIndex.toString()}
          onClick={onClickItem}
        >
          <div className={styles.title}>
            {sourceProvider === Provider.Youtube ? (
              <Icon type="youtube" theme="filled" style={iconStyles} />
            ) : (
              <SoundCloudIcon style={iconStyles} />
            )}
            <span>{title}</span>
          </div>
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <span key={index}>{`#${tag}`}</span>
            ))}
          </div>
        </div>
        {showDragHandle && <DragHandle />}
      </div>
    );
  }
}

export default SortableElement(CollectionItem);
