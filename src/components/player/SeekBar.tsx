import * as React from 'react';

import { Slider } from 'antd';

import styles from './SeekBar.module.less';

interface Props {
  duration: number;
  playedSeconds: number;
  seekTo: (seconds: number) => void;
}
interface State {
  dragging: boolean;
  value: number;
}

class SeekBar extends React.Component<Props, State> {
  private slider: Slider;
  public readonly state: State = {
    dragging: false,
    value: 0
  };

  public componentDidUpdate(prevProps: Props) {
    const { playedSeconds } = this.props;
    const { dragging } = this.state;
    if (dragging) {
      return;
    }
    if (prevProps.playedSeconds !== playedSeconds) {
      this.setState({ value: playedSeconds });
    }
  }

  private handleChange = (value: number) => {
    this.setState({ dragging: true, value });
  };
  private handleAfterChange = (value: number) => {
    const { seekTo } = this.props;
    seekTo(value);
    this.setState({ dragging: false });
    this.slider.blur();
  };
  private formatTipValue = (value: number) => {
    const minutes = Math.trunc(value / 60);
    const seconds = `0${value % 60}`.slice(-2);
    return `${minutes}:${seconds}`;
  };

  public render(): React.ReactNode {
    const { duration } = this.props;
    const { value } = this.state;

    return (
      <Slider
        className={styles.seekBar}
        max={duration}
        value={value}
        onChange={this.handleChange}
        onAfterChange={this.handleAfterChange}
        tipFormatter={this.formatTipValue}
        ref={(slider: Slider) => {
          this.slider = slider;
        }}
      />
    );
  }
}

export default SeekBar;
