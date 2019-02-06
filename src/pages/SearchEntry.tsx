import * as React from 'react';

import { SearchInput } from 'components/common';

import styles from './SearchEntry.module.less';

const SearchEntry: React.FC<{}> = () => {
  return (
    <div className={styles.container}>
      <SearchInput autoFocus={true} large={true} />
    </div>
  );
};

export default SearchEntry;
