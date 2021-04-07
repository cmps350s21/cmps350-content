////////////////////////////////////////
//Principle Bus Service Builder

function acceptRequest(id, busRepository, paymentRepository) {
  let requests = busRepository.busRepository();
  let payments = paymentRepository.getPendingPayments();


  requests.forEach((request) => {
    if (request.id === id) {
      request.final = true;
      request.status = 'Accepted'
      payments.push({
        "id": payments.length + 1,
        "student_id": request.child_id,
        "type": "Transportation Fee",
        "pending": true,
        "parent_name": request.parent_name,
        "parent_email": request.parent_email,
        "student_name": request.student_name,
        "student_grade": request.student_grade,
        "remaining": 3000,
        "amount": 3000,
        "duoDate": null,
        "date": new Date()
      });
    }
  });
  paymentRepository.setPendingPayments(payments);
  busRepository.setRequests(requests);
  let actionTD = document.querySelector('#request_'.concat(id));
  actionTD.innerHTML = 'Accepted';
}

function rejectRequest(id, busRepository) {
  let requests = busRepository.busRepository();
  requests.forEach((request) => {
    if (request.id === id) {
      request.final = true;
      request.status = 'Rejected'
    }
  });
  busRepository.setRequests(requests);
  let actionTD = document.querySelector('#request_'.concat(id));
  actionTD.innerHTML = 'Rejected';
}

function addComment(id, busRepository) {
  let requests = busRepository.busRepository();
  let commentValue = document.getElementById('comment'.concat(id)).value;
  requests.forEach((request) => {
    if (request.id === id) {
      request.comment = commentValue;
    }
  });
  busRepository.setRequests(requests);
}

function buildBusServicePayment(busRepository, paymentRepository) {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let requests = busRepository.busRepository();
  requests = requests.filter((request) => { return request.final === false });

  let TableRows = requests.map((request) => `
      <tr>
        <td>${request.parent_name}</td>
        <td>${request.parent_email}</td>
        <td>${request.student_name}</td>
        <td>
          <div id="request_${request.id}">
            <a class="actionButton btn-primary btn" style="cursor: pointer" id="acceptRequest_${request.id}">Accept</a>
            <a class="actionButton btn-danger btn" style="cursor: pointer" id="rejectRequest_${request.id}">Reject</a>
            <input type="text" class="actionWrapper" placeholder="Comment" id="comment${request.id}" value="${request.comment}"/>
            <a class="actionButton btn-success btn" style="cursor: pointer" id="comment_${request.id}">Add Comment </a>
          </div>
        </td>
      </tr>
    `);

  welcomeMessageDiv.innerHTML = `
    <h1 style="text-align: center; color: gray">
                  Welcome To Payment Management
                </h1>
                <p style="text-align: center; color: black">
                  Bus Management
                </p>
                <br /><br />
    `;

  bodyDiv.innerHTML = `
    <table id="t01">
      <tr>
        <th>Parent Name</th>
        <th>Parent Email</th>
        <th>Student Name</th>
        <th>Actions</th>
      </tr>
      ${TableRows.join('')}
    </table>
    `;
  requests.forEach((request => {
    let acceptBtn = document.querySelector('#acceptRequest_'.concat(request.id));
    let rejectBtn = document.querySelector('#rejectRequest_'.concat(request.id));
    let addCommentBtn = document.querySelector('#comment_'.concat(request.id));

    acceptBtn.addEventListener('click', () => { acceptRequest(request.id, busRepository, paymentRepository) });
    rejectBtn.addEventListener('click', () => { rejectRequest(request.id, busRepository) });
    addCommentBtn.addEventListener('click', () => { addComment(request.id, busRepository) });
  }))
}