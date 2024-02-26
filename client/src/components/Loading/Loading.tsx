import classNames from 'classnames/bind';

import styles from './loading.module.scss';

const cx = classNames.bind(styles);

const Loading = (): JSX.Element => {
  return (
    <section className={cx('wrapper')}>
      <div className={cx('content')}>
        <h2>Doctor Family</h2>
        <h2>Doctor Family</h2>
      </div>
    </section>
  );
};

export default Loading;
