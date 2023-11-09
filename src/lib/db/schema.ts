import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const tours = pgTable('tours', {
  id: varchar('id', { length: 36 })
    .$default(() => String(Math.random()))
    .primaryKey(),
  fromCity: varchar('from_city', { length: 50 }),
  country: varchar('country', { length: 50 }),
  region: varchar('region', { length: 50 }),
  departureDate: varchar('departure_date', { length: 30 }),
  nights: integer('nights'),
  hotel: varchar('hotel', { length: 100 }),
  boardBasis: varchar('board_basis', { length: 30 }),
  roomType: varchar('room_type', { length: 50 }),
  hotelShortDescription: text('hotel_short_description'),
  operator: varchar('operator', { length: 30 }),
  currency: varchar('currency', { length: 10 }),
  price: integer('price'),
});

export const insertTourSchema = createInsertSchema(tours);

export type Tour = InferSelectModel<typeof tours>;
export type TourInsert = InferInsertModel<typeof tours>;
