import { db } from '../config/firebase';
import { doc, getDoc, enableNetwork, disableNetwork } from 'firebase/firestore';

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Enable network
    await enableNetwork(db);
    console.log('✅ Network enabled');
    
    // Try to read a test document
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    console.log('✅ Firestore connection successful');
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};

// Check if user document exists
export const checkUserDocument = async (uid) => {
  try {
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      console.log('✅ User document exists:', docSnap.data());
      return docSnap.data();
    } else {
      console.log('❌ User document does not exist');
      return null;
    }
  } catch (error) {
    console.error('❌ Error checking user document:', error);
    return null;
  }
}; 