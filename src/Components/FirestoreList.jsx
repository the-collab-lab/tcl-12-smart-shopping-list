import React from 'react';
import { FirestoreDocument } from 'react-firestore';
import List from './List';

/**
 * Retrieves token from local storage and accesses the saved items list from Firestore
 */

export default function FirestoreList({ token }) {
  // Extracts item objects from Firestore into an array
  const dataToArray = (data) => {
    const itemList = [];
    const storedList = Object.entries(data);
    storedList.forEach(([key, value]) => {
      if (key !== 'id') {
        itemList.push(value);
      }
    });
    console.log(itemList);
    return itemList;
  };

  return (
    <FirestoreDocument
      path={`lists/${token}`}
      render={({ isLoading, data }) => {
        return isLoading ? (
          <div>Loading</div>
        ) : (
          <List items={dataToArray(data)} />
        );
      }}
    />
  );
}
