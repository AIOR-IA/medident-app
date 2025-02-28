import { v4 as uuid } from 'uuid';
export function createEventId() {
  return uuid();
}
