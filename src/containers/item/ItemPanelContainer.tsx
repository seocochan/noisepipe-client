import * as React from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';

import { List, message } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { CueForm, CueListHeader, CueListItem, CueSection } from 'components/cue';
import { ItemEditor, ItemPanel, ItemViewer } from 'components/item';
import ItemPanelHeader from 'components/item/ItemPanelHeader';
import { ICueRequest, ICueResponse, IItemPutRequest } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { AuthState } from 'store/modules/auth';
import { actions as itemActions, ItemState } from 'store/modules/item';
import { Tab } from 'types';
import { DEFAULT_ERROR_MESSAGE } from 'values';

interface Props {
  currentUser: AuthState['currentUser'];
  item: ItemState;
  ItemActions: typeof itemActions;
}

class ItemPanelContainer extends React.Component<Props, {}> {
  public componentDidUpdate(prevProps: Props) {
    const {
      ItemActions,
      item: { item }
    } = this.props;
    const {
      item: { item: prevItem }
    } = prevProps;
    if ((!prevItem && item) || (prevItem && item && prevItem.id !== item.id)) {
      ItemActions.loadCues(item.id);
    }
  }

  private player: ReactPlayer;
  private playerRef = (player: ReactPlayer | null) => {
    if (player == null) {
      return;
    }
    this.player = player;
  };
  private handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    const { ItemActions } = this.props;
    ItemActions.initialize();
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
      message.error(DEFAULT_ERROR_MESSAGE);
    }
  };
  private handleSubmit = async (itemId: number, data: IItemPutRequest) => {
    const { ItemActions } = this.props;
    try {
      await ItemActions.updateItem(itemId, data);
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
    }
    ItemActions.changeTab(Tab.Viewer);
  };
  private getCurrentSeconds = () => {
    const seconds = this.player.getCurrentTime();
    return seconds == null ? 0 : Math.trunc(seconds);
  };
  private handleCueClick = (seconds: number) => {
    this.player.seekTo(seconds);
  };
  private handleCreateCue = async (itemId: number, data: ICueRequest) => {
    const { ItemActions } = this.props;
    try {
      await ItemActions.createCue(itemId, data);
    } catch (error) {
      throw error;
    }
  };
  private handleUpdateCue = async (cueId: number, data: ICueRequest) => {
    const { ItemActions } = this.props;
    try {
      await ItemActions.updateCue(cueId, data);
    } catch (error) {
      throw error;
    }
  };
  private handleRemoveCue = async (itemId: number) => {
    const { ItemActions } = this.props;
    try {
      await ItemActions.removeCue(itemId);
    } catch (error) {
      throw error;
    }
  };

  public render(): React.ReactNode {
    const {
      currentUser,
      item: {
        itemPanel: { collapsed, tab },
        item,
        cues
      }
    } = this.props;

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
            showEditables={
              currentUser ? currentUser.id === item.createdBy : false
            }
            handleClose={this.handleClose}
            handleTabChange={this.handleTabChange}
            handleRemove={this.handleRemove}
          />
        }
        itemViewer={
          <ItemViewer
            item={item}
            playerRef={this.playerRef}
            cueSection={
              cues && (
                <CueSection>
                  <CueListHeader
                    count={cues.length}
                    showEditables={
                      currentUser ? currentUser.id === item.createdBy : false
                    }
                    renderCueForm={props => (
                      <CueForm
                        submitPlaceholder="추가"
                        showCancel={true}
                        onSubmit={async data =>
                          this.handleCreateCue(item.id, data)
                        }
                        onLoadSeconds={this.getCurrentSeconds}
                        {...props}
                      />
                    )}
                  />
                  <List
                    dataSource={cues}
                    renderItem={(cue: ICueResponse) => (
                      <CueListItem
                        key={cue.id}
                        cue={cue}
                        showEditables={
                          currentUser
                            ? currentUser.id === item.createdBy
                            : false
                        }
                        renderCueForm={props => (
                          <CueForm
                            submitPlaceholder="수정"
                            showCancel={true}
                            onSubmit={async data =>
                              this.handleUpdateCue(cue.id, data)
                            }
                            cue={cue}
                            {...props}
                          />
                        )}
                        onClick={() => this.handleCueClick(cue.seconds)}
                        onRemove={async () => this.handleRemoveCue(cue.id)}
                      />
                    )}
                  />
                </CueSection>
              )
            }
          />
        }
        itemEditor={<ItemEditor item={item} handleSubmit={this.handleSubmit} />}
      />
    );
  }
}

const mapStateToProps = ({ auth, item }: RootState) => ({
  currentUser: auth.currentUser,
  item
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  ItemActions: bindActionCreators(itemActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemPanelContainer);
