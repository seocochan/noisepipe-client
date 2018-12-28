import * as React from 'react';

import { Layout } from 'antd';

import styles from './ItemPanel.module.less';

interface Props {
  collapsed: boolean;
  tab: 'viewer' | 'editor';
  itemPanelHeader: React.ReactChild;
  itemViewer: React.ReactChild;
  itemEditor: React.ReactChild;
}

const ItemPanel: React.SFC<Props> = ({
  collapsed,
  tab,
  itemPanelHeader,
  itemViewer,
  itemEditor
}) => {
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
      {itemPanelHeader}
      <div className={styles.container}>
        <div style={{ display: tab === 'viewer' ? 'block' : 'none' }}>
          {itemViewer}
        </div>
        <div style={{ display: tab === 'editor' ? 'block' : 'none' }}>
          {itemEditor}
        </div>
      </div>
    </Layout.Sider>
  );
};

export default ItemPanel;
