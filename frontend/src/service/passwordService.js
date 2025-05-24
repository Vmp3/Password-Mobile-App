import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

export const generatePassword = () => {
  return uuidv4();
}; 