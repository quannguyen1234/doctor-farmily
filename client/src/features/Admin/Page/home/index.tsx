import { FC } from 'react';
import classNames from 'classnames/bind';

import { MagnifyingGlassOutline } from '@graywolfai/react-heroicons';
import styles from './Home.module.scss';
import Search from '@/components/Input/Search';

const cx = classNames.bind(styles);

const UserHomePage: FC = () => {
  document.addEventListener('DOMContentLoaded', function () {
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
    const times = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'];
    const maxSlotsPerDay = 4;

    const calendarContainer = document.getElementById('booking-calendar');

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < days.length; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day');
      dayElement.textContent = days[i];

      const timeslotContainer = document.createElement('div');
      timeslotContainer.classList.add('timeslots');

      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < times.length; j++) {
        const timeslot = document.createElement('div');
        timeslot.classList.add('timeslot');
        timeslot.innerHTML = `
            <span class="time">${times[j]}</span>
            <span class="availability">Available</span>
          `;

        timeslotContainer.appendChild(timeslot);
      }

      const dayContainer = document.createElement('div');
      dayContainer.classList.add('day-container');
      dayContainer.appendChild(dayElement);
      dayContainer.appendChild(timeslotContainer);
      calendarContainer?.appendChild(dayContainer);
    }
    const timeslots = document.querySelectorAll('.timeslot');
    timeslots.forEach((timeslot) => {
      timeslot.addEventListener('click', () => {
        if (timeslot.classList.contains('selected')) {
          timeslot.classList.remove('selected');
        } else {
          const selectedSlots = document.querySelectorAll('.selected');
          if (selectedSlots.length < maxSlotsPerDay) {
            timeslot.classList.add('selected');
          }
        }
      });
    });
  });
  return (
    <section>
      <div>
        <Search
          type='text'
          id='home-search'
          placeholder='Tìm kiếm khoa, bác sĩ...'
          leftIcon={<MagnifyingGlassOutline />}
          rightIcon={<MagnifyingGlassOutline />}
        />
        <h1>Booking Calendar</h1>
        <div id='booking-calendar'>a</div>
      </div>
    </section>
  );
};

export default UserHomePage;
