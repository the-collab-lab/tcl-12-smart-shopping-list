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
        // TODO
        // retrieve items with Object.entries/keys
        // convert data into an array of objects
        return isLoading ? <div>Loading</div> : <List items={data.items} />;
      }}
    />
  );
}
