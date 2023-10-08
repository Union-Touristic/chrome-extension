import React, { useState } from 'react';
import Button from './Button';

import { useAuthentication } from '../context/AuthenticationContext';
import { useNotificationDispatch } from '../context/NotificationContext';
import { useTours } from '../context/ToursContext';

const delay = () => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(resolve, 1000);
    } catch (error) {
      setTimeout(reject, 1000);
    }
  });
};

const SpinningIcon = () => {
  return (
    <svg
      aria-hidden="true"
      role="status"
      className="inline w-4 h-4 mr-3 animate-spin"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="#FFFFFF"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentColor"
      />
    </svg>
  );
};

const SaveButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const tours = useTours();
  const notificationDispatch = useNotificationDispatch();
  const authentication = useAuthentication();
  const handleSaveButtonClick = async () => {
    setIsLoading(true);
    // 1. format tours before send
    // 2. send tours
    // 3. On fail (2) show error in Extension Popup
    //    BREAK
    // 4. On success (2) remove tours from memory
    // 5. On fail (4) show error in Extension Popup
    // 6. On success (4) open or reload tab depend on it current state
    const toursToSend = tours.map((tour) => ({
      from_city: tour.city_from,
      country: tour.country,
      region: tour.region,
      departure_date: tour.checkinDt,
      nights: tour.nights,
      hotel: tour.hotelName,
      board_basis: tour.boardType,
      room_type: tour.roomType,
      hotel_short_description: tour.description,
      operator: tour.operator,
      currency: tour.currency,
      price: tour.price,
      someExtraData: 'extra data',
    }));

    const response = await chrome.runtime.sendMessage({
      type: 'create selection',
      data: toursToSend,
      csrftoken: authentication.csrftoken,
    });

    await delay();
    setIsLoading(() => false);

    if (response.status === 400) {
      notificationDispatch({
        type: 'add error notification',
        title: `Ошибка ${response.status}`,
        message: 'Bad request',
      });
      console.log(response.data);
      return;
    }

    if (response.status === 403) {
      notificationDispatch({
        type: 'add error notification',
        title: `Ошибка ${response.status}`,
        message: 'Forbidden',
      });
      console.log(response.data);
      return;
    }

    if (response.status === 500) {
      notificationDispatch({
        type: 'add error notification',
        title: `Ошибка ${response.status}`,
        message: 'Internal Server Error',
      });
      console.log(response.data);
      return;
    }

    if (response.status === 'failed') {
      notificationDispatch({
        type: 'add error notification',
        title: 'Нет сети',
        message: 'Проверьте соединение',
      });
      console.log(response.data);
      return;
    }

    let hasEmptyTours = false;
    if (response.status === 201) {
      hasEmptyTours = await chrome.runtime.sendMessage({
        type: 'remove all tours',
      });
    }

    let shouldClosePopup = false;
    if (hasEmptyTours) {
      shouldClosePopup = await chrome.runtime.sendMessage({
        type: 'open crm tab',
      });
    }

    if (shouldClosePopup) {
      window.close();
    }
  };

  return (
    <Button disabled={isLoading} onClick={handleSaveButtonClick}>
      {isLoading ? (
        <>
          <SpinningIcon /> Отправка …
        </>
      ) : (
        'Сохранить в CRM'
      )}
    </Button>
  );
};

export default SaveButton;
