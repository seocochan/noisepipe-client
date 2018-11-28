import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { CollectionItemsContainer } from 'containers/collection';

import styles from './Collection.module.less';

interface Props extends RouteComponentProps<{ collectionId: string }> {}

const Collection: React.SFC<Props> = ({ match }) => {
  return (
    <div className={styles.container}>
      <CollectionItemsContainer
        collectionId={Number.parseInt(match.params.collectionId, 10)}
      />
    </div>
  );
};

export default Collection;
