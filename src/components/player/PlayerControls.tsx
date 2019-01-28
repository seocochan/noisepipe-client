import * as React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';

import { Button, Icon, Layout } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import { SoundCloudIcon } from 'icons';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as playerActions, PlayerState } from 'store/modules/player';
import { Provider } from 'types';

import styles from './PlayerControls.module.less';
import PlayerDrawer from './PlayerDrawer';
import SeekBar from './SeekBar';

const iconStyles = {
  fontSize: 21,
  color: '#333',
  marginRight: 4
};

interface Props {
  player: PlayerState;
  PlayerActions: typeof playerActions;
}

class PlayerControls extends React.Component<Props, {}> {
  public componentWillUnmount() {
    this.props.PlayerActions.setDrawerVisible(false);
  }

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
  private handleBackward = () => {
    const { player, PlayerActions } = this.props;
    const { currentTarget } = player;
    if (!currentTarget) {
      return;
    }
    if (player[currentTarget].status.playedSeconds <= 3) {
      PlayerActions.playNextOrPrev(currentTarget, false);
    } else {
      this.seekTo(0);
    }
  };

  public render(): React.ReactNode {
    const { player, PlayerActions } = this.props;
    const { currentTarget, loading, drawer } = player;
    const disabled = loading || !currentTarget;

    return (
      <Layout.Footer>
        <SeekBar
          disabled={disabled}
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
              <Button
                disabled={disabled}
                icon="step-backward"
                size="large"
                onClick={this.handleBackward}
              />
              {currentTarget && player[currentTarget].status.playing ? (
                <Button
                  disabled={disabled}
                  icon="pause"
                  size="large"
                  onClick={() => PlayerActions.pause(currentTarget)}
                />
              ) : (
                <Button
                  disabled={disabled}
                  icon="caret-right"
                  size="large"
                  onClick={() =>
                    currentTarget && PlayerActions.play(currentTarget)
                  }
                />
              )}
              <Button
                disabled={disabled}
                icon="step-forward"
                size="large"
                onClick={() =>
                  currentTarget && PlayerActions.playNextOrPrev(currentTarget)
                }
              />
            </ButtonGroup>
          </div>
          <div className={styles.title}>
            {currentTarget && player[currentTarget].item ? (
              <div className={styles.titleContainer}>
                <a
                  href={player[currentTarget].item!.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ lineHeight: 0 }}
                >
                  {player[currentTarget].item!.sourceProvider ===
                  Provider.Youtube ? (
                    <Icon type="youtube" theme="filled" style={iconStyles} />
                  ) : (
                    <SoundCloudIcon style={iconStyles} />
                  )}
                </a>
                <a
                  onClick={() => {
                    PlayerActions.setDrawerVisible(!drawer.visible);
                  }}
                >
                  <span>{player[currentTarget].item!.title}</span>
                </a>
              </div>
            ) : (
              ''
            )}
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
                onClick={() => PlayerActions.close()}
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
