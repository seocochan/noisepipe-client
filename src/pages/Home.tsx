import * as React from 'react';

import { HomeContainer } from 'containers/home';

import styles from './Home.module.less';

const Home: React.FC<{}> = () => {
  return (
    <div className={styles.container}>
      <HomeContainer />
    </div>
  );
};

export default Home;
