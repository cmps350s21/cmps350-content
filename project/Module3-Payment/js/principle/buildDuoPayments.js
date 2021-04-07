
////////////////////////////////////////
//Principle Duo Payments Report Builder

function buildDuoPayments(paymentRepository) {
    let welcomeMessageDiv = document.querySelector('#welcome');
    let payments = paymentRepository.getPendingPayments();

    let date = new Date();
    let firstDay = new Date(date.getFullYear() + "-01-01").getTime();
    let lastDay = new Date(date.getFullYear() + 1 + "-01-01").getTime();

    //Getting Current Date Payments
    let data = payments.filter(payment => {
        let time = new Date(payment.date).getTime();
        return (firstDay <= time && time < lastDay && payment.type != 'Duo Payment' && payment.pending != false);
    });
    //Getting Payments not to be transferred into Duo Payments
    let restOfData = payments.filter(payment => {
        let time = new Date(payment.date).getTime();
        return (firstDay > time || time >= lastDay || payment.type == 'Duo Payment' || payment.pending == false);
    });

    let amount = 0;
    let remaining = 0;
    let finalPayments = restOfData;
    let DuoPayments = [];
    for (i = 0; i < data.length; i++) {
        let totalAmount = 0;
        let totalRemaining = 0;
        let studentId = data[i].student_id;
        let currentPayment = null;
        data.forEach(payment => {
            if (payment.student_id === studentId) {
                totalAmount += payment.amount;
                totalRemaining += payment.remaining;
                currentPayment = payment;
                payment.pending = false;
            }
        });
        if (!DuoPayments.some(payment => payment.student_id === studentId) && totalRemaining != 0) {
            DuoPayments.push({
                id: DuoPayments.length + restOfData.length + data.length + 1,
                student_id: currentPayment.student_id,
                remaining: totalRemaining,
                amount: totalAmount,
                pending: true,
                student_name: currentPayment.student_name,
                parent_name: currentPayment.parent_name,
                parent_email: currentPayment.parent_email,
                student_grade: currentPayment.student_grade,
                date: new Date(),
                type: 'Duo Payment'
            });
        }
    }

    finalPayments = finalPayments.concat(data, DuoPayments);

    let TableRows = DuoPayments.map((payment) => {
        amount += payment.amount;
        remaining += payment.remaining;
        return `
      <tr>
        <td>${payment.parent_name}</td>
        <td>${payment.parent_email}</td>
        <td>${payment.student_name}</td>
        <td>${payment.student_grade}</td>
        <td>${payment.date.toDateString()}</td>
        <td>${payment.remaining}</td>
        <td>${payment.amount}</td>
      </tr>
    `});
    TableRows.push(
        `
        <tr>
            <td colspan="5">Total</td>
            <td>${remaining}</td>
            <td>${amount}</td>
        </tr>`
    )

    welcomeMessageDiv.innerHTML = `
    <h1 style="text-align: center; color: gray">
                  Welcome To Payment Management
                </h1>
                <p style="text-align: center; color: black">
                  Duo Payments
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
            <a class="actionButton btn-primary btn" style="cursor: pointer" id="filter">Filter</a>
            <div style="float: right">
                <label>Duo Date:</label>
                <input type="date" id="duoDate"">
                <a class="actionButton btn-success btn" style="cursor: pointer" id="duoGenerator">Generate Duo Payments</a>
                <span class="help-block" id="generatorSpan"></span>
            </div>

        </div>
        <table id="t01">
        <tr>
            <th>Parent Name</th>
            <th>Parent Email</th>
            <th>Student Name</th>
            <th>Student Grade</th>
            <th>Payment Date</th>
            <th>Total Remaining</th>
            <th>Total Amount</th>
        </tr>
        <tbody id="tableBody">
            ${TableRows.join('')}
        </tbody>
        </table>
    </div>
    `;

    let year = date.getFullYear();

    let startDate = document.getElementById('startDate');
    startDate.value = year + "-01-01";
    let endDate = document.getElementById('endDate');
    endDate.value = (year + 1) + "-01-01";
    let duoDateInput = document.getElementById('duoDate');
    duoDateInput.value = new Date(date.getTime() + 7 * 3600 * 24 * 1000).toISOString().split('T')[0];

    //Normal Filter
    document.querySelector('#filter').addEventListener('click', () => {
        let sd = new Date(startDate.value).getTime();
        let ed = new Date(endDate.value).getTime() + parseInt("86394000‬");
        payments = paymentRepository.getPendingPayments();
        //Getting Current Date Payments
        data = payments.filter(payment => {
            let time = new Date(payment.date).getTime();
            return (sd <= time && time < ed && payment.type != 'Duo Payment' && payment.pending == true);
        });

        //Getting Payments not to be transferred into Duo Payments
        restOfData = payments.filter(payment => {
            let time = new Date(payment.date).getTime();
            return (sd > time || time >= ed || payment.type == 'Duo Payment' || payment.pending == false);
        });

        let amount = 0;
        let remaining = 0;
        finalPayments = restOfData;
        DuoPayments = [];
        for (i = 0; i < data.length; i++) {
            let totalAmount = 0;
            let totalRemaining = 0;
            let studentId = data[i].student_id;
            let currentPayment = null;
            data.forEach(payment => {
                if (payment.student_id === studentId) {
                    totalAmount += payment.amount;
                    totalRemaining += payment.remaining;
                    currentPayment = payment;
                    payment.pending = false;
                }
            });
            if (!DuoPayments.some(payment => payment.student_id === studentId) && totalRemaining != 0) {
                DuoPayments.push({
                    id: DuoPayments.length + restOfData.length + data.length + 1,
                    student_id: currentPayment.student_id,
                    remaining: totalRemaining,
                    amount: totalAmount,
                    pending: true,
                    student_name: currentPayment.student_name,
                    parent_name: currentPayment.parent_name,
                    parent_email: currentPayment.parent_email,
                    student_grade: currentPayment.student_grade,
                    date: new Date(),
                    type: 'Duo Payment'
                });
            }
        }
        finalPayments = finalPayments.concat(data, DuoPayments);

        let TableRows = DuoPayments.map((payment) => {
            amount += payment.amount;
            remaining += payment.remaining;
            return `
          <tr>
            <td>${payment.parent_name}</td>
            <td>${payment.parent_email}</td>
            <td>${payment.student_name}</td>
            <td>${payment.student_grade}</td>
            <td>${payment.date.toDateString()}</td>
            <td>${payment.remaining}</td>
            <td>${payment.amount}</td>
          </tr>
        `});

        TableRows.push(
            `
            <tr>
                <td colspan="5">Total</td>
                <td>${remaining}</td>
                <td>${amount}</td>
            </tr>`
        );

        document.querySelector('#tableBody').innerHTML = TableRows.join('');
    });

    let generatorSpan = document.getElementById('generatorSpan');
    //Duo Payment Generator
    document.getElementById('duoGenerator').addEventListener('click', () => {
        let duoDate = new Date(duoDateInput.value);
        let sd = new Date(startDate.value).getTime();
        let ed = new Date(endDate.value).getTime() + parseInt("86394000‬");
        payments = paymentRepository.getPendingPayments();

        //Getting Current Date Payments
        data = payments.filter(payment => {
            let time = new Date(payment.date).getTime();
            return (sd <= time && time < ed && payment.type != 'Duo Payment' && payment.pending != false);
        });
        console.log(data);
        //Getting Payments not to be transferred into Duo Payments
        restOfData = payments.filter(payment => {
            let time = new Date(payment.date).getTime();
            return (sd > time || time >= ed || payment.type == 'Duo Payment' || payment.pending == false);
        });

        let amount = 0;
        let remaining = 0;
        finalPayments = restOfData;
        DuoPayments = [];
        for (i = 0; i < data.length; i++) {
            let totalAmount = 0;
            let totalRemaining = 0;
            let studentId = data[i].student_id;
            let currentPayment = null;
            data.forEach(payment => {
                if (payment.student_id === studentId) {
                    totalAmount += payment.amount;
                    totalRemaining += payment.remaining;
                    currentPayment = payment;
                    payment.pending = false;
                }
            });
            if (!DuoPayments.some(payment => payment.student_id === studentId) && totalRemaining != 0) {
                DuoPayments.push({
                    id: DuoPayments.length + restOfData.length + data.length + 1,
                    student_id: currentPayment.student_id,
                    remaining: totalRemaining,
                    amount: totalAmount,
                    pending: true,
                    student_name: currentPayment.student_name,
                    parent_name: currentPayment.parent_name,
                    parent_email: currentPayment.parent_email,
                    student_grade: currentPayment.student_grade,
                    date: new Date(),
                    duoDate: duoDate,
                    type: 'Duo Payment'
                });
            }
        }
        finalPayments = finalPayments.concat(data, DuoPayments);
        paymentRepository.setPendingPayments(finalPayments);

        let TableRows = DuoPayments.map((payment) => {
            amount += payment.amount;
            remaining += payment.remaining;
            return `
          <tr>
            <td>${payment.parent_name}</td>
            <td>${payment.parent_email}</td>
            <td>${payment.student_name}</td>
            <td>${payment.student_grade}</td>
            <td>${payment.date.toDateString()}</td>
            <td>${payment.remaining}</td>
            <td>${payment.amount}</td>
          </tr>
        `});

        TableRows.push(
            `
            <tr>
                <td colspan="5">Total</td>
                <td>${remaining}</td>
                <td>${amount}</td>
            </tr>`
        );

        document.querySelector('#tableBody').innerHTML = TableRows.join('');
        generatorSpan.innerHTML = "Payments Generated Success"
        setTimeout(() => {
            generatorSpan.innerHTML = '';
        }, 3000);
    });
}