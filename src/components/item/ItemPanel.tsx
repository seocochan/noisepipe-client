import * as React from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';

import { Icon, Layout } from 'antd';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as baseActions, BaseState } from 'store/modules/base';

import styles from './ItemPanel.module.less';

interface Props {
  base: BaseState;
  BaseActions: typeof baseActions;
}

interface State {
  playing: boolean;
}

class ItemPanel extends React.Component<Props, State> {
  public readonly state: State = {
    playing: false
  };

  private player: ReactPlayer;

  private handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    const { BaseActions } = this.props;
    BaseActions.hideItemPanel();
  };
  private handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    this.player.seekTo(50);
  };
  private handleClickPlay = (e: React.MouseEvent) => {
    e.preventDefault();
    const { playing } = this.state;
    this.setState({ playing: !playing });
  };
  private handlePlay = () => {
    this.setState({ playing: true });
  };
  private handlePause = () => {
    this.setState({ playing: false });
  };

  private ref = (player: ReactPlayer | null) => {
    if (player == null) {
      return;
    }
    this.player = player;
  };

  public render(): React.ReactNode {
    const { collapsed, item } = this.props.base.itemPanel;
    const { playing } = this.state;

    if (item == null) {
      return <div/>;
    }

    return (
      <Layout.Sider
        className={styles.sider}
        collapsible={true}
        collapsed={collapsed}
        collapsedWidth={0}
        reverseArrow={true}
        trigger={null}
        theme={'light'}
        width={480}
        style={{ background: '#f9f9fa' }}
        // style={{ transition: 'width 0.2s, height 0.3s' }}
      >
        <div className={styles.menu}>
          <a className={styles.closeButton} onClick={this.handleClose}>
            <Icon type="arrow-left" />
          </a>
          <a>
            <Icon type="edit" />
          </a>
          <a>
            <Icon type="delete" />
          </a>
        </div>
        <div className={styles.content}>
          <span>{item.description}</span>
          <div className={styles.playerWrapper}>
            <ReactPlayer
              className={styles.player}
              playing={playing}
              onReady={() =>
                item.startAt != null ? this.player.seekTo(item.startAt) : null
              }
              onPlay={this.handlePlay}
              onPause={this.handlePause}
              config={{
                youtube: {
                  playerVars: { controls: 1 }
                }
              }}
              url={item.sourceUrl}
              width="100%"
              height="100%"
              ref={this.ref}
            />
          </div>
          <button onClick={this.handleClick}>test</button>
          <button onClick={this.handleClickPlay}>{playing ? '||' : '>'}</button>
        </div>
      </Layout.Sider>
    );
  }
}

const mapStateToProps = ({ base }: RootState) => ({
  base
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  BaseActions: bindActionCreators(baseActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemPanel);
