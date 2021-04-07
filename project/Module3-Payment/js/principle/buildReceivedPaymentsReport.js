
////////////////////////////////////////
//Principle Received Payments Report Builder

function buildPaymentRows(array) {
  return array.map((payment) => `
    <tr>
      <td>${payment.student}</td>
      <td>${payment.email}</td>
      <td>${payment.type}</td>
      <td>${payment.category}</td>
      <td>${payment.amount}</td>
      <td>${payment.remaining}</td>
      <td>${new Date(payment.date).toDateString()}</td>
    </tr>
  `);
}


function buildReceivedPaymentsReport(paymentRepository) {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let payments = paymentRepository.getPaymentHistory();

  let date = new Date();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  let lastDay = new Date(firstDay);
  lastDay.setMonth(lastDay.getMonth() + 1);
  lastDay = lastDay.getTime();
  let amount = 0;
  //Getting Current Date Payments
  let data = payments.filter(payment => {
    let time = new Date(payment.date).getTime();
    return (firstDay <= time && time < lastDay);
  });

  data.forEach(payment => { amount += parseInt(payment.amount); });

  let TableRows = buildPaymentRows(data);

  welcomeMessageDiv.innerHTML = `
    <h1 style="text-align: center; color: gray">
                  Welcome To Payment Management
                </h1>
                <p style="text-align: center; color: black">
                  Received Payment Report
                </p>
                <br /><br />
    `;

  bodyDiv.innerHTML = `
    <div>
      <div class="filter">
        <label>Filter Data By Category:</label>
        <select id="filterType" class="form-select w-40">
          <option value="all">All</option>
          <option value="Tuition Fee">Tuition Fee</option>
          <option value="Transportation Fee">Transportation Fee</option>
          <option value="Admission Fee">Admission Fee</option>
          <option value="Duo Payment">Duo Payment</option>
        </select>
        <label>Start Date:</label>
        <input type="date" id="startDate">
        <label>End Date:</label>
        <input type="date" id="endDate"">
        <a class="actionButton btn-primary btn" style="cursor: pointer" id="filter">Filter</a>
      </div>
      <div class="filter">
        <input type="text" id="searchBar" placeholder="Enter Students' Name" class="search-bar">
      </div>
      <table id="t01">
        <tr>
          <th>Student Name</th>
          <th>Parent Email</th>
          <th>Payment Type</th>
          <th>Category</th>
          <th>Received</th>
          <th>Remaining</th>
          <th>Date</th>
        </tr>
        <tbody id="tableBody">
          ${TableRows.join('')}
          <tr>
            <td colspan="5">Total Received</td>
            <td colspan="2" id="amount">${amount}</td>
          </tr>
        </tbody>
      </table>
    </div>
    `;

  let startDate = document.getElementById('startDate');
  startDate.value = date.toISOString().split('T')[0];
  let endDate = document.getElementById('endDate');
  date.setMonth(date.getMonth() + 1);
  endDate.value = date.toISOString().split('T')[0];

  let filter = false;
  //Normal Filter
  document.querySelector('#filter').addEventListener('click', () => {
    filter = true;
    let searchValue = document.getElementById('searchBar').value;
    searchValue = searchValue.toUpperCase();
    let filterType = document.getElementById('filterType').value;
    let sd = new Date(startDate.value).getTime();
    //End date is the end of the day so 86394000 is 23 hours 59 minutes 59 seconds in milliseconds
    let ed = new Date(endDate.value).getTime() + parseInt("86394000‬");

    data = payments;
    amount = 0;

    if (searchValue.length != 0)
      data = data.filter(payment => {
        let time = new Date(payment.date).getTime();
        if (filterType === 'all')
          return (payment.student.toUpperCase().indexOf(searchValue) !== -1 && sd <= time && time < ed);
        return (sd <= time && time < ed && payment.category == filterType && payment.student.toUpperCase().indexOf(searchValue) !== -1);
      });
    else
      data = data.filter(payment => {
        let time = new Date(payment.date).getTime();
        if (filterType === 'all')
          return (sd <= time && time < ed);
        return (sd <= time && time < ed && payment.category == filterType);
      });

    data.forEach(payment => { amount += parseInt(payment.amount); });
    TableRows = buildPaymentRows(data);
    TableRows.push(
      `<tr>
        <td colspan="5">Total Received</td>
        <td colspan="2" id="amount">${amount}</td>
      </tr>`
    );

    document.querySelector('#tableBody').innerHTML = TableRows.join('');
  });

  document.querySelector('#searchBar').addEventListener('keyup', () => {
    let searchValue = document.getElementById('searchBar').value;
    searchValue = searchValue.toUpperCase();
    let filterType = document.getElementById('filterType').value;

    let sd = new Date(startDate.value).getTime();
    //End date is the end of the day so 86394000 is 23 hours 59 minutes 59 seconds in milliseconds
    let ed = new Date(endDate.value).getTime() + parseInt("86394000‬");

    data = payments;
    amount = 0;
    if (filter)
      data = data.filter(payment => {
        let time = new Date(payment.date).getTime();
        if (filterType === 'all')
          return (payment.student.toUpperCase().indexOf(searchValue) !== -1 && sd <= time && time < ed);
        return (sd <= time && time < ed && payment.category == filterType && payment.student.toUpperCase().indexOf(searchValue) !== -1);
      });
    else {
      data = data.filter(payment => {
        return (payment.student.toUpperCase().indexOf(searchValue) !== -1);
      });
    }
    data.forEach(payment => { amount += parseInt(payment.amount); });
    TableRows = buildPaymentRows(data);
    TableRows.push(
      `<tr>
        <td colspan="5">Total Received</td>
        <td colspan="2" id="amount">${amount}</td>
      </tr>`);

    document.querySelector('#tableBody').innerHTML = TableRows.join('');
  });
}

