import * as React from 'react';
import { SortableContainer } from 'react-sortable-hoc';

import { LoadingIndicator } from 'components/common';
import { IItemResponse } from 'payloads';

import CollectionItem from './CollectionItem';

interface Props {
  items: IItemResponse[] | null;
  playerItem?: { id: number; playing: boolean };
  onClickItem: (e: React.MouseEvent) => void;
  playItem: (item: IItemResponse) => void;
  resumeItem: (item: IItemResponse) => void;
  pauseItem: (item: IItemResponse) => void;
}

// FIXME: Hide editables when auth not exist
class CollectionItems extends React.Component<Props, {}> {
  public render(): React.ReactNode {
    const {
      items,
      playerItem,
      onClickItem,
      playItem,
      resumeItem,
      pauseItem
    } = this.props;

    if (items == null) {
      return <LoadingIndicator />;
    }
    return (
      <div>
        {items.length === 0 && <div>아이템이 없습니다.</div>}
        {items.map((item, index) => (
          <CollectionItem
            key={item.id}
            index={index}
            item={item}
            itemIndex={index}
            isSet={playerItem && playerItem.id === item.id ? true : false}
            isPlaying={
              playerItem && playerItem.id === item.id && playerItem.playing
                ? true
                : false
            }
            onClickItem={onClickItem}
            playItem={playItem}
            resumeItem={resumeItem}
            pauseItem={pauseItem}
          />
        ))}
      </div>
    );
  }
}

export default SortableContainer(CollectionItems);
