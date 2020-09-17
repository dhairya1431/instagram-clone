// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase'

const firebaseApp = firebase.initializeApp( {
        apiKey: "AIzaSyBpGW1LoVunhI9VmtdH6sbgL8FF9srOcoI",
        authDomain: "instagram-clone-524c4.firebaseapp.com",
        databaseURL: "https://instagram-clone-524c4.firebaseio.com",
        projectId: "instagram-clone-524c4",
        storageBucket: "instagram-clone-524c4.appspot.com",
        messagingSenderId: "1092019438695",
        appId: "1:1092019438695:web:4a2c147573f00ca0e7c0c2",
        measurementId: "G-WNJNTJ2PRJ"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db , auth , storage };
