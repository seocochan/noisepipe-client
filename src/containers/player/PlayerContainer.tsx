import * as React from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';

import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as playerActions, PlayerState } from 'store/modules/player';

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

  private handleReady = () => {
    const { PlayerActions } = this.props;

    const duration = this.player.getDuration();
    if (duration !== 0) {
      // The following action is needed for properly set duration value,
      // when SC player is currently playing and user changes it to another SC player
      // (YT works fine without this action)
      PlayerActions.setDuration(duration);
    }
    PlayerActions.initialize();
  };

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
        url={currentItem.sourceUrl}
        ref={this.ref}
        playing={status.playing}
        onReady={this.handleReady}
        onDuration={duration => PlayerActions.setDuration(duration)}
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
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
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
