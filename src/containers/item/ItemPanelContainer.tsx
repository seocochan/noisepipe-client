import * as React from 'react';
import { connect } from 'react-redux';

import { RadioChangeEvent } from 'antd/lib/radio';
import { ItemEditor, ItemPanel, ItemViewer } from 'components/item';
import ItemPanelHeader from 'components/item/ItemPanelHeader';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as itemActions, ItemState } from 'store/modules/item';

interface Props {
  item: ItemState;
  ItemActions: typeof itemActions;
}
interface State {
  tab: 'viewer' | 'editor';
}

class ItemPanelContainer extends React.Component<Props, State> {
  public readonly state: State = {
    tab: 'viewer'
  };

  private handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    const { ItemActions } = this.props;
    ItemActions.hidePanel();
    ItemActions.setItem(null);
  };
  private handleTabChange = (e: RadioChangeEvent) => {
    this.setState({ tab: e.target.value });
  };
  private handleSubmit = (values: any) => {
    console.log(values);
  };

  public render(): React.ReactNode {
    const {
      item,
      itemPanel: { collapsed }
    } = this.props.item;
    const { tab } = this.state;

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
