import * as React from 'react';

import { Drawer } from 'antd';

import Player from './Player';

interface Props {
  visible: boolean;
  handleDrawerClose: () => void;
}

class PlayerDrawer extends React.Component<Props, {}> {
  public componentDidMount() {
    console.log('mount');
  }

  public render(): React.ReactNode {
    const { visible, handleDrawerClose } = this.props;

    return (
      <Drawer
        visible={visible}
        mask={false}
        placement="bottom"
        zIndex={2}
        onClose={() => handleDrawerClose()}
      >
        <Player />
      </Drawer>
    );
  }
}

export default PlayerDrawer;
