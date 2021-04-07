////////////////////////////////////////
//Principle Pending Payments Builder

function buildPendingPaymentsReport(paymentRepository) {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let payments = paymentRepository.getPendingPayments();
  payments = payments.filter((payment) => { return payment.pending === true });

  let remaining = 0;
  let amount = 0;

  let TableRows = payments.map((payment) => {
    remaining += payment.remaining;
    amount += payment.amount;
    return `
      <tr>
        <td>${payment.parent_name}</td>
        <td>${payment.parent_email}</td>
        <td>${payment.student_name}</td>
        <td>${payment.student_grade}</td>
        <td>${payment.type == 'Duo Payment' ? (payment.type + '(' + new Date(payment.duoDate).toDateString() + ')') : (payment.type)}</td>
        <td>${payment.remaining}</td>
        <td>${payment.amount}</td>
      </tr>
    `});
  TableRows.push(
    `<tr>
      <td colspan="5">Total</td>
      <td  id="remaining">${remaining}</td>
      <td  id="initial">${amount}</td>
    </tr>`
  );

  welcomeMessageDiv.innerHTML = `
    <h1 style="text-align: center; color: gray">
                  Welcome To Payment Management
                </h1>
                <p style="text-align: center; color: black">
                  Pending Payments Report
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
        <a class="actionButton btn-primary btn" style="cursor: pointer" id="filter">Filter</a>
      </div>
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
        <tbody id="tableBody">
          ${TableRows.join('')}
        </tbody>
      </table>
    </div>
    `;

  document.getElementById('filter').addEventListener('click', () => {
    let filterType = document.getElementById('filterType').value;

    let data = payments;

    amount = 0;
    remaining = 0;

    data = data.filter(payment => {
      if (filterType === 'all')
        return true;
      return (payment.type == filterType);
    });

    TableRows = data.map((payment) => {
      remaining += payment.remaining;
      amount += payment.amount;
      return `
        <tr>
          <td>${payment.parent_name}</td>
          <td>${payment.parent_email}</td>
          <td>${payment.student_name}</td>
          <td>${payment.student_grade}</td>
          <td>${payment.type == 'Duo Payment' ? (payment.type + '(' + new Date(payment.duoDate).toDateString() + ')') : (payment.type)}</td>
          <td>${payment.remaining}</td>
          <td>${payment.amount}</td>
        </tr>
      `});

    TableRows.push(
      `<tr>
        <td colspan="5">Total</td>
        <td  id="remaining">${remaining}</td>
        <td  id="initial">${amount}</td>
      </tr>`
    );

    document.querySelector('#tableBody').innerHTML = TableRows.join('');
  });
}
