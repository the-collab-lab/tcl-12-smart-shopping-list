import dayjs from 'dayjs';
import { db } from '../lib/firebase.js';
import { formatString } from '../lib/helpers.js';
import calculateEstimate from '../lib/estimates';

export const deleteItem = (token, itemName) => {
  const normalizedName = formatString(itemName);
  // delete field from firestore doc
  return db
    .collection('lists')
    .doc(token)
    .collection('items')
    .doc(normalizedName)
    .delete()
    .then(function () {
      return true;
    })
    .catch(function (error) {
      console.log('Error deleting document: ', error);
      return false;
    });
};

const getNumberOfPurchases = (item) => {
  if (item.numberOfPurchases === undefined) {
    return 1;
  } else {
    return item.numberOfPurchases + 1;
  }
};

export const getLastPurchaseDate = (item, currentDate) => {
  if (item.lastPurchased === null) {
    return currentDate;
  } else {
    return dayjs(item.lastPurchased.toDate());
  }
};

export const purchaseItem = (item, token) => {
  const normalizedName = formatString(item.name);
  const numberOfPurchases = getNumberOfPurchases(item);
  const currentDate = dayjs(new Date());
  const lastPurchaseDate = getLastPurchaseDate(item, currentDate);
  const lastInterval = currentDate.diff(lastPurchaseDate, 'h') / 24;
  const calculatedEstimate = calculateEstimate(
    item.frequency,
    lastInterval,
    numberOfPurchases,
  );

  db.collection('lists')
    .doc(token)
    .collection('items')
    .doc(normalizedName)
    .update({
      name: item.name,
      frequency: item.frequency,
      lastPurchased: new Date(),
      oldPurchased: item.lastPurchased,
      numberOfPurchases: numberOfPurchases,
      calculatedEstimate: calculatedEstimate,
    });
};

export const checkForDuplicateItem = async (token, itemName) => {
  const itemSnapshot = await db
    .collection('lists')
    .doc(token)
    .collection('items')
    .doc(itemName)
    .get();

  return itemSnapshot.exists;
};

export const addItem = async (token, itemName, formData) => {
  return db
    .collection('lists')
    .doc(token)
    .collection('items')
    .doc(itemName)
    .set({
      name: formData.itemName,
      frequency: parseInt(formData.itemFrequency),
      lastPurchased: null,
    })
    .then(() => {
      return true;
    })
    .catch((e) => {
      console.log('Error updating Firestore: ', e);
      return false;
    });
};

export const createList = (token) => {
  db.collection('lists').doc(token).set({});
};
