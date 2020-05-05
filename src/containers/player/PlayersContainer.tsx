import * as React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as playerActions, PlayerState } from 'store/modules/player';
import { Provider } from 'types';

import PlayerContainer from './PlayerContainer';

interface Props {
  PlayerActions: typeof playerActions;
  player: PlayerState;
}

class PlayersContainer extends React.Component<Props, {}> {
  public render(): React.ReactNode {
    const {
      player: { currentTarget, loading },
    } = this.props;

    return (
      <>
        {Object.keys(Provider).map((key) => (
          <PlayerContainer
            key={Provider[key]}
            visible={!loading && currentTarget === Provider[key]}
            target={Provider[key]}
          />
        ))}
      </>
    );
  }
}

const mapStateToProps = ({ player }: RootState) => ({
  player,
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  PlayerActions: bindActionCreators(playerActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayersContainer);
