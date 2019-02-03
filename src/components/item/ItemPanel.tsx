import * as React from 'react';

import { Layout } from 'antd';
import { Tab } from 'types';

import styles from './ItemPanel.module.less';

interface Props {
  collapsed: boolean;
  tab: Tab;
  itemPanelHeader: React.ReactChild;
  itemViewer: React.ReactChild;
  itemEditor: React.ReactChild;
}

const ItemPanel: React.FC<Props> = ({
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
      width={'640'}
      style={{ background: '#f9f9fa', transition: 'none' }}
      // style={{ transition: 'width 0.2s, height 0.3s' }}
    >
      {itemPanelHeader}
      <div className={styles.container}>
        <div style={{ display: tab === Tab.Viewer ? 'block' : 'none' }}>
          {itemViewer}
        </div>
        <div style={{ display: tab === Tab.Editor ? 'block' : 'none' }}>
          {itemEditor}
        </div>
      </div>
    </Layout.Sider>
  );
};

export default ItemPanel;
