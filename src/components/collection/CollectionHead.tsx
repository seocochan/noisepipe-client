import * as React from 'react';

import { LoadingIndicator } from 'components/common';
import { ICollectionResponse } from 'payloads';


interface Props {
  collection: ICollectionResponse | null;
}

const CollectionHead: React.SFC<Props> = ({ collection }) => {
  // console.log(collection);
  return collection ? <div>{collection.title}</div> : <LoadingIndicator />;
};

export default CollectionHead;
