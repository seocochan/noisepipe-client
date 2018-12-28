import * as React from 'react';

import { IItemResponse } from 'payloads';

import ItemEditorForm from './ItemEditorForm';

interface Props {
  item: IItemResponse;
  handleSubmit: (values: any) => void;
}

const ItemEditor: React.SFC<Props> = ({ item, handleSubmit }) => {
  return (
    <div>
      <ItemEditorForm item={item} handleSubmit={handleSubmit} />
    </div>
  );
};

export default ItemEditor;
