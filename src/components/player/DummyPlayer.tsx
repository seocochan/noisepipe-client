import * as React from 'react';
import ReactPlayer from 'react-player';

interface Props {}
interface State {
  loading: boolean;
}

/**
 * This component is for loading initial AudioContext of SoundCloud.
 */

class DummyPlayer extends React.Component<Props, State> {
  public readonly state: State = {
    loading: true,
  };

  public render(): React.ReactNode {
    if (!this.state.loading) {
      return <div />;
    }
    return (
      <ReactPlayer
        url={process.env.REACT_APP_DEFAULT_SC_MEDIA_URL}
        config={{
          soundcloud: {
            options: { single_active: false, hide_related: true },
          },
        }}
        onReady={() => this.setState({ loading: false })}
        height={0} // hide
      />
    );
  }
}

export default DummyPlayer;
