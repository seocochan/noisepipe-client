import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SortEndHandler } from 'react-sortable-hoc';

import { Divider } from 'antd';
import { CollectionHeader, CollectionItems, CollectionPlayButton } from 'components/collection';
import { ItemAddForm, ItemFilterInput } from 'components/item';
import { DummyPlayer } from 'components/player';
import { IItemResponse } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as collectionActions, CollectionState } from 'store/modules/collection';
import { actions as itemActions } from 'store/modules/item';
import { actions as playerActions, PlayerState } from 'store/modules/player';
import { Provider } from 'types';

interface Props extends RouteComponentProps {
  ItemActions: typeof itemActions;
  collection: CollectionState;
  CollectionActions: typeof collectionActions;
  collectionId: number;
  player: PlayerState;
  PlayerActions: typeof playerActions;
}

class CollectionItemsContainer extends React.Component<Props, {}> {
  public async componentDidMount() {
    const { collectionId, CollectionActions, history } = this.props;

    try {
      await CollectionActions.loadCollection(collectionId);
    } catch (error) {
      if (error.response.status === 500) {
        history.replace('/error');
      }
    }
    CollectionActions.loadItems(collectionId);
  }
  public componentWillUnmount() {
    const { ItemActions } = this.props;
    ItemActions.hidePanel();
    ItemActions.setItem(null);
  }

  private handleSortEnd: SortEndHandler = async ({ oldIndex, newIndex }) => {
    const { collection, CollectionActions } = this.props;

    if (oldIndex === newIndex || collection.items == null) {
      return;
    }
    try {
      await CollectionActions.updateItemPostion(oldIndex, newIndex);
    } catch (error) {
      console.log(error);
    }
  };
  private handleClickItem = (e: React.MouseEvent) => {
    e.preventDefault();
    const { ItemActions, collection } = this.props;
    const item =
      collection.items &&
      e.currentTarget &&
      collection.items[parseInt(e.currentTarget.id, 10)];

    ItemActions.showPanel();
    ItemActions.setItem(item);
  };
  private handleAddItem = (
    title: string,
    sourceUrl: string,
    sourceProvider: Provider
  ) => {
    const {
      CollectionActions,
      collection: { collection }
    } = this.props;
    if (!collection) {
      return;
    }
    CollectionActions.addItem(collection.id, title, sourceUrl, sourceProvider);
  };
  private playItem = (item: IItemResponse) => {
    const { PlayerActions } = this.props;
    const target = item.sourceProvider;
    PlayerActions.stopOthers(target);
    PlayerActions.setItem(target, item);
  };
  private resumeItem = (item: IItemResponse) => {
    const { PlayerActions } = this.props;
    const target = item.sourceProvider;
    PlayerActions.play(target);
  };
  private pauseItem = (item: IItemResponse) => {
    const { PlayerActions } = this.props;
    const target = item.sourceProvider;
    PlayerActions.pause(target);
  };

  public render(): React.ReactNode {
    const {
      collection: { collection, items },
      player: { currentTarget },
      player,
      PlayerActions
    } = this.props;
    const playerItem =
      currentTarget && player[currentTarget].item
        ? {
            id: player[currentTarget].item!.id,
            playing: player[currentTarget].status.playing
          }
        : undefined;

    return (
      <>
        <CollectionHeader
          collection={collection}
          collectionPlayButton={
            <CollectionPlayButton
              isPlaying={
                currentTarget ? player[currentTarget].status.playing : false
              }
              isSet={currentTarget ? true : false}
              onPause={() =>
                currentTarget && PlayerActions.pause(currentTarget)
              }
              onPlay={() =>
                items && items.length > 0 && this.playItem(items[0])
              }
              onResume={() =>
                currentTarget && PlayerActions.play(currentTarget)
              }
            />
          }
          itemCount={items ? items.length : 0}
          itemAddForm={<ItemAddForm handleAddItem={this.handleAddItem} />}
        />
        <DummyPlayer />
        <Divider />
        <ItemFilterInput />
        {items && (
          <CollectionItems
            items={items}
            playerItem={playerItem}
            lockToContainerEdges={true}
            onClickItem={this.handleClickItem}
            playItem={this.playItem}
            resumeItem={this.resumeItem}
            pauseItem={this.pauseItem}
            useDragHandle={true}
            onSortEnd={this.handleSortEnd}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = ({ collection, player }: RootState) => ({
  collection,
  player
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  ItemActions: bindActionCreators(itemActions, dispatch),
  CollectionActions: bindActionCreators(collectionActions, dispatch),
  PlayerActions: bindActionCreators(playerActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CollectionItemsContainer)
);
