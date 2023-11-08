import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { 
  SET_USER, SET_LOADING_STATUS, 
  GET_ARTICLES } from './actionType';
import {
  getFirestore,collection,
  addDoc, query, orderBy, onSnapshot 
} from 'firebase/firestore';
import {
  getStorage, ref,
  uploadBytes, getDownloadURL,
} from 'firebase/storage';

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});

export const getArticles = (payload) => ({
  type: GET_ARTICLES,
  payload: payload,
});

// Initialize Firebase auth and provider
export const signInAPI = () => (dispatch) => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  // Sign in with Google
  signInWithPopup(auth, provider)
    .then((result) => {
      // Handle the sign-in result
      const user = result.user;
      console.log(user);
      dispatch(setUser(user));
    })
    .catch((error) => {
      // Handle sign-in error
      console.error(error);
    });
};

export function getUserAuth() {
  const auth = getAuth();
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signOutAPI() {
  const auth = getAuth();
  return (dispatch) => {
    auth.signOut()
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
}

export function postArticleAPI(payload) {
  return (dispatch) => {
    dispatch(setLoading(true));

    if (payload.image) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${payload.image.name}`);
      uploadBytes(storageRef, payload.image)
        .then(async (uploadSnapshot) => {
          const downloadURL = await getDownloadURL(uploadSnapshot.ref);
          const articleData = {
            actor: {
              description: payload.user.email,
              title: payload.user.displayName,
              date: payload.timestamp,
              image: payload.user.photoURL,
            },
            video: payload.video,
            sharedImg: downloadURL,
            comments: 0,
            description: payload.description,
          };

          const db = getFirestore();
          addDoc(collection(db, 'articles'), articleData)
            .then(() => {
              console.log('Article added successfully');
            })
            .catch((error) => {
              console.error('Error adding article: ', error);
            });
        })
        .catch((error) => {
          console.error('Error uploading image: ', error);
        });
        dispatch(setLoading(false));
        } else if (payload.video) {
      const articleData = {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: payload.video,
        sharedImg: "",
        comments: 0,
        description: payload.description,
      };

      const db = getFirestore();
      addDoc(collection(db, 'articles'), articleData)
        .then(() => {
          console.log('Article with video added successfully');
        })
        .catch((error) => {
          console.error('Error adding article with video: ', error);
        });
        dispatch(setLoading(false));
    }
  };
}

export function getArticlesAPI() {
  return async (dispatch) => {
    let payload;

    const db = getFirestore();
    const q = query(collection(db, 'articles'), orderBy('actor.date', 'desc'));

    onSnapshot(q, (snapshot) => {
      payload = snapshot.docs.map((doc) => doc.data());
      dispatch(getArticles(payload));
    });
  };
}
