import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  getCountFromServer,
  getFirestore,
  query,
  where,
  deleteDoc,
  runTransaction,
  getDoc,
} from 'firebase/firestore';
import logger from './utils/logger';

const firebaseConfig = {
  apiKey: 'AIzaSyC48oopkhcbUKMyF6_djPd8FRNfRku0PKE',
  authDomain: 'pastoresdemo.firebaseapp.com',
  projectId: 'pastoresdemo',
  storageBucket: 'pastoresdemo.appspot.com',
  messagingSenderId: '122365976120',
  appId: '1:122365976120:web:28c64a10279bc4c92690cd',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getIdDocument = async (id, table) => {
  const docRef = collection(db, table);
  const q = query(docRef, where('id', '==', id));
  const docSnap = await getDocs(q);
  return docSnap.docs[0].id;
};

export const addData = async (table, data) => {
  const newDataRef = doc(collection(db, table));
  return await setDoc(newDataRef, {
    createAt: new Date(),
    ...data,
  });
};
export const editData = async (id, table, data) => {
  const idDocument = await getIdDocument(id, table);
  return await updateDoc(doc(db, table, idDocument), {
    ...data,
  });
};
export const removeData = async (id, table) => {
  const idDocument = await getIdDocument(id, table);
  return await deleteDoc(doc(db, table, idDocument));
};
export const removeConditionData = async (
  table,
  atte = 'id',
  ope = '!=',
  value = 'null',
) => {
  const q = query(collection(db, table), where(atte, ope, value));
  getDocs(q).then(function ({ docs }) {
    docs.forEach(async function (doc) {
      await deleteDoc(doc.ref);
    });
  });
};
export const findData = async (
  table,
  atte = 'id',
  ope = '!=',
  value = 'null',
) => {
  const docRef = collection(db, table);
  const q = query(
    docRef,
    where(atte, ope, value),
    // limit(3))
  );
  const docSnap = await getDocs(q);
  const List = docSnap.docs.map((doc) => doc.data());
  return List;
};

export const findAll = async (table) => {
  const docRef = collection(db, table);
  const docSnap = await getDocs(docRef);
  const List = docSnap.docs.map((doc) => doc.data());
  return List;
};

export const findFieldForm = async (id) => {
  const docRef = doc(db, 'form', id);
  const docSnap = await getDoc(docRef);
  return Object.values(docSnap.data())[0];
};

export const countData = async (
  table,
  atte = 'id',
  ope = '!=',
  value = 'null',
) => {
  const docRef = collection(db, table);
  const q = query(
    docRef,
    where(atte, ope, value),
    // limit(3))
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

export const auth = async (username, password) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      username,
      password,
    );

    const user = userCredential.user;
    return user;
  } catch (e) {
    logger.error(e.code);
    return false;
  }
};

export const signUp = async (username, password) => {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    username,
    password,
  );
  return userCredential.user;
};

export const addMultipleData = async (table, array) => {
  const batch = writeBatch(db);
  array.forEach((data) => {
    let nycRef = doc(collection(db, table));
    batch.set(nycRef, {
      ...data,
      createAt: new Date(),
    });
  });
  await batch.commit();
};

export const addDatarunTransaction = async (tables, allData) => {
  try {
    const newPopulation = await runTransaction(db, async (transaction) => {
      tables.forEach((table) => {
        allData[table].forEach((data) => {
          const newDataRef = doc(collection(db, table));
          transaction.set(newDataRef, { ...data, createAt: new Date() });
        });
      });
    });
  } catch {}
};

export const editDatarunTransaction = async (tables, allData) => {
  tables.forEach((table) => {
    allData[table].forEach(({ id, ...data }) => {
      const q = query(collection(db, table), where('id', '==', id));
      getDocs(q).then(function ({ docs }) {
        updateDoc(docs[0].ref, { ...data });
      });
    });
  });
};
export const getTest = async () => {
  // const batch = writeBatch(db);
  // array.forEach((data) => {
  //   let nycRef = doc(collection(db, 'user'));
  //   batch.set(nycRef, {
  //     ...data,
  //     id: uuid(),
  //     createAt: new Date(),
  //   });
  // });
  // await batch.commit();
  //REGISTRO
  //LOGIN
};
const firebase = {
  addData,
  editData,
  removeData,
  findData,
  findAll,
  countData,
  getTest,
  auth,
  signUp,
};

export default firebase;
