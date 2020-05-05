import * as React from 'react';

interface Props {
  style?: React.CSSProperties;
}

const DragIcon: React.FC<Props> = ({ style }) => {
  return (
    <i className="anticon" style={{ ...style }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" fill="currentColor" />
      </svg>
    </i>
  );
};

export default DragIcon;
