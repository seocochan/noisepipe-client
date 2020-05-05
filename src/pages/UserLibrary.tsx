import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { Tabs } from 'antd';
import { BookmarksContainer, CollectionsContainer, CommentsContainer } from 'containers/userLibrary';

import styles from './UserLibrary.module.less';

interface Props extends RouteComponentProps<{ username: string }> {}

const UserLibrary: React.FC<Props> = ({
  location: { pathname },
  match: {
    params: { username },
  },
  history,
}) => {
  const routes = {
    collections: `/${username}/collections`,
    bookmarks: `/${username}/bookmarks`,
    comments: `/${username}/comments`,
  };

  if (!username.startsWith('@')) {
    return <Redirect to="/404" />;
  }
  return (
    <div className={styles.container}>
      <Tabs activeKey={pathname} size="large" onChange={(activeKey) => history.push(activeKey)} animated={false}>
        <Tabs.TabPane tab="컬렉션" key={routes.collections}>
          <CollectionsContainer currentTab={pathname} tabName={routes.collections} username={username.slice(1)} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="북마크" key={routes.bookmarks}>
          <BookmarksContainer currentTab={pathname} tabName={routes.bookmarks} username={username.slice(1)} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="댓글" key={routes.comments}>
          <CommentsContainer currentTab={pathname} tabName={routes.comments} username={username.slice(1)} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default UserLibrary;
