import * as React from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';

import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as playerActions, PlayerState } from 'store/modules/player';

import styles from './Player.module.less';

interface Props {
  PlayerActions: typeof playerActions;
  player: PlayerState;
}

class Player extends React.Component<Props, {}> {
  private player: ReactPlayer;
  private ref = (player: ReactPlayer | null) => {
    if (player == null) {
      return;
    }
    this.player = player;
  };

  public componentDidMount() {
    const { PlayerActions } = this.props;
    PlayerActions.setRef(this.player);
  }
  public componentDidUpdate(prevProps: Props) {
    const { player, PlayerActions } = this.props;
    if (prevProps.player.currentItem !== player.currentItem) {
      PlayerActions.pause();
    }
  }

  public render(): React.ReactNode {
    const {
      PlayerActions,
      player: { currentItem, status }
    } = this.props;

    if (currentItem == null) {
      return <div />;
    }
    return (
      <ReactPlayer
        className={styles.player}
        playing={status.playing}
        onReady={() => PlayerActions.initialize(this.player.getDuration())}
        onPlay={() => PlayerActions.play()}
        onPause={() => PlayerActions.pause()}
        onProgress={({ played, playedSeconds }) =>
          status.playing && PlayerActions.updateProgress(played, playedSeconds)
        }
        config={{
          youtube: {
            playerVars: { controls: 1 }
          }
        }}
        url={currentItem.sourceUrl}
        width="100%"
        height="100%"
        ref={this.ref}
      />
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
)(Player);
