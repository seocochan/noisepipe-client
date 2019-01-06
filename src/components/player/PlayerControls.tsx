import * as React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';

import { Button, Layout } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as itemActions } from 'store/modules/item';
import { actions as playerActions, PlayerState } from 'store/modules/player';

import styles from './PlayerControls.module.less';
import PlayerDrawer from './PlayerDrawer';
import SeekBar from './SeekBar';

interface Props {
  ItemActions: typeof itemActions;
  player: PlayerState;
  PlayerActions: typeof playerActions;
}

class PlayerControls extends React.Component<Props, {}> {
  private seekTo = (seconds: number) => {
    const { player } = this.props;
    if (!player.ref) {
      return;
    }
    player.ref.seekTo(seconds);
  };

  public componentWillUnmount() {
    this.props.PlayerActions.setDrawerVisible(false);
  }

  public render(): React.ReactNode {
    const { player, PlayerActions, ItemActions } = this.props;

    if (!player.currentItem) {
      return <div />;
    }
    return (
      <Layout.Footer>
        <SeekBar
          duration={Math.floor(player.status.duration)}
          playedSeconds={player.status.playedSeconds}
          seekTo={this.seekTo}
        />
        <div className={styles.container}>
          <div className={styles.controls}>
            <ButtonGroup>
              <MediaQuery minWidth={769}>
                <Button icon="step-backward" size="large" />
              </MediaQuery>
              {player.status.playing ? (
                <Button
                  icon="pause"
                  size="large"
                  onClick={() => PlayerActions.pause()}
                />
              ) : (
                <Button
                  icon="caret-right"
                  size="large"
                  onClick={() => PlayerActions.play()}
                />
              )}
              <MediaQuery minWidth={769}>
                <Button icon="step-forward" size="large" />
              </MediaQuery>
            </ButtonGroup>
          </div>
          <div className={styles.title}>
            <a
              onClick={() => {
                ItemActions.showPanel();
                ItemActions.setItem(player.currentItem);
              }}
            >
              {player.currentItem.title}
            </a>
          </div>
          <div className={styles.controls}>
            <ButtonGroup>
              <MediaQuery minWidth={769}>
                {player.drawer.visible ? (
                  <Button
                    icon="down"
                    size="large"
                    onClick={() => PlayerActions.setDrawerVisible(false)}
                  />
                ) : (
                  <Button
                    icon="up"
                    size="large"
                    onClick={() => PlayerActions.setDrawerVisible(true)}
                  />
                )}
              </MediaQuery>
              <Button
                icon="close"
                size="large"
                onClick={() => PlayerActions.stop()}
              />
            </ButtonGroup>
          </div>
        </div>
        <PlayerDrawer
          visible={player.drawer.visible}
          handleDrawerClose={() => PlayerActions.setDrawerVisible(false)}
        />
      </Layout.Footer>
    );
  }
}

const mapStateToProps = ({ player }: RootState) => ({
  player
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  ItemActions: bindActionCreators(itemActions, dispatch),
  PlayerActions: bindActionCreators(playerActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerControls);
