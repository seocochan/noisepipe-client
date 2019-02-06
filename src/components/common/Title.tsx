import * as React from 'react';

import styles from './Title.module.less';

interface Props {
  text: string;
  prefix?: React.ReactChild;
}

const Title: React.SFC<Props> = ({ text, prefix }) => {
  return (
    <div className={styles.container}>
      <h2>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <span>{text}</span>
      </h2>
    </div>
  );
};

export default Title;
