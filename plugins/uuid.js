import { v4 as uuidv4 } from 'uuid';

export default function (context, inject) {
  inject('uuid', uuidv4);
}
