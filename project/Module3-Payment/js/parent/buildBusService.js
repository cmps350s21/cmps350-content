function buildSelectOptions(array) {
  return array.map(child =>
    `
      <option value="${child.id}">${child.name}</option>
      `
  );
}

function buildRows(array) {
  return array.map((request) => `
    <tr>
      <td>${request.parent_name}</td>
      <td>${request.parent_email}</td>
      <td>${request.student_name}</td>
      <td>${request.status}</td>
      <td>
        <div id="request_${request.id}">
          <input type="text" class="actionWrapperText" readonly value="${request.comment || 'none'}"/>
        </div>
      </td>
    </tr>
  `);
}


function buildBusServiceBody(selectOptions, TableRows) {
  document.getElementById('studentId').innerHTML = selectOptions.join('');
  document.getElementById('tableBody').innerHTML = TableRows.join('');
}

function buildParentBusService(user, busRepository, userRepository) {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let requests = busRepository.busRepository();
  requests = requests.filter((request) => { return (request.parent_email === user.email) });
  let users = userRepository.getUsers();
  let childrenWithService = requests.map(u => u.child_id);
  user = users.filter(u => u.email === user.email)[0];
  let childrenWithNoServices = user.children.filter(u => !childrenWithService.includes(u.id));

  let selectOptions = buildSelectOptions(childrenWithNoServices);

  let TableRows = buildRows(requests);

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
    <div>
      <div class="filter">
        <label>Request Service For Student:</label>
        <select id="studentId" class="form-select" style="width: 100px">

        </select>
        <a class="actionButton btn-primary btn" style="cursor: pointer" id="requestService">Request</a>
      </div>
      <table id="t01">
        <tr>
          <th>Parent Name</th>
          <th>Parent Email</th>
          <th>Student Name</th>
          <th>Status</th>
          <th>Comments</th>
        </tr>
        <tbody id="tableBody">
        </tbody>
      </table>
    </div>
    `;

  buildBusServiceBody(selectOptions, TableRows);

  document.querySelector('#requestService').addEventListener('click', () => {
    let selectedChild = document.getElementById('studentId').value;
    requests = busRepository.busRepository();
    selectedChild = childrenWithNoServices.find((u) => u.id == selectedChild);
    childrenWithNoServices.splice(childrenWithNoServices.indexOf(selectedChild), 1);

    selectOptions = buildSelectOptions(childrenWithNoServices)
    document.getElementById('studentId').innerHTML = selectOptions.join('');
    requests.push({
      "id": requests.length + 1,
      "student_name": selectedChild.name,
      "status": "pending",
      "child_id": selectedChild.id,
      "final": false,
      "parent_name": user.name,
      "parent_email": user.email,
      "comment": '',
      "student_grade": selectedChild.grade
    });
    busRepository.setRequests(requests);
    requests = requests.filter((request) => { return (request.parent_email === user.email) });

    TableRows = buildRows(requests);

    buildBusServiceBody(selectOptions, TableRows);
  })
}
