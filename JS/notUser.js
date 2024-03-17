// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getDatabase, ref, set, update, get, child } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDy3sKd9VCbCa6GiJNSAliuah6fyEUrd10",
  authDomain: "capablecareer.firebaseapp.com",
  projectId: "capablecareer",
  storageBucket: "capablecareer.appspot.com",
  messagingSenderId: "303250442163",
  appId: "1:303250442163:web:95ffed52e2128677216dc6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Access Firebase Auth instance
const auth = getAuth();

// Access Firebase Realtime Database instance
const db = getDatabase();

var registerUser = document.querySelector("#registerUser");
var loginUser = document.querySelector("#loginUser");

// register user
registerUser.addEventListener("click", () => {
  var userName = document.querySelector("#userName");
  var userPhone = document.querySelector("#userPhone");
  var userRoleR = document.querySelector("#userRoleR");
  var userEmailR = document.querySelector("#userEmailR");
  var userPassR = document.querySelector("#userPassR");

  // Validate input fields (assuming you have defined these validation functions)
  if (!validate_email(userEmailR.value) || !validate_password(userPassR.value)) {
    alert('Email or Password is Incorrect!!');
    return;
  }
  if (!validate_field(userName.value) || !validate_field(userPhone.value) || !validate_field(userRoleR.value)) {
    alert('One or More Extra Fields are Incorrect!!');
    return;
  }

  // Create user with email and password
  createUserWithEmailAndPassword(auth, userEmailR.value, userPassR.value)
    .then((userCredential) => {

      const user = userCredential.user;
      var mydate = new Date();
      set(ref(db, 'Users/' + user.uid), {
        Email: userEmailR.value,
        Name: userName.value,
        Phone: userPhone.value,
        Role: userRoleR.value,
        last_login: mydate.toISOString(),
        EmpId: user.uid,
      })
      
      .then(() => {
        alert("User created successfully");
        var closebtn = document.querySelector("#registerModalCloseBtn");
        userName.value = userPhone.value = userEmailR.value = userPassR.value = userRoleR.value = null;
        closebtn.click();
      })

      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error ${errorCode}: ${errorMessage}`);
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error ${errorCode}: ${errorMessage}`);
    });
});

// login user function
loginUser.addEventListener("click", ()=>{
  var userEmailL = document.querySelector("#userEmailL");
  var userPassL = document.querySelector("#userPassL");
  var mydate = new Date();
  signInWithEmailAndPassword(auth, userEmailL.value, userPassL.value)
  .then((userCredential) => {
    const user = userCredential.user;
    update(ref(db, 'Users/' + user.uid), {
      last_login: mydate.toISOString()
    })
    .then(()=>{
      get(child(ref(db), 'Users/'+ user.uid)).then((snapshot) => {
        if (snapshot.exists()) {
          var userinfo = JSON.stringify(snapshot.val());
          localStorage.setItem("user-info", userinfo);
        }
      })
      alert("success");
      var closebtn = document.querySelector("#loginModalCloseBtn");
      userEmailL.value = userPassL.value = null;
      closebtn.click();
      window.location.href = "employer.html";
    })
    .catch((error) =>{      
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(error);
    })
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("Incorrect email or password!");
  });
})

// Validate Functions
function validate_email(email) {
  var expression = /^[^@]+@\w+(\.\w+)+\w$/;
  if (expression.test(email) == true) {
    return true;
  } else {
    return false;
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false;
  } else {
    return true;
  }
}

function validate_field(field) {
  if (field == null) {
    return false;
  }
  if (field.length <= 0) {
    return false;
  } else {
    return true;
  }
}