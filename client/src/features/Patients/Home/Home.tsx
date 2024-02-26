/* eslint-disable global-require */
import { FC } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Button } from 'antd';
import styles from './Home.module.scss';
import './custom-slider.scss';
import IMAGE from '@/assets/images';
import { PRIVATE_ROUTES } from '@/utils/constant/routes';

const cx = classNames.bind(styles);

const PatientsHomePage: FC = () => {
  const banner = {
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    swipeToSlide: true,
    className: 'jio-slick',
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: false,
          swipeToSlide: false,
          arrows: false
        }
      }
    ]
  };
  return (
    <>
      <section className={cx('container')}>
        <div className={cx('banner')}>
          <div className='container'>
            <div className='row'>
              <div className={cx('banner-main')}>
                <div className={cx('banner-slider')}>
                  <Slider {...banner}>
                    <div className={cx('slider-image')}>
                      <img src={IMAGE.bannerImage1} alt='' />
                    </div>
                    <div className={cx('slider-image')}>
                      <img src={IMAGE.bannerImage2} alt='' />
                    </div>
                    <div className={cx('slider-image')}>
                      <img src={IMAGE.bannerImage3} alt='' />
                    </div>
                    <div className={cx('slider-image')}>
                      <img src={IMAGE.bannerImage4} alt='' />
                    </div>
                    <div className={cx('slider-image')}>
                      <img src={IMAGE.bannerImage8} alt='' />
                    </div>
                  </Slider>
                </div>
                <div className={cx('content')}>
                  <img
                    className={cx('heart-icon')}
                    src={IMAGE.iconHeart}
                    alt=''
                  />
                  <img
                    className={cx('clinic-icon')}
                    src={IMAGE.iconCliniec}
                    alt=''
                  />
                  <h1 className={cx('title')}>
                    Chào mừng bạn đến với Doctor Family!
                  </h1>
                  <h2 className={cx('title')}>Bắt đầu sử dụng dịch vụ với</h2>
                  <div className={cx('action')}>
                    <Link to={PRIVATE_ROUTES.patientsFinder}>
                      <Button className={cx(['btn-booking', 'btn-banner'])}>
                        Đặt Hẹn Khám
                      </Button>
                    </Link>
                    <Link to={PRIVATE_ROUTES.patientsFinder}>
                      <Button className={cx(['btn-banner', 'btn-learn-more'])}>
                        Đặt khám ngay
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PatientsHomePage;
