import React, { useRef, useState } from 'react';

import { useTours, useToursDispatch } from '../context/ToursContext';
import { frenchFormatter } from '../helpers/helpers';
import { Tour } from '../../../types';
import { ToursMessenger } from '../../../types/chrome-extesion';

type EditPriceProps = {
  tour: Tour;
};

const EditPrice = ({ tour }: EditPriceProps) => {
  const [price, setPrice] = useState(frenchFormatter.format(tour.price));
  const tours = useTours();
  const toursDispatch = useToursDispatch();
  const initialPriceRef = useRef(tour.price);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[\d\s]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      const priceToNumber = Number(e.target.value.replace(/\s/g, ''));
      setPrice(frenchFormatter.format(priceToNumber));
    }
  };

  const handleInputKeydown = (e: React.KeyboardEvent) => {
    if (e.code === 'Escape') {
      e.preventDefault();
      setPrice(frenchFormatter.format(initialPriceRef.current));
      inputRef.current?.blur();
    }

    if (e.code === 'Tab') {
      setPrice(frenchFormatter.format(initialPriceRef.current));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedPrice = Number(inputRef.current?.value.replace(/\s/g, ''));
    const toursWithChangedTour: Tour[] = tours.map((item) =>
      tour.id === item.id
        ? {
            ...item,
            price: updatedPrice,
          }
        : item
    );
    const updatedTours = await chrome.runtime.sendMessage<
      ToursMessenger,
      Tour[]
    >({
      type: 'update',
      data: toursWithChangedTour,
    });

    toursDispatch({
      type: 'update tours',
      tours: updatedTours,
    });

    inputRef.current?.blur();
  };

  return (
    <form className="cursor-pointer" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        value={price}
        onChange={handlePriceInputChange}
        className="p-0 text-xs w-16 text-right border-0 focus:ring-2"
        onKeyDown={handleInputKeydown}
      />
    </form>
  );
};

export default EditPrice;
