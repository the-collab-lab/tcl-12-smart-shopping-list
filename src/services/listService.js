import firebase from 'firebase';
import { db } from '../lib/firebase.js';
import { formatString } from '../lib/helpers.js';

export const deleteItem = (token, itemName) => {
  const normalizedName = formatString(itemName);
  // delete field from firestore doc
  db.collection('lists')
    .doc(token)
    .update({
      [normalizedName]: firebase.firestore.FieldValue.delete(),
    });
};
