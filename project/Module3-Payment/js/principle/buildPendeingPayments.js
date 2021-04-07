////////////////////////////////////////
//Principle Pending Payments Builder
const headDiv = document.querySelector("#navBar");
const bodyDiv = document.querySelector("#mainBody");
const footDiv = document.querySelector("#footer");


function buildPendingPayments(paymentRepository) {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let payments = paymentRepository.getPendingPayments();
  payments = payments.filter((payment) => { return payment.pending === true });

  let TableRows = payments.map((payment) => `
      <tr>
        <td>${payment.parent_name}</td>
        <td>${payment.parent_email}</td>
        <td>${payment.student_name}</td>
        <td>${payment.student_grade}</td>
        <td>${payment.type == 'Duo Payment' ? (payment.type + '(' + new Date(payment.duoDate).toDateString() + ')') : (payment.type)}</td>
        <td>${payment.remaining}</td>
        <td>${payment.amount}</td>
      </tr>
    `);

  welcomeMessageDiv.innerHTML = `
    <h1 style="text-align: center; color: gray">
                  Welcome To Payment Management
                </h1>
                <p style="text-align: center; color: black">
                  Here are the List of Pending Payments
                </p>
                <br /><br />
    `;

  bodyDiv.innerHTML = `
    <table id="t01">
      <tr>
        <th>Parent Name</th>
        <th>Parent Email</th>
        <th>Student Name</th>
        <th>Student Grade</th>
        <th>Payment Category</th>
        <th>Remaining Amount</th>
        <th>Initial Amount</th>
        </tr>
      ${TableRows.join('')}
    </table>
    `;
}