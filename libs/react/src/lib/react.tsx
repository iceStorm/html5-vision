// import { MediaStreamConstraints } from 'webrtc';

import { useEffect } from 'react';
import styles from './react.module.scss';

/* eslint-disable-next-line */
export interface ReactProps {}

export function React(props: ReactProps) {
  useEffect(() => {
    //
  }, []);

  return (
    <div className={styles['container']}>
      <h1>Welcome to React!</h1>
    </div>
  );
}

export default React;
