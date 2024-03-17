// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getDatabase, ref, set, update, get, child, onValue} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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
var signOutBtn = document.querySelector("#signOutBtn");
var userInfo = JSON.parse(localStorage.getItem("user-info")) ? JSON.parse(localStorage.getItem("user-info")) : window.location.href = 'notUser.html';

signOutBtn.addEventListener("click", ()=>{
  signOut(auth).then(() => {
    localStorage.removeItem("user-info");
    alert("Successfully Signed Out");
    window.location.href = "index.html";
  }).catch((error) => {
    alert("Error in signing out");
  });
})

var requiredJobList = [];

var EmployerHeaderContainer = document.querySelector("#EmployerHeader");
var currentTime = new Date();
var greetingMsg = '';

if(currentTime.getHours<12){
  greetingMsg = 'Good Morning';
}else if (currentTime.getHours>=12 && currentTime.getHours<=18){
  greetingMsg = 'Good Afternoon';
} else{
  greetingMsg = 'Good Evening';
}

EmployerHeaderContainer.innerHTML = `
<img src="${userInfo.profilePic}" alt="Profile Picture">
<div>
  <h2>
    ${greetingMsg}, ${userInfo.Name}
  </h2>
  <h4>
  ${userInfo.Name}'s dashboard
  </h4>
</div>
`;

var personalInfo = document.querySelector("#personalInfo");
personalInfo.innerHTML= `
  <div class="personalInfoContainer">
    <h5>User's Personal Information</h5>
    <div>
      <ul>
        <li><span>Name:</span> ${userInfo.Name}</li>
        <li><span>User Id:</span> ${userInfo.EmpId}</li>
        <li><span>Email Id:</span> ${userInfo.Email}</li>
        <li><span>Phone No:</span> ${userInfo.Phone}</li>
        <li><span>Role:</span> ${userInfo.Role}</li>
      </ul>
    </div>
    <button id='editPersonalInfo'>Edit Personal Info</button>
  </div>
`;

var jobPostedContainer = document.querySelector("#jobPosted");
function displayJobs(){
  requiredJobList.forEach(job => {
    jobPostedContainer.innerHTML += `
    <div class="jobCard">
      <h6 class="jobcardHead">Job Title: ${job.jobTitle}</h6>
      <div class="jobCardC">
        <div class="jobCardA">
          <ul>
            <li><span class="jobCardHeding">Job Id:</span> ${job.JobId}</li>
            <li><span class="jobCardHeding">Company:</span>  ${job.Company}</li>
            <li><span class="jobCardHeding">Description:</span> ${job.Description}</li>
          </ul>
        </div>
        <div class="jobCardB">
          <ul>
            <li><span class="jobCardHeding">Application Deadline:</span> ${job.Deadline}</li>
            <li><span class="jobCardHeding">Vacancy:</span> ${job.Vacancies}</li>
            <li><span class="jobCardHeding">Eligibility:</span> ${job.EligibilityCriteria}</li>
            <li><span class="jobCardHeding">Location:</span> ${job.JobLocation }</li>
          </ul>
        </div>
      </div>
      <button type="button" class="applyJobBtn" data-toggle="modal" data-target="#applyForJob">
        Apply Now
      </button>
    </div>`;
  })
}

function GetAllDataOnce() {
  var jobList = [];
  get(child(ref(db), "JobList")).then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
      jobList.push(childSnapshot.val());
    });      
    requiredJobList = jobList;
  });
}

function GetAllDataRealTime() {
  const dbref = ref(db, "JobList");
  var jobList = [];
  onValue(dbref, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      jobList.push(childSnapshot.val());
    });
    console.log(jobList);
    requiredJobList = jobList;
    displayJobs();
  });
}

var personalInfoFetch = document.querySelector("#personalInfoFetch");
var jobPostedFetch = document.querySelector("#jobPostedFetch");

var personalInfoDisplay = document.querySelector(`#personalInfo`);
var jobPostedDisplay = document.querySelector(`#jobPosted`);

window.onload = function () {
  GetAllDataOnce();
  GetAllDataRealTime();  
  personalInfoDisplay.classList.add("active");
  personalInfoFetch.classList.add("activeBtn");
};

personalInfoFetch.addEventListener("click", function(){
  personalInfoDisplay.classList.add("active");
  jobPostedDisplay.classList.remove("active");
  personalInfoFetch.classList.add("activeBtn");
  jobPostedFetch.classList.remove("activeBtn");
})

jobPostedFetch.addEventListener("click", function(){
  personalInfoDisplay.classList.remove("active");
  jobPostedDisplay.classList.add("active");
  personalInfoFetch.classList.remove("activeBtn");
  jobPostedFetch.classList.add("activeBtn");
})