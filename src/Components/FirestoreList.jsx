import React from 'react';
import { FirestoreCollection } from 'react-firestore';
import List from './List/List';

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
    return itemList;
  };

  return (
    <FirestoreCollection
      path={`lists/${token}/items`}
      sort="lastPurchased:desc"
      render={({ isLoading, data }) => {
        return isLoading ? (
          <div>Loading</div>
        ) : (
          <List items={data} token={token} />
        );
      }}
    />
  );
}
