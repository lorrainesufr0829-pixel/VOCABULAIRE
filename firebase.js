import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOFdKkITxZ46D-y0GgELlm1X5FHYPiVBw",
  authDomain: "vocab-58dba.firebaseapp.com",
  projectId: "vocab-58dba"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
