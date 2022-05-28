userCards = ''
userId = ''
postType = ''
postArray = ''

// Populate users to the userCards with variables from the database
function populateUsers(users) {
console.log(users)
for (i = 0; i < users.length; i++) {
console.log("in for loop");
userCards += `
<div class="card">
    <div class="card-body">
        <h4 class="card-title">${users[i].email}</h4>
        <h3 class="card-title">${users[i]._id}</h3>
        <p class="card-text">
            <fieldset id="user${users[i]._id}" disabled>
                <label>First Name: </label>
                <input type="text" id="firstName${users[i]._id}" value="${users[i].firstname}">
                <br>
                <label>Last Name: </label>
                <input type="text" id="lastName${users[i]._id}" value="${users[i].lastname}">
                <br>`
userCards += `
                <br>
                <label>Email: </label>
                <input type="text" id="email${users[i]._id}" value="${users[i].email}">
                <br>
                <label>Admin: </label>
                <input type="text" id="admin${users[i]._id}" value="${users[i].admin}">
                <br>
            </fieldset>
        </p>
        <p>
            <button class="btn btn-primary edit" id="edit${users[i]._id}" value="${users[i]._id}">Edit User</button>
            <button class="btn btn-primary confirm" id="confirm${users[i]._id}" value="${users[i]._id}" type="submit">Confirm</button>
            <button class="btn btn-primary delete" id="delete${users[i]._id}" value="${users[i]._id}">Delete User</button>
        </p>
        </div>
    </div>
</div>`
}
$("#populate").html(userCards)
// document.getElementById(`firstName628da92e152a47172a39f0bd`).value = 'abc'
}

// Edit pressed on a user
function editInfo() {
userId = $(this).attr('value')
document.getElementById(`user${userId}`).disabled = false
}

// Update user info
function updateInfo() {
// Get the following information
userId = $(this).attr('value')
firstName = $(`#firstName${userId}`).val()
lastName = $(`#lastName${userId}`).val()
email = $(`#email${userId}`).val()
admin = $(`#admin${userId}`).val()
document.getElementById(`user${userId}`).disabled = true
console.log(userId);
$.ajax({
// url: `https://warm-cove-79874.herokuapp.com/updateUserInfo`,
url: 'http://localhost:5003/updateUser',
type: 'POST',
data: {
    _id: userId,
    firstname: firstName,
    lastname: lastName,
    email: email,
    admin: admin
},
success: (msg) => {
    alert(msg)
    console.log("user info updated")
}
})
}

function deleteUser() {
userId = $(this).attr('value')
$.ajax({
// url: `https://warm-cove-79874.herokuapp.com/deleteUser`,
url: 'http://localhost:5003/deleteUser',
type: 'POST',
data: {
    _id: userId
},
success: (msg) => {
    console.log("user deleted")
    // reload page
    location.reload()
}
})
}

// Create a new user, add to the database and populate the userCards
function createUser() {
firstName = $(`#firstName`).val()
lastName = $(`#lastName`).val()
email = $(`#email`).val()
admin = $(`#admin`).val()
password = $(`#password`).val()
$.ajax({
// url: `https://warm-cove-79874.herokuapp.com/createUser`,
url: 'http://localhost:5003/createUser',
type: 'POST',
data: {
    firstname: firstName,
    lastname: lastName,
    email: email,
    password: password,
    admin: admin
},
success: (msg) => {
    alert(msg)
    console.log("user created")
}
})
$.ajax({
// url: `https://warm-cove-79874.herokuapp.com/getUsers`,
url: 'http://localhost:5003/getUsers',
type: 'GET',
success: (users) => {
    populateUsers(users)
}
})
}



// Get all users
function getUsers() {
$.ajax({
// url: `https://warm-cove-79874.herokuapp.com/getAllUsers`,
url: 'http://localhost:5003/getAllUsers',
type: 'GET',
success: populateUsers
})
}

// Run setup and populate functions
function setup() {
console.log('setup');
getUsers()
$('body').on('click', '.edit', editInfo)
$('body').on('click', '.confirm', updateInfo)
$('body').on('click', '.delete', deleteUser)
$('body').on('click', '#createUser', createUser)
}

$(document).ready(setup)