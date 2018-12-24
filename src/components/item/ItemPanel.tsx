import * as React from 'react';
import { connect } from 'react-redux';

import { Icon, Layout } from 'antd';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as baseActions, BaseState } from 'store/modules/base';

import styles from './ItemPanel.module.less';
import Player from './Player';

interface Props {
  base: BaseState;
  BaseActions: typeof baseActions;
}

class ItemPanel extends React.Component<Props, {}> {
  private handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    const { BaseActions } = this.props;
    BaseActions.hideItemPanel();
  };

  public render(): React.ReactNode {
    const { collapsed, item } = this.props.base.itemPanel;

    if (item == null) {
      return <div />;
    }

    return (
      <Layout.Sider
        className={styles.sider}
        collapsible={true}
        collapsed={collapsed}
        collapsedWidth={0}
        reverseArrow={true}
        trigger={null}
        theme={'light'}
        width={480}
        style={{ background: '#f9f9fa' }}
        // style={{ transition: 'width 0.2s, height 0.3s' }}
      >
        <div className={styles.menu}>
          <a className={styles.closeButton} onClick={this.handleClose}>
            <Icon type="arrow-left" />
          </a>
          <a>
            <Icon type="edit" />
          </a>
          <a>
            <Icon type="delete" />
          </a>
        </div>
        <div className={styles.content}>
          <span>{item.description}</span>
          <div className={styles.playerWrapper}>
            <Player />
          </div>
        </div>
      </Layout.Sider>
    );
  }
}

const mapStateToProps = ({ base }: RootState) => ({
  base
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  BaseActions: bindActionCreators(baseActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemPanel);
