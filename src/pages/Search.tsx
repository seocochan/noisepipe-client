import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { Tabs } from 'antd';
import { CollectionsContainer, ItemsContainer, UsersContainer } from 'containers/search';
import * as qs from 'qs';

import styles from './Search.module.less';

interface Props extends RouteComponentProps {}

const Search: React.FC<Props> = ({
  location: { pathname, search },
  history
}) => {
  const routes = {
    collections: '/search/collections',
    items: '/search/items',
    users: '/search/users'
  };

  let q = '';
  try {
    q = qs.parse(search, { ignoreQueryPrefix: true }).q.trim();
  } catch (error) {
    history.replace('/404');
  }
  if (q.length <= 0) {
    history.replace('/404');
  }

  return (
    <div className={styles.container}>
      <Tabs
        activeKey={pathname}
        size="large"
        onChange={activeKey => history.push(`${activeKey}${search}`)}
        animated={false}
      >
        <Tabs.TabPane tab="컬렉션" key={routes.collections}>
          <CollectionsContainer
            currentTab={pathname}
            tabName={routes.collections}
            q={q}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="아이템" key={routes.items}>
          <ItemsContainer currentTab={pathname} tabName={routes.items} q={q} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="사용자" key={routes.users}>
          <UsersContainer currentTab={pathname} tabName={routes.users} q={q} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Search;
