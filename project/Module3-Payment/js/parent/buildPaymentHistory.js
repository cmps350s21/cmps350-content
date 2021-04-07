function buildParentPaymentHistory(user, paymentRepository) {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let payments = paymentRepository.getPaymentHistory();
  payments = payments.filter((payment) => { return (payment.email === user.email) });

  let TableRows = payments.map((payment) => `
      <tr id="payment_${payment.id}">
        <td>${payment.student}</td>
        <td>${payment.type}</td>
        <td>${payment.amount}</td>
        <td>${payment.remaining}</td>
        <td>${new Date(payment.date).toDateString()}</td>
      </tr>
    `);

  welcomeMessageDiv.innerHTML = `
    <h1 style="text-align: center; color: gray">
                  Welcome To Payment Management
                </h1>
                <p style="text-align: center; color: black">
                  Here is the list of your Payments
                </p>
                <br /><br />
    `;

  bodyDiv.innerHTML = `
    <div>
      <div class="filter">
        <label>Start Date:</label>
        <input type="date" id="startDate">
        <label>End Date:</label>
        <input type="date" id="endDate"">
        <a class="actionButton btn-primary btn" id="filter" style="cursor: pointer">Filter</a>
      </div>
      <table id="t01">
        <tr>
          <th>Student Name</th>
          <th>Payment Type</th>
          <th>Payed Amount</th>
          <th>Remaining Amount</th>
          <th>Date</th>
        </tr>
        <tbody id="tableBody">
          ${TableRows.join('')}
        <tbody>
      </table>
    </div>
    `;

  let date = new Date();
  let startDate = document.getElementById('startDate');
  startDate.value = date.toISOString().split('T')[0];
  let endDate = document.getElementById('endDate');
  endDate.value = date.toISOString().split('T')[0];

  //Filter Function
  document.querySelector('#filter').addEventListener('click', () => {
    let sd = new Date(startDate.value).getTime();
    //End date is the end of the day so 86394000 is 23 hours 59 minutes 59 seconds in milliseconds
    let ed = new Date(endDate.value).getTime() + parseInt("86394000‬");

    let payments = paymentRepository.getPaymentHistory();

    payments = payments.filter(payment => {
      let time = new Date(payment.date).getTime();
      return (sd <= time && time < ed && payment.email === user.email);
    });
    let TableRows = payments.map((payment) => `
        <tr id="payment_${payment.id}">
          <td>${payment.student}</td>
          <td>${payment.type}</td>
          <td>${payment.amount}</td>
          <td>${payment.remaining}</td>
          <td>${new Date(payment.date).toDateString()}</td>
        </tr>
      `);
    document.querySelector('#tableBody').innerHTML = TableRows.join('');
  });
}
