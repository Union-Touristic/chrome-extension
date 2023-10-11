import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const TOURVISOR_LINK = 'https://tourvisor.ru';

const EmptyListMessage = () => {
  const handleLinkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await chrome.tabs.create({
      url: TOURVISOR_LINK,
    });
  };

  return (
    <div className="text-center pt-20">
      <h2 className="text-3xl leading-9 font-semibold text-blue-900">
        Список туров пуст
      </h2>
      <p className="text-base leading-6 font-normal mt-5">
        Список туров пуст, отктройте сайт{' '}
        <a
          href={TOURVISOR_LINK}
          onClick={handleLinkClick}
          className="text-indigo-700 underline decoration-indigo-700"
        >
          Tourvisor.ru
        </a>{' '}
        и просто начните
        <br />
        поиск отелей.
      </p>
      <p className="text-base leading-6 font-normal mt-4 flex justify-center">
        Добавляйте подходящие туристу предложения нажав на кнопку{' '}
        <PlusCircleIcon
          className="ml-2 h-6 w-6 text-blue-900"
          aria-hidden="true"
        />
      </p>
    </div>
  );
};

export default EmptyListMessage;
