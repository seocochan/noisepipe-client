import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SortEndHandler } from 'react-sortable-hoc';

import { CollectionHead, CollectionItems } from 'components/collection';
import { ItemAddForm } from 'components/item';
import { PlayerControls } from 'components/player';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as collectionActions, CollectionState } from 'store/modules/collection';
import { actions as itemActions } from 'store/modules/item';
import { actions as playerActions } from 'store/modules/player';

interface Props extends RouteComponentProps {
  ItemActions: typeof itemActions;
  collection: CollectionState;
  CollectionActions: typeof collectionActions;
  collectionId: number;
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
    const { ItemActions, PlayerActions } = this.props;
    ItemActions.hidePanel();
    ItemActions.setItem(null);
    PlayerActions.stop();
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
    const { ItemActions, PlayerActions, collection } = this.props;
    const item =
      collection.items &&
      e.currentTarget &&
      collection.items[parseInt(e.currentTarget.id, 10)];

    ItemActions.showPanel();
    ItemActions.setItem(item);
    PlayerActions.setCurrentItem(item);
  };
  private handleAddItem = (
    title: string,
    sourceUrl: string,
    sourceProvider: string
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

  public render(): React.ReactNode {
    const { collection, items } = this.props.collection;

    return (
      <>
        <CollectionHead collection={collection} />
        <ItemAddForm handleAddItem={this.handleAddItem} />
        {items && (
          <CollectionItems
            items={items}
            useDragHandle={true}
            onSortEnd={this.handleSortEnd}
            lockToContainerEdges={true}
            onClickItem={this.handleClickItem}
          />
        )}
        <PlayerControls />
      </>
    );
  }
}

const mapStateToProps = ({ collection }: RootState) => ({
  collection
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
