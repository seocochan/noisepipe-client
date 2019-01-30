import * as React from 'react';
import ReactPlayer from 'react-player';

import { Divider, Icon } from 'antd';
import { SoundCloudIcon } from 'icons';
import * as moment from 'moment';
import { IItemResponse } from 'payloads';
import { Provider } from 'types';

import styles from './ItemViewer.module.less';

const iconStyles = {
  color: '#333',
  marginRight: 8
};

interface Props {
  item: IItemResponse;
  playerRef: (player: any) => void;
  cueSection: React.ReactNode;
}

const ItemViewer: React.SFC<Props> = ({ item, playerRef, cueSection }) => {
  return (
    <div>
      <div className={styles.contentHeader}>
        <div className={styles.tags}>
          {item.tags.map((tag, index) => (
            <span key={index}>{`#${tag}`}</span>
          ))}
        </div>
        <div>
          <span>{moment(item.createdAt).format('ll')}</span>
        </div>
      </div>
      <div className={styles.title}>
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
          <h1>
            {item.sourceProvider === Provider.Youtube ? (
              <Icon type="youtube" theme="filled" style={iconStyles} />
            ) : (
              <SoundCloudIcon style={iconStyles} />
            )}
            <span>{item.title}</span>
          </h1>
        </a>
      </div>
      <div className={styles.playerWrapper}>
        <ReactPlayer
          url={item.sourceUrl}
          ref={playerRef}
          config={{
            youtube: {
              playerVars: { controls: 1 }
            },
            soundcloud: {
              options: { single_active: false }
            }
          }}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          // FIXME: change to controlled component
        />
      </div>
      <article className={styles.description}>
        {item.description ? item.description : <i>{'설명이 없습니다'}</i>}
      </article>
      <Divider style={{ background: 'transparent' }} />
      {cueSection}
    </div>
  );
};

export default ItemViewer;
