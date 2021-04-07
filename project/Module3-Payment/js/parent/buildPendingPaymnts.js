function buildParentsPendingPayments(user, paymentRepository) {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let payments = paymentRepository.getPendingPayments();
  payments = payments.filter((payment) => { return (payment.pending === true && payment.parent_email === user.email) });

  let TableRows = payments.map((payment) => `
      <tr id="payment_${payment.id}">
        <td>${payment.student_name}</td>
        <td>${payment.student_grade}</td>
        <td>${payment.type == 'Duo Payment' ? (payment.type + '(' + new Date(payment.duoDate).toDateString() + ')') : (payment.type)}</td>
        <td id="amount${payment.id}">${payment.remaining}</td>
        <td>
          <div>
            <input type="number" class="actionWrapper" placeholder="Amount" id="amount_${payment.id}" max="${payment.remaining}" min="1" />
            <select name="payment_method" id="payment_method${payment.id}" class="form-select">
              <option value="1">Cash</option>
              <option value="2">Bank Card</option>
              <option value="3">Credit Card</option>
              <option value="4">Cheque</option>
              <option value="5">Bank Deposit</option>
            </select>
            <a class="actionButton btn-primary btn" style="cursor: pointer" id="pay_${payment.id}">Pay</a>
            <span class="help-block" id="payment_error${payment.id}"></span>
          </div>
        </td>
      </tr>
    `);

  welcomeMessageDiv.innerHTML = `
    <h1 style="text-align: center; color: gray">
                  Welcome To Payment Management
                </h1>
                <p style="text-align: center; color: black">
                  Here is the list of your Pending Payments
                </p>
                <br /><br />
    `;

  bodyDiv.innerHTML = `
    <table id="t01">
      <tr>
        <th>Student Name</th>
        <th>Student Grade</th>
        <th>Payment Type</th>
        <th>Remaining Amount</th>
        <th>Pay Now</th>
      </tr>
      ${TableRows.join('')}
    </table>
    `;

  payments.forEach((payment => {
    let payButton = document.querySelector('#pay_'.concat(payment.id));
    let errorSpan = document.querySelector('#payment_error'.concat(payment.id));
    let row = document.querySelector('#payment_'.concat(payment.id));

    payButton.addEventListener('click', () => {
      errorSpan.innerHTML = '';
      let paidAmount = document.getElementById('amount_'.concat(payment.id)).value;
      let paymentType = document.getElementById('payment_method'.concat(payment.id)).value;

      if (paidAmount > payment.remaining || paidAmount < 1)
        errorSpan.innerHTML = 'Error Paid Amount Invalid';
      else {
        let remainingAmount = payment.remaining - paidAmount;
        if (remainingAmount == 0) {
          row.parentNode.removeChild(row);
          payment.pending = false;
          payment.remaining = 0;
        } else {
          let paymentAmount = document.getElementById('amount'.concat(payment.id));
          paymentAmount.innerHTML = remainingAmount;
          errorSpan.innerHTML = 'Payment Success';
          payment.remaining = remainingAmount;
        }
        paymentRepository.addNewPayment(payment, paymentType, paidAmount);
      }
    });
  }))
}