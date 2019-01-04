import * as React from 'react';

import { Form } from 'antd';
import { IItemPutRequest, IItemResponse } from 'payloads';

import ItemEditorForm from './ItemEditorForm';

interface Props {
  item: IItemResponse;
  handleSubmit: (itemId: number, data: IItemPutRequest) => void;
}

const ItemEditor: React.SFC<Props> = ({ item, handleSubmit }) => {
  const WrappedItemEditorForm = Form.create()(ItemEditorForm);

  return (
    <div>
      <WrappedItemEditorForm item={item} handleSubmit={handleSubmit} />
    </div>
  );
};

export default ItemEditor;
