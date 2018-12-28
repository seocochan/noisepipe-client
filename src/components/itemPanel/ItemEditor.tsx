import * as React from 'react';

import { IItemResponse } from 'payloads';

import ItemEditorForm from './ItemEditorForm';

/**
 * TODO:
 * 액션 호출, 데이터 주입,
 * submit 핸들러 정의 등
 * 이 컨테이너에 구현
 */

interface Props {
  item: IItemResponse;
}

const ItemEditor: React.SFC<Props> = ({ item }) => {
  return (
    <div>
      <ItemEditorForm item={item} />
    </div>
  );
};

export default ItemEditor;
