import * as React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';

import { Button, Layout } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as playerActions, PlayerState } from 'store/modules/player';

import styles from './PlayerControls.module.less';
import PlayerDrawer from './PlayerDrawer';
import SeekBar from './SeekBar';

interface Props {
  player: PlayerState;
  PlayerActions: typeof playerActions;
}

class PlayerControls extends React.Component<Props, {}> {
  private seekTo = (seconds: number) => {
    const { player } = this.props;
    const { currentTarget } = player;

    if (currentTarget == null) {
      return;
    }
    if (!player[currentTarget].ref) {
      return;
    }
    player[currentTarget].ref!.seekTo(seconds);
  };

  public componentWillUnmount() {
    this.props.PlayerActions.setDrawerVisible(false);
  }

  public render(): React.ReactNode {
    const { player, PlayerActions } = this.props;
    const { currentTarget, drawer } = player;

    return (
      <Layout.Footer>
        <SeekBar
          disabled={currentTarget == null} // FIXME: load 중인 미디어가 있을 때도 true
          duration={
            currentTarget && Math.floor(player[currentTarget].status.duration)
          }
          playedSeconds={
            currentTarget && player[currentTarget].status.playedSeconds
          }
          seekTo={this.seekTo}
        />
        <div className={styles.container}>
          <div className={styles.controls}>
            <ButtonGroup>
              <MediaQuery minWidth={769}>
                <Button
                  disabled={!currentTarget}
                  icon="step-backward"
                  size="large"
                  onClick={() =>
                    currentTarget &&
                    PlayerActions.playNextOrPrev(currentTarget, false)
                  }
                />
              </MediaQuery>
              {currentTarget && player[currentTarget].status.playing ? (
                <Button
                  disabled={!currentTarget}
                  icon="pause"
                  size="large"
                  onClick={() => PlayerActions.pause(currentTarget)}
                />
              ) : (
                <Button
                  disabled={!currentTarget}
                  icon="caret-right"
                  size="large"
                  onClick={() =>
                    currentTarget && PlayerActions.play(currentTarget)
                  }
                />
              )}
              <MediaQuery minWidth={769}>
                <Button
                  disabled={!currentTarget}
                  icon="step-forward"
                  size="large"
                  onClick={() =>
                    currentTarget && PlayerActions.playNextOrPrev(currentTarget)
                  }
                />
              </MediaQuery>
            </ButtonGroup>
          </div>
          <div className={styles.title}>
            <a
              onClick={() => {
                PlayerActions.setDrawerVisible(!drawer.visible);
              }}
            >
              {currentTarget && player[currentTarget].item
                ? player[currentTarget].item!.title
                : ''}
            </a>
          </div>
          <div className={styles.controls}>
            <ButtonGroup>
              <MediaQuery minWidth={769}>
                {player.drawer.visible ? (
                  <Button
                    disabled={!currentTarget}
                    icon="down"
                    size="large"
                    onClick={() => PlayerActions.setDrawerVisible(false)}
                  />
                ) : (
                  <Button
                    disabled={!currentTarget}
                    icon="up"
                    size="large"
                    onClick={() => PlayerActions.setDrawerVisible(true)}
                  />
                )}
              </MediaQuery>
              <Button
                disabled={!currentTarget}
                icon="close"
                size="large"
                onClick={() => PlayerActions.initialize()}
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
  PlayerActions: bindActionCreators(playerActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerControls);
