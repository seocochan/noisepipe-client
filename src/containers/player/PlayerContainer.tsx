import * as React from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';

import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { CollectionState } from 'store/modules/collection';
import { actions as playerActions, PlayerState } from 'store/modules/player';
import { Provider } from 'types';

const DEFAULT_MEDIA_URL = {
  [Provider.Youtube]: process.env.REACT_APP_DEFAULT_YT_MEDIA_URL,
  [Provider.Soundcloud]: process.env.REACT_APP_DEFAULT_SC_MEDIA_URL
};

interface Props {
  visible: boolean;
  target: Provider;
  PlayerActions: typeof playerActions;
  player: PlayerState;
  collection: CollectionState;
}

class PlayerContainer extends React.Component<Props, {}> {
  private player: ReactPlayer;
  private ref = (player: ReactPlayer | null) => {
    if (player == null) {
      return;
    }
    this.player = player;
  };

  public componentDidMount() {
    const { target, PlayerActions } = this.props;
    PlayerActions.setRef(target, this.player);
  }

  private handleReady = () => {
    const { target, PlayerActions, player } = this.props;
    if (player[target].item) {
      PlayerActions.play(target); // autoplay
    }
    const duration = this.player.getDuration();
    if (duration !== 0) {
      // The following action is needed for properly set duration value,
      // when SC player is currently playing and user changes it to another SC player
      // (YT works fine without this action)
      PlayerActions.setDuration(target, duration);
    }
    PlayerActions.initializePlayer(target);
  };

  public render(): React.ReactNode {
    const { visible, target, PlayerActions, player } = this.props;
    const { item, status } = player[target];

    return (
      <ReactPlayer
        key={target}
        url={item ? item.sourceUrl : DEFAULT_MEDIA_URL[target]}
        ref={this.ref}
        playing={status.playing}
        onReady={this.handleReady}
        onDuration={duration => PlayerActions.setDuration(target, duration)}
        onPlay={() => PlayerActions.play(target)}
        onPause={() => PlayerActions.pause(target)}
        onProgress={({ played, playedSeconds }) =>
          status.playing &&
          PlayerActions.updateProgress(target, played, playedSeconds)
        }
        onEnded={() => PlayerActions.playNextOrPrev(target)}
        config={{
          youtube: {
            playerVars: {
              controls: 1,
              autoplay: 1
            }
          },
          soundcloud: {
            options: {
              single_active: false,
              hide_related: true,
              auto_play: true
            }
          }
        }}
        width="100%"
        height="100%"
        style={{
          display: visible ? 'block' : 'none',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    );
  }
}

const mapStateToProps = ({ player, collection }: RootState) => ({
  player,
  collection
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  PlayerActions: bindActionCreators(playerActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerContainer);
