import { arrayMove } from 'react-sortable-hoc';

import { IItemResponse } from 'payloads';
import { ITEM_POSITION_UNIT } from 'values';

// TODO:
// - 아래의 경우에 현재 collection의 모든 item.position 값을 새로 업데이트하기
//     1) 새로 업데이트 될 position 값과 주변 요소의 position 값의 차이가 아주 작을 때 (0.5 이하?)
//     2) 새로 업데이트 될 position 값의 크기가 number의 최대값에 가까울 때
// - 참고 사항:
//     1) 여러 row의 특정 column 값을 order에 기반한 서로 다른 값으로 한번에 update 하는 쿼리 작성
//     2) 위의 동작 처리 중, 다른 position 업데이트 요청이 왔을 때 발생 가능한 문제 검토
//     3) 2에서 문제가 있다면 1 처리 중 2를 방지할 방안 마련
export const updatePosition = (
  items: IItemResponse[],
  oldIndex: number,
  newIndex: number
) => {
  let newPosition: number;
  if (newIndex === 0) {
    newPosition = items[newIndex].position / 2;
  } else if (newIndex === items.length - 1) {
    newPosition = items[newIndex].position + ITEM_POSITION_UNIT;
  } else if (oldIndex < newIndex) {
    newPosition = (items[newIndex].position + items[newIndex + 1].position) / 2;
  } else {
    /* oldIndex > newIndex */
    newPosition = (items[newIndex].position + items[newIndex - 1].position) / 2;
  }
  const oldItem = items[oldIndex];
  const newItem = { ...oldItem, position: newPosition };
  const newItems = arrayMove(items, oldIndex, newIndex);
  newItems[newIndex] = newItem;

  return { newItems, newPosition };
};

export const getNewPosition = (items: IItemResponse[]) => {
  const { length } = items;
  return length === 0
    ? ITEM_POSITION_UNIT - 1
    : items[length - 1].position + ITEM_POSITION_UNIT;
};

export const secondsToString = (value: number) => {
  const minutes = Math.trunc(value / 60);
  const seconds = `0${value % 60}`.slice(-2);
  return `${minutes}:${seconds}`;
};

export const stringToSeconds = (value: string) => {
  const [minutes, seconds] = value.split(':');
  return parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
};
