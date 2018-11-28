import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SortEndHandler } from 'react-sortable-hoc';

import { Drawer } from 'antd';
import { CollectionHead, CollectionItems } from 'components/collection';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as collectionActions, CollectionState } from 'store/modules/collection';

interface Props extends RouteComponentProps {
  collection: CollectionState;
  CollectionActions: typeof collectionActions;
  collectionId: number;
}

interface State {
  visible: boolean;
  selectedItemIndex: number | null;
}

class CollectionItemsContainer extends React.Component<Props, State> {
  public readonly state: State = {
    visible: false,
    selectedItemIndex: null
  };

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

  private showDrawer = (e: React.MouseEvent) => {
    e.preventDefault();
    this.setState({
      visible: true,
      selectedItemIndex: parseInt(e.currentTarget.id, 10)
    });
  };

  private hideDrawer = () => {
    this.setState({ visible: false });
  };

  public render(): React.ReactNode {
    const { collection, items } = this.props.collection;
    const { visible, selectedItemIndex } = this.state;

    return (
      <>
        <CollectionHead collection={collection} />
        {items && (
          <CollectionItems
            items={items}
            useDragHandle={true}
            onSortEnd={this.handleSortEnd}
            lockToContainerEdges={true}
            onClickItem={this.showDrawer}
          />
        )}
        <Drawer
          placement="right"
          visible={visible}
          onClose={this.hideDrawer}
          width={window.innerWidth <= 760 ? '100%' : '640px'}
        >
          {items && selectedItemIndex != null && items[selectedItemIndex].title}
        </Drawer>
      </>
    );
  }
}

const mapStateToProps = ({ collection }: RootState) => ({
  collection
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  CollectionActions: bindActionCreators(collectionActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CollectionItemsContainer)
);
