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
    </div>`;
  })
}

var postNewBtn = document.querySelector("#postNewJob");
var storedJobId;
get(child(ref(db), 'JobId')).then((snapshot)=>{
  storedJobId = snapshot.val();
})

postNewBtn.addEventListener('click', function(){
  var jobTitle = document.querySelector('#jobTitle');
  var company = document.querySelector("#Company");
  var jobDesc = document.querySelector("#jobDescription");
  var Deadlinedate = document.querySelector("#Deadlinedate");
  var Deadlinetime = document.querySelector("#Deadlinetime");
  var Vacancy = document.querySelector("#Vacancy");
  var Eligibility = document.querySelector("#Eligibility");
  var Location = document.querySelector("#Location");
  var Status = document.querySelector("#Status");

  var job_info = {
    jobTitle: jobTitle.value,
    Company : company.value ,
    Description : jobDesc.value ,
    Deadline : Deadlinedate.value +' '+ Deadlinetime.value ,
    Vacancies : parseInt(Vacancy.value),
    EligibilityCriteria : Eligibility.value ,
    JobLocation : Location.value,
    ApplicationStatus : Status.value,
    HR: userInfo.Name,
    JobId: ++storedJobId,
  };

  set(ref(db, 'JobList/' + storedJobId), job_info).then(()=>{
    set(ref(db, 'JobId'), storedJobId);
    window.location.reload();
    setTimeout(()=>{
      alert("Job Posted Successfully");
    }, 100);
  }).catch((error)=>{
    alert("Error encountered" + error);
  })
})

function GetAllDataOnce() {
  var jobList = [];
  get(child(ref(db), "JobList")).then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
      jobList.push(childSnapshot.val());
    });      
    requiredJobList = jobList.filter(job => job.HR === userInfo.Name);
    renderPersonalInfo();
  });
}

function GetAllDataRealTime() {
  const dbref = ref(db, "JobList");
  var jobList = [];
  onValue(dbref, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      jobList.push(childSnapshot.val());
    });
    requiredJobList = jobList.filter(job => job.HR === userInfo.Name);
    renderPersonalInfo();
    displayJobs();
  });
}

var userDashboardFetch = document.querySelector("#userDashboardFetch");
var personalInfoFetch = document.querySelector("#personalInfoFetch");
var jobPostedFetch = document.querySelector("#jobPostedFetch");

var userDashboardDisplay = document.querySelector(`#userDashboard`);
var personalInfoDisplay = document.querySelector(`#personalInfo`);
var jobPostedDisplay = document.querySelector(`#jobPosted`);

window.onload = function () {
  GetAllDataOnce();
  GetAllDataRealTime();  
  userDashboardDisplay.classList.add("active");
  userDashboardFetch.classList.add("activeBtn");
};

function renderPersonalInfo(){
  var jobL = requiredJobList[requiredJobList.length-1];
  var userDashboard = document.querySelector("#userDashboard");
  userDashboard.innerHTML = `
  <div>
    <h5 class="userDashboardH5">User Information:</h5>
    <label class="userDashboardlabel" for="username">Username: </label>
    <input type="text" class="userDashboardInput" id="username" name="username" readonly value="${userInfo.Name}"></br>
    <label class="userDashboardlabel" for="empId">Employer ID:</label>
    <input type="text" class="userDashboardInput" id="empId" name="empId" readonly value="${userInfo.EmpId}"></br>
    <label class="userDashboardlabel" for="emailid">Email:</label>
    <input type="text" class="userDashboardInput" id="emailid" name="emailid" readonly value="${userInfo.Email}"></br>
  </div>
  <div class = "userDashboardjobnumber">
    <h5>Total Jobs Posted: ${requiredJobList.length}</h5>
    <div>
      <span class="userDashBoardSpan">Active Jobs: ${countjobs()}</span>
      <span class="userDashBoardSpan">Inactive Jobs: ${requiredJobList.length - countjobs()}</span>
    </div>
  </div>
  <div>
    <h5>Last Job Posted:</h5>
    <div class="jobCard">
      <h6 class="jobcardHead">Job Title: ${jobL.jobTitle}</h6>
      <div class="jobCardC">
        <div class="jobCardA">
          <ul>
            <li><span class="jobCardHeding">Job Id:</span> ${jobL.JobId}</li>
            <li><span class="jobCardHeding">Company:</span>  ${jobL.Company}</li>
            <li><span class="jobCardHeding">Description:</span> ${jobL.Description}</li>
          </ul>
        </div>
        <div class="jobCardB">
          <ul>
            <li><span class="jobCardHeding">Application Deadline:</span> ${jobL.Deadline}</li>
            <li><span class="jobCardHeding">Vacancy:</span> ${jobL.Vacancies}</li>
            <li><span class="jobCardHeding">Eligibility:</span> ${jobL.EligibilityCriteria}</li>
            <li><span class="jobCardHeding">Location:</span> ${jobL.JobLocation }</li>
          </ul>
        </div>
      </div>
    </div>
  </div>`;
}

function countjobs(){
  var activeJobCount=0;
  requiredJobList.forEach(element=>{
    if(element.ApplicationStatus === "Open"){
      activeJobCount++;
    }
  })
  return activeJobCount;
}

userDashboardFetch.addEventListener("click", function(){
  userDashboardDisplay.classList.add("active");
  personalInfoDisplay.classList.remove("active");
  jobPostedDisplay.classList.remove("active");
  userDashboardFetch.classList.add("activeBtn");
  personalInfoFetch.classList.remove("activeBtn");
  jobPostedFetch.classList.remove("activeBtn");
})

personalInfoFetch.addEventListener("click", function(){
  userDashboardDisplay.classList.remove("active");
  personalInfoDisplay.classList.add("active");
  jobPostedDisplay.classList.remove("active");
  userDashboardFetch.classList.remove("activeBtn");
  personalInfoFetch.classList.add("activeBtn");
  jobPostedFetch.classList.remove("activeBtn");
})

jobPostedFetch.addEventListener("click", function(){
  userDashboardDisplay.classList.remove("active");
  personalInfoDisplay.classList.remove("active");
  jobPostedDisplay.classList.add("active");
  userDashboardFetch.classList.remove("activeBtn");
  personalInfoFetch.classList.remove("activeBtn");
  jobPostedFetch.classList.add("activeBtn");
})
