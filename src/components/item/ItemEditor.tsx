import * as React from 'react';

import { Form } from 'antd';
import { IItemPutRequest, IItemResponse } from 'payloads';

import ItemEditorForm from './ItemEditorForm';

interface Props {
  item: IItemResponse;
  items: IItemResponse[];
  handleSubmit: (itemId: number, data: IItemPutRequest) => void;
}

const ItemEditor: React.FC<Props> = ({ item, items, handleSubmit }) => {
  const WrappedItemEditorForm = Form.create()(ItemEditorForm);

  return (
    <div>
      <WrappedItemEditorForm item={item} items={items} handleSubmit={handleSubmit} />
    </div>
  );
};

export default ItemEditor;
