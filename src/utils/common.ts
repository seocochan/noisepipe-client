import { arrayMove } from 'react-sortable-hoc';

import { IItemResponse } from 'payloads';
import { ITEM_POSITION_UNIT, MAX_ITEM_POSITION_VALUE, MIN_ITEM_POSITION_INTERVAL } from 'values';

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
  const interval = Math.abs(newPosition - items[newIndex].position);
  const oldItem = items[oldIndex];
  const newItem = { ...oldItem, position: newPosition };
  const newItems = arrayMove(items, oldIndex, newIndex);
  newItems[newIndex] = newItem;
  const needReset =
    interval <= MIN_ITEM_POSITION_INTERVAL ||
    newPosition >= MAX_ITEM_POSITION_VALUE;

  return { newItems, newPosition, needReset };
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
