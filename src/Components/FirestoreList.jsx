import React from 'react';
import { FirestoreDocument } from 'react-firestore';
import List from './List';

/**
 * Retrieves token from local storage and accesses the saved items list from Firestore
 */

export default function FirestoreList({ token }) {
  return (
    <FirestoreDocument
      path={`lists/${token}`}
      render={({ isLoading, data }) => {
        let itemList = [];
        if (data !== null) {
          const storedList = Object.entries(data);
          storedList.forEach(([key, value]) => {
            if (key !== 'id') {
              itemList.push(value);
            }
          });
        }
        return isLoading ? <div>Loading</div> : <List items={itemList} />;
      }}
    />
  );
}
