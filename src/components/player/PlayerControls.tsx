import * as React from 'react';
import { connect } from 'react-redux';

import { Button } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as itemActions } from 'store/modules/item';
import { actions as playerActions, PlayerState } from 'store/modules/player';

import styles from './PlayerControls.module.less';
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

  public render(): React.ReactNode {
    const { player, PlayerActions, ItemActions } = this.props;

    if (!player.currentItem) {
      return <div />;
    }
    return (
      <div className={styles.container}>
        <div className={styles.title}>
          <a
            onClick={() => {
              ItemActions.showPanel();
              ItemActions.setItem(player.currentItem);
            }}
          >
            {player.currentItem.title}
          </a>
          <SeekBar
            duration={Math.floor(player.status.duration)}
            playedSeconds={player.status.playedSeconds}
            seekTo={this.seekTo}
          />
        </div>
        <div className={styles.controls}>
          <ButtonGroup>
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
            <Button
              icon="close"
              size="large"
              onClick={() => PlayerActions.stop()}
            />
          </ButtonGroup>
        </div>
      </div>
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
