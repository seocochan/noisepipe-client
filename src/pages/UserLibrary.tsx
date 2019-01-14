import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { Tabs } from 'antd';
import { BookmarksContainer, CollectionsContainer, CommentsContainer } from 'containers/userLibrary';

import styles from './UserLibrary.module.less';

interface Props extends RouteComponentProps<{ username: string }> {}

const UserLibrary: React.SFC<Props> = ({
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
        activeKey={pathname}
        size="large"
        onChange={handleChange}
        animated={false}
      >
        <Tabs.TabPane tab="컬렉션" key={routes.collections}>
          <CollectionsContainer username={username.slice(1)} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="북마크" key={routes.bookmarks}>
          <BookmarksContainer />
        </Tabs.TabPane>
        <Tabs.TabPane tab="댓글" key={routes.comments}>
          <CommentsContainer />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default UserLibrary;
