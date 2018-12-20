import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SortEndHandler } from 'react-sortable-hoc';

import { CollectionHead, CollectionItems } from 'components/collection';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as baseActions } from 'store/modules/base';
import { actions as collectionActions, CollectionState } from 'store/modules/collection';

interface Props extends RouteComponentProps {
  BaseActions: typeof baseActions;
  collection: CollectionState;
  CollectionActions: typeof collectionActions;
  collectionId: number;
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
    const { BaseActions } = this.props;
    BaseActions.hideItemPanel();
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
    const { BaseActions, collection } = this.props;
    const item =
      collection.items &&
      e.currentTarget &&
      collection.items[parseInt(e.currentTarget.id, 10)];
    console.log(collection.items);

    BaseActions.showItemPanel(item);
  };

  public render(): React.ReactNode {
    const { collection, items } = this.props.collection;

    return (
      <>
        <CollectionHead collection={collection} />
        {items && (
          <CollectionItems
            items={items}
            useDragHandle={true}
            onSortEnd={this.handleSortEnd}
            lockToContainerEdges={true}
            onClickItem={this.handleClickItem}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = ({ collection }: RootState) => ({
  collection
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  BaseActions: bindActionCreators(baseActions, dispatch),
  CollectionActions: bindActionCreators(collectionActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CollectionItemsContainer)
);
