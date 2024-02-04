import {initializeApp} from 'firebase/app'
import{
    getFirestore,collection,
    addDoc,deleteDoc,doc, onSnapshot,
    query,where,orderBy,serverTimestamp,getDoc,updateDoc
}from 'firebase/firestore'
import{
    getAuth,
    createUserWithEmailAndPassword,
    signOut,signInWithEmailAndPassword, onAuthStateChanged
   
} from 'firebase/auth'
const firebaseConfig = {
    apiKey: "AIzaSyDDXUcoAZf976zU4htPKpMbye2guaYDCEo",
    authDomain: "fir-9-dojo-45c12.firebaseapp.com",
    projectId: "fir-9-dojo-45c12",
    storageBucket: "fir-9-dojo-45c12.appspot.com",
    messagingSenderId: "24591472858",
    appId: "1:24591472858:web:53f74aac33cfe96a602de3",
    measurementId: "G-FT49XZZMFB"
  };
  //init firebase app
  initializeApp(firebaseConfig)
  //init services
  const db = getFirestore()
  const auth = getAuth()
  //collection ref
  const colRef = collection(db,'books')
  //get collection data
//   getDocs(colRef)
//     .then((snapshot) => {
        
//     })
//     .catch((error) => {
//         console.error('Error getting documents:', error);
//     })
  //query
    const q = query(colRef,orderBy('createdAt'))
    //to avoid refresh
    const unsubCol = onSnapshot(q,(snapshot) =>{
        let books=[]
        snapshot.docs.forEach((doc)=>{
            books.push({...doc.data(),id:doc.id})
        })
        console.log(books)
    })
    //adding documents
    const addBookForm = document.querySelector('.add')
    addBookForm.addEventListener('submit',(e) =>{
        e.preventDefault()
        addDoc(colRef,{
            title: addBookForm.title.value,
            author: addBookForm.author.value,
            createdAt: serverTimestamp()
        })
        .then(()=>{
            addBookForm.requestFullscreen()
        })
    })
    //deleting documents
    const deleteBookForm = document.querySelector('.delete')
    deleteBookForm.addEventListener('submit',(e) =>{
        e.preventDefault()
        const docRef = doc(db,'books',deleteBookForm.id.value)
        deleteDoc(docRef)
        .then(()=>{
            deleteBookForm.reset()
        })
    })
    //get a single document
    const docRef = doc(db,'books','e7uwGuipHM7duI7CoAvI')
    getDoc(docRef)
        .then((doc)=>{
            console.log(doc.data(),doc.id)
        })
        const unsubDoc =onSnapshot(docRef,(doc) =>{
        console.log(doc.data(),doc.id)
    })
    //updating a document
    const updateForm = document.querySelector('.update')
    updateForm.addEventListener('submit',(e) =>{
        e.preventDefault()
        const docRef = doc(db,'books',updateForm.id.value)
        updateDoc(docRef,{
            title:'updated title'
        })
        .then(()=>{
            updateForm.reset()
        })
    })
    //signup users up
    const signupForm = document.querySelector('.signup')
    signupForm.addEventListener('submit',(e) =>{
        e.preventDefault()
        const email = signupForm.email.value
        const password = signupForm.password.value
        createUserWithEmailAndPassword(auth,email,password)
        .then((cred)=>{
            console.log('user created:',cred.user)
            signupForm.reset()
        })
        
        .catch((error) =>{
            console.log(error.message)
        })
    })
    //logging in and out
    const logoutButton = document.querySelector('.logout')
    logoutButton.addEventListener('click',() =>{
        signOut(auth)
        .then(() =>{
            console.log('the user is signed out')
        })
        .catch((error) =>{
            console.log(error.message)
        })
    })
    const loginForm = document.querySelector('.login')
    loginForm.addEventListener('submit',(e) =>{
        e.preventDefault()
        const email = loginForm.email.value
        const password = loginForm.password.value
        signInWithEmailAndPassword(auth,email,password)
        .then((cred) =>{
            console.log('user logged in:',cred.user)
        })
        .catch((error) =>{
            console.log(error.message)
        })
    })
    // subscribing to auth changes
    const unsubAuth= onAuthStateChanged(auth,(user) =>{
        console.log('user status changed:',user)
    })
    //unsubscribing from changes(auth & db)
    const unsubButton = document.querySelector('.unsub')
    unsubButton.addEventListener('click',()=>{
        console.log('unsbscribing')
        unsubAuth()
        unsubCol()
        unsubDoc()
    })