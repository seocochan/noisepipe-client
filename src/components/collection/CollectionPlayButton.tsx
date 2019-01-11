import * as React from 'react';

import { Button } from 'antd';

interface Props {
  isPlaying: boolean;
  isSet: boolean;
  onPause: () => void;
  onPlay: () => void;
  onResume: () => void;
}

const CollectionPlayButton: React.SFC<Props> = ({
  isPlaying,
  isSet,
  onPause,
  onPlay,
  onResume
}) => {
  const button = isPlaying ? (
    <Button icon="pause" shape="circle" onClick={() => onPause()} />
  ) : (
    <Button
      icon="caret-right"
      shape="circle"
      onClick={() => (isSet ? onResume() : onPlay())}
    />
  );
  return button;
};

export default CollectionPlayButton;
