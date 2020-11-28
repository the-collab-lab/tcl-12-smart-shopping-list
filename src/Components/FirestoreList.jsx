import React from 'react';
import { FirestoreCollection } from 'react-firestore';
import List from './List/List';

/**
 * Retrieves token from local storage and accesses the saved items list from Firestore
 */

export default function FirestoreList({ token }) {
  return (
    <FirestoreCollection
      path={`lists/${token}/items`}
      // sort="name,lastPurchased"
      render={({ isLoading, data }) => {
        return isLoading ? (
          <h1 className="loading">Loading...</h1>
        ) : (
          <List items={data} token={token} />
        );
      }}
    />
  );
}
