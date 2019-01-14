import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { Tabs } from 'antd';

import styles from './CollectionIndex.module.less';

interface Props extends RouteComponentProps<{ username: string }> {}

const CollectionIndex: React.SFC<Props> = ({
  location: { pathname },
  match: {
    params: { username }
  },
  history
}) => {
  const routes = {
    collections: `/${username}/collections`,
    bookmarks: `/${username}/bookmarks`,
    comments: `/${username}/comments`
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
  if (!username.startsWith('@')) {
    return <Redirect to="/404" />;
  }

  return (
    <div className={styles.container}>
      <Tabs
        defaultActiveKey={pathname}
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
