import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Tabs } from 'antd';

import styles from './CollectionIndex.module.less';

interface Props extends RouteComponentProps {}

const CollectionIndex: React.SFC<Props> = ({ location, history }) => {
  const routes = {
    collections: '/me/collections',
    bookmarks: '/me/bookmarks',
    comments: '/me/comments'
  };

  const handleChange = (activeKey: string) => {
    if (activeKey === routes.collections) {
      return history.push(routes.collections);
    }
    if (activeKey === routes.bookmarks) {
      return history.push(routes.bookmarks);
    }
    if (activeKey === routes.comments) {
      return history.push(routes.comments);
    }
  };

  return (
    <div className={styles.container}>
      <Tabs
        defaultActiveKey={location.pathname}
        size="large"
        onChange={handleChange}
        animated={false}
      >
        <Tabs.TabPane tab="컬렉션" key={routes.collections}>
          collections
        </Tabs.TabPane>
        <Tabs.TabPane tab="북마크" key={routes.bookmarks}>
          bookmarks
        </Tabs.TabPane>
        <Tabs.TabPane tab="댓글" key={routes.comments}>
          comments
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default CollectionIndex;
