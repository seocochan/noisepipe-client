import * as React from 'react';
import { connect } from 'react-redux';

import { Icon, Layout, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as baseActions, BaseState } from 'store/modules/base';

import ItemEditor from './ItemEditor';
import styles from './ItemPanel.module.less';
import ItemViewer from './ItemViewer';

interface Props {
  base: BaseState;
  BaseActions: typeof baseActions;
}
interface State {
  tab: 'viewer' | 'editor';
}

class ItemPanel extends React.Component<Props, State> {
  public readonly state: State = {
    tab: 'viewer'
  };

  private handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    const { BaseActions } = this.props;
    BaseActions.hideItemPanel();
  };
  private handleTabChange = (e: RadioChangeEvent) => {
    this.setState({ tab: e.target.value });
  };

  public render(): React.ReactNode {
    const { collapsed, item } = this.props.base.itemPanel;
    const { tab } = this.state;

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
        width={640}
        style={{ background: '#f9f9fa' }}
        // style={{ transition: 'width 0.2s, height 0.3s' }}
      >
        <div className={styles.menu}>
          <a className={styles.iconButton} onClick={this.handleClose}>
            <Icon type="arrow-left" />
          </a>
          <div className={styles.innerMenu}>
            <Radio.Group
              size="small"
              value={tab}
              onChange={this.handleTabChange}
            >
              <Radio.Button value="viewer">보기</Radio.Button>
              <Radio.Button value="editor">수정</Radio.Button>
            </Radio.Group>
          </div>
          <div className={styles.innerMenu}>
            <a className={styles.iconButton}>
              <Icon type="delete" />
            </a>
          </div>
        </div>
        {/* Menu ends here */}
        <div className={styles.container}>
          <div style={{ display: tab === 'viewer' ? 'block' : 'none' }}>
            <ItemViewer item={item} />
          </div>
          <div style={{ display: tab === 'editor' ? 'block' : 'none' }}>
            <ItemEditor item={item} />
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
