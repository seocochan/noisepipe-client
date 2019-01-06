import * as React from 'react';
import { connect } from 'react-redux';

import { message } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { ItemEditor, ItemPanel, ItemViewer } from 'components/item';
import ItemPanelHeader from 'components/item/ItemPanelHeader';
import { IItemPutRequest } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as itemActions, ItemState } from 'store/modules/item';
import { Tab } from 'types';

interface Props {
  item: ItemState;
  ItemActions: typeof itemActions;
}

class ItemPanelContainer extends React.Component<Props, {}> {
  private handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    const { ItemActions } = this.props;
    ItemActions.hidePanel();
    // FIXME:
    // ItemActions.setItem(null);
  };
  private handleTabChange = (e: RadioChangeEvent) => {
    const { ItemActions } = this.props;
    ItemActions.changeTab(e.target.value);
  };
  private handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    const {
      ItemActions,
      item: { item }
    } = this.props;
    if (!item) {
      return;
    }
    try {
      await ItemActions.removeItem(item.id);
    } catch (error) {
      message.error('에러가 발생했습니다');
    }
  };
  private handleSubmit = async (itemId: number, data: IItemPutRequest) => {
    const { ItemActions } = this.props;
    try {
      await ItemActions.updateItem(itemId, data);
    } catch (error) {
      message.error('에러가 발생했습니다');
    }
    ItemActions.changeTab(Tab.Viewer);
  };

  public render(): React.ReactNode {
    const {
      item,
      itemPanel: { collapsed, tab }
    } = this.props.item;

    if (item == null) {
      return <div />;
    }
    return (
      <ItemPanel
        collapsed={collapsed}
        tab={tab}
        itemPanelHeader={
          <ItemPanelHeader
            tab={tab}
            handleClose={this.handleClose}
            handleTabChange={this.handleTabChange}
            handleRemove={this.handleRemove}
          />
        }
        itemViewer={<ItemViewer item={item} />}
        itemEditor={<ItemEditor item={item} handleSubmit={this.handleSubmit} />}
      />
    );
  }
}

const mapStateToProps = ({ item }: RootState) => ({
  item
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  ItemActions: bindActionCreators(itemActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemPanelContainer);
