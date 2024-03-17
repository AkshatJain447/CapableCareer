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
        profilePic: "images/profile1.jpg",
        EmpId: user.uid,
      })
      
      .then(() => {
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
      var userinfo = {};
      get(child(ref(db), 'Users/' + user.uid)).then((snapshot) => {
        if (snapshot.exists()) {
          userinfo = snapshot.val();
          localStorage.setItem("user-info", JSON.stringify(userinfo));
          var closebtn = document.querySelector("#loginModalCloseBtn");
          userEmailL.value = userPassL.value = null;
          closebtn.click();
          if (userinfo.Role === "Employer") {
            window.location.href = "employer.html";
          } else {
            window.location.href = "seeker.html";
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
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

var jobScroll = document.querySelector("#jobScroll");
var jobList = [{
  jobTitle: "Teacher",  
  Company: "Government School",
  Deadline: "2024-03-30 23:59",
  Description: "Join the prestigious Government School of India as a dedicated teacher. Inspire and educate the future leaders of our nation. Qualified candidates with a passion for teaching and a commitment to student success are encouraged to apply. Help shape the minds of tomorrow and make a difference in education.",
  EligibilityCriteria: "M.Sc.",
  HR: "Akshat Jain",
  JobId: 1,
  JobLocation: "Bijnor",
  Vacancies: 10,
  ApplicationStatus:"Open",}
  ,
  {jobTitle: "Counselor",
  Company: "Special Education Center",
  Deadline: "2024-04-15 23:59",
  Description: "Join our Special Education Center as a compassionate counselor. Provide guidance and support to students with disabilities, helping them overcome challenges and achieve their full potential. Ideal candidates possess empathy, patience, and strong communication skills.",
  EligibilityCriteria: "B.A. in Psychology or related field",
  HR: "Emily Johnson",
  JobId: 2,
  JobLocation: "Mumbai",
  Vacancies: 5,
  ApplicationStatus: "Open",}
  ,
  {jobTitle: "Sign Language Interpreter",
  
  Company: "Deaf Education Institute",
  Deadline: "2024-04-10 23:59",
  Description: "Join our Deaf Education Institute as a proficient sign language interpreter. Facilitate communication between deaf or hard-of-hearing students and educators, ensuring inclusive learning environments. Qualified candidates must be fluent in sign language and possess strong interpersonal skills.",
  EligibilityCriteria: "Certification in Sign Language Interpretation",
  HR: "David Smith",
  JobId: 3,
  JobLocation: "Delhi",
  Vacancies: 3,
  ApplicationStatus: "Open",
  }
  ,
  {jobTitle: "Occupational Therapist",
  Company: "Rehabilitation Center for Disabilities",
  Deadline: "2024-04-20 23:59",
  Description: "Join our Rehabilitation Center for Disabilities as a dedicated occupational therapist. Provide therapeutic interventions to individuals with physical or cognitive disabilities, promoting independence and improving quality of life. Candidates with experience in rehabilitation settings are preferred.",
  EligibilityCriteria: "Bachelor's Degree in Occupational Therapy",
  HR: "Sarah Brown",
  JobId: 4,
  JobLocation: "Kolkata",
  Vacancies: 2,
  ApplicationStatus: "Open",
}];

var customString = '';

// Loop through each job object
jobList.forEach(job => {
  // Extract values for each key and concatenate into the custom string format
  customString += `Job Id: ${job.JobId}, Job Title: ${job.jobTitle}, Company: ${job.Company}, Deadline: ${job.Deadline}, Description: ${job.Description}, Eligibility Criteria: ${job.EligibilityCriteria}, HR: ${job.HR}, Job Location: ${job.JobLocation}, Vacancies: ${job.Vacancies}, Application Status: ${job.ApplicationStatus}`;
});

jobScroll.innerText = customString;

var noticeBoard = document.querySelector("#noticeBoard");
var customString2 = '';
jobList.forEach(job => {
  // Extract values for each key and concatenate into the custom string format
  customString2 += `${job.JobId}. ${job.jobTitle} at ${job.Company}, Last date to apply: ${job.Deadline}, Eligibility Criteria: ${job.EligibilityCriteria}, Job Location: ${job.JobLocation}, Total Vacancies: ${job.Vacancies}\n`;
});
noticeBoard.innerText = customString2;

var contactFormSentBtn = document.querySelector("#contactSubmitBtn");
var contactFormSentMsg = document.querySelector(".msgSent");
contactFormSentBtn.addEventListener('click',()=>{
  contactFormSentMsg.style.display = "block";
  setTimeout(()=>{
    contactFormSentMsg.style.display = "none";
  }, 2000);
})

var card1btn = document.querySelector("#card1btn");
var card2btn = document.querySelector("#card2btn");
var card3btn = document.querySelector("#card3btn");

card1btn.addEventListener("click", ()=>{
  window.location.href = "Jobs.html";
})

card2btn.addEventListener("click", ()=>{
  window.location.href = "Training.html";
})

card3btn.addEventListener("click", ()=>{
  window.location.href = "events.html";
})