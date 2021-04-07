import * as userRepository from './userRepository.js';
import * as paymentRepository from './paymentRepository.js';
import * as busRepository from './busRepository.js';
import initData from './dataLoader.js';

const headDiv = document.querySelector("#navBar");
const bodyDiv = document.querySelector("#mainBody");
const footDiv = document.querySelector("#footer");

//User Session Object
let User = {
  isLoggedIn: false,
  email: '',
  type: ''
};

//Check if first time entering
let user = userRepository.firstTime();
if (user == false) {
  userRepository.setSession(User);
  initData(); //Load fake data into local storage
  userRepository.setFirstTime(); //Set that website has ben loaded.
}

let init = () => {
  User = userRepository.getLoginStatus();

  if (User == false) {
    //User is not loggedIn
  } else {
    if (User.type == 'principle') {
      //Setting Principle NavBar
      headDiv.innerHTML =
        `<div id="navBar">
            <div>
              <ul>
                <li style="float: left">
                  <a style="cursor: pointer" class="TITLE">Payment Management</a>
                </li>
                <li style="float: left">
                  <a style="cursor: pointer" id="pendingPayments">Pending Payments</a>
                </li>
                <li style="float: left">
                  <a style="cursor: pointer" id="busServices">Bus Service</a>
                </li>
                <li style="float: left">
                  <a style="cursor: pointer" id="receivedPaymentsReport">
                    Received Payment Report
                  </a>
                </li>
                <li style="float: left">
                  <a style="cursor: pointer" id="pendingPaymentsReport">
                    Pending Payment Report
                  </a>
                </li>
                <li style="float: left">
                  <a style="cursor: pointer" id="duePayments">
                    Generate Due Payments
                  </a>
                </li>
                <li style="float: right">
                  <a style="cursor: pointer" id="logout">Logout</a>
                </li>
                <li style="float: right"><a id="userEmail">Welcome ${User.email}</a></li>
              </ul>
            </div>
            <div align="center" id="welcome">
              
            </div>
          </div>`;
      buildPrincipleNavBar();
    } else {
      //Setting Parents NavBar
      headDiv.innerHTML =
        `<div id="navBar">
          <div>
            <ul>
              <li style="float: left">
                <a style="cursor: pointer" class="TITLE">Payment Management</a>
              </li>
              <li style="float: left">
                <a style="cursor: pointer" id="pendingPayments">Pending Payments</a>
              </li>
              <li style="float: left">
                <a style="cursor: pointer" id="busServices">Bus Service</a>
              </li>
              <li style="float: left">
                <a style="cursor: pointer" id="paymentHistory">Payment History</a>
              </li> 
              <li style="float: right">
                <a style="cursor: pointer" id="logout">Logout</a>
              </li>
              <li style="float: right"><a id="userEmail">Welcome ${User.email}</a></li>
            </ul>
          </div>
          <div align="center" id="welcome">
            
          </div>
        </div>`;
      buildParentNavBar(User);
    }

    //Logout
    let logoutButton = document.querySelector('#logout');
    logoutButton.addEventListener('click', function () {
      userRepository.setSession({
        isLoggedIn: false,
        email: '',
        type: ''
      });
      location.reload();
    });
  }
}

function buildPrincipleNavBar() {
  //NAVBAR BUTTONS
  let pendingPaymentsButton = document.querySelector('#pendingPayments');
  let busServicesButton = document.querySelector('#busServices');
  let receivedPaymentsReportButton = document.querySelector('#receivedPaymentsReport');
  let pendingPaymentsReportButton = document.querySelector('#pendingPaymentsReport');
  let duePaymentsButton = document.querySelector('#duePayments');

  pendingPaymentsButton.addEventListener("click", () => buildPendingPayments(paymentRepository));
  busServicesButton.addEventListener("click", () => buildBusServicePayment(busRepository, paymentRepository));
  receivedPaymentsReportButton.addEventListener('click', () => buildReceivedPaymentsReport(paymentRepository));
  pendingPaymentsReportButton.addEventListener('click', () => buildPendingPaymentsReport(paymentRepository));
  duePaymentsButton.addEventListener('click', () => buildDuoPayments(paymentRepository));
};

function buildParentNavBar(user) {
  //NAVBAR BUTTONS
  let pendingPaymentsButton = document.querySelector('#pendingPayments');
  let busServicesButton = document.querySelector('#busServices');
  let paymentHistoryButton = document.querySelector('#paymentHistory');

  pendingPaymentsButton.addEventListener('click', () => buildParentsPendingPayments(user, paymentRepository));
  busServicesButton.addEventListener('click', () => buildParentBusService(user, busRepository, userRepository));
  paymentHistoryButton.addEventListener('click', () => buildParentPaymentHistory(user, paymentRepository));
}

init();
