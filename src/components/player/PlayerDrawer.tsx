import * as React from 'react';

import { Drawer } from 'antd';
import { PlayersContainer } from 'containers/player';

// import styles from './PlayerDrawer.module.less';

interface Props {
  visible: boolean;
  handleDrawerClose: () => void;
}

class PlayerDrawer extends React.Component<Props, {}> {
  public render(): React.ReactNode {
    const { visible, handleDrawerClose } = this.props;

    return (
      <Drawer
        visible={visible}
        mask={true}
        placement="bottom"
        zIndex={2}
        onClose={() => handleDrawerClose()}
      >
        <PlayersContainer />
      </Drawer>
    );
  }
}

export default PlayerDrawer;
