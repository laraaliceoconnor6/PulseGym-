// PulseFit Gym frontend code
console.log("Frontend JS loaded");

//Populate trainer dropdowns with specialities+ Auto  fill class name
async function populateTrainerDropdown() {
    try {
        const res = await fetch('http://localhost:3000/trainers');
        if (!res.ok) throw new Error(`Failed to fetch trainers: ${res.status}`);
        const trainers = await res.json();

        const addSelect = document.getElementById('addClassTrainer');
        const updateSelect = document.getElementById('updateClassTrainer');

        [addSelect, updateSelect].forEach(select => {
            select.innerHTML = '<option value="">Select Trainer</option>';

            trainers.forEach(t => {
                const option = document.createElement('option');
                option.value = t.trainer_id;
                option.textContent = `${t.first_name} ${t.last_name}`;
                option.dataset.speciality = t.speciality;
                select.appendChild(option);
            });

            //Event listener to update speciality and auto-fill class name
            select.addEventListener('change', (e) => {
                const selectedOption = e.target.selectedOptions[0];
                const speciality = selectedOption.dataset.speciality || '';
                const trainerName = selectedOption.textContent || '';

                //selects inputs to update
                const specialityInput = (e.target.id === 'addClassTrainer')
                    ? document.getElementById('addClassSpeciality')
                    : document.getElementById('updateClassSpeciality');

                const classNameInput = (e.target.id === 'addClassTrainer')
                    ? document.getElementById('addClassName')
                    : document.getElementById('updateClassName');

                if (specialityInput) {
                    specialityInput.value = speciality;
                    specialityInput.disabled = true; //read-only
                }
                if (classNameInput) {
                    classNameInput.value = `${speciality} class with ${trainerName}`;

                }
            });
        });
    } catch (err) {
        console.error('Error loading trainers:', err);
    }
}

//Populate trainer dropdowns when page loads
window.addEventListener('DOMContentLoaded', populateTrainerDropdown);

//Hide and show forms when needed
function hideForms() {
    document.querySelectorAll('.crud-form').forEach(form => form.classList.add('d-none'));
}

function showForm(type) {
    hideForms();
    if(type === 'add') document.getElementById('addForm').classList.remove('d-none');
    if(type === 'view') document.getElementById('viewForm').classList.remove('d-none');
    if(type === 'update') document.getElementById('updateForm').classList.remove('d-none');
    if(type === 'delete') document.getElementById('deleteForm').classList.remove('d-none');
}

//MEMBERS CRUD
async function submitAddMember(event) {
    event.preventDefault();
    const data = {
        first_name: document.getElementById('addFirstName').value,
        last_name: document.getElementById('addLastName').value,
        date_joined: document.getElementById('addDateJoined').value,
        membership_type: document.getElementById('addMembershipType').value,
        bank_account: document.getElementById('addBankAcc').value
    };
    const res = await fetch('http://localhost:3000/members', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message);
    hideForms();
}

async function submitUpdateMember(event) {
    event.preventDefault();
    const id = document.getElementById('updateID').value;
    const data = {
        first_name: document.getElementById('updateFirstName').value,
        last_name: document.getElementById('updateLastName').value,
        date_joined: document.getElementById('updateDateJoined').value,
        membership_type: document.getElementById('updateMembershipType').value,
        bank_account: document.getElementById('updateBankAcc').value
    };
    const res = await fetch(`http://localhost:3000/members/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message);
    hideForms();
}

async function submitDeleteMember(event) {
    event.preventDefault();
    const id = document.getElementById('deleteID').value;
    const res = await fetch(`http://localhost:3000/members/${id}`, { method: 'DELETE' });
    const result = await res.json();
    alert(result.message);
    hideForms();
}

async function showMembers() {
    hideForms();
    const res = await fetch('http://localhost:3000/members');
    const members = await res.json();
    const tbody = document.getElementById('memberTableBody');
    tbody.innerHTML = '';
    members.forEach(m => {
        tbody.innerHTML += `
            <tr>
                <td>${m.member_id}</td>
                <td>${m.first_name}</td>
                <td>${m.last_name}</td>
                <td>${m.date_joined}</td>
                <td>${m.membership_type}</td>
                <td>${m.bank_account}</td>
            </tr>
        `;
    });
    document.getElementById('viewForm').classList.remove('d-none');
}

//TRAINERS CRUD
function hideTrainerForms() {
    document.querySelectorAll('#trainerForms .crud-form').forEach(f => f.classList.add('d-none'));
}

function showTrainerForm(type) {
    hideTrainerForms();
    if(type === 'add') document.getElementById('addTrainerForm').classList.remove('d-none');
    if(type === 'view') showTrainers();
    if(type === 'update') document.getElementById('updateTrainerForm').classList.remove('d-none');
    if(type === 'delete') document.getElementById('deleteTrainerForm').classList.remove('d-none');
}

async function submitAddTrainer(event) {
    event.preventDefault();
    const data = {
        first_name: document.getElementById('addTrainerFirstName').value,
        last_name: document.getElementById('addTrainerLastName').value,
        date_joined: document.getElementById('addTrainerDateJoined').value,
        speciality: document.getElementById('addTrainerSpeciality').value
    };
    try {
        const res = await fetch('http://localhost:3000/trainers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const result = await res.json();
        alert(result.message);
        hideTrainerForms();
        //refresh class trainer dropdowns after adding new trainer
        populateTrainerDropdown();
    } catch (err) {
        console.error('Error submitting trainer:', err);
        alert('Failed to add trainer. Check console.');
    }
}

async function showTrainers() {
    hideTrainerForms();
    try {
        const res = await fetch('http://localhost:3000/trainers');
        if (!res.ok) throw new Error('Failed to fetch trainers');
        const trainers = await res.json();
        const tbody = document.getElementById('trainerTableBody');
        tbody.innerHTML = '';
        trainers.forEach(t => {
            tbody.innerHTML += `
                <tr>
                    <td>${t.trainer_id}</td>
                    <td>${t.first_name}</td>
                    <td>${t.last_name}</td>
                    <td>${t.date_joined}</td>
                    <td>${t.speciality}</td>
                </tr>
            `;
        });
        document.getElementById('viewTrainerForm').classList.remove('d-none');
    } catch (err) {
        console.error('Error loading trainers:', err);
        alert('Error loading trainers. Check console.');
    }
}

async function submitUpdateTrainer(event) {
    event.preventDefault();
    const id = document.getElementById('updateTrainerID').value;
    const data = {
        first_name: document.getElementById('updateTrainerFirstName').value,
        last_name: document.getElementById('updateTrainerLastName').value,
        date_joined: document.getElementById('updateTrainerDateJoined').value,
        speciality: document.getElementById('updateTrainerSpeciality').value
    };
    const res = await fetch(`http://localhost:3000/trainers/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message);
    hideTrainerForms();
    populateTrainerDropdown();
}

async function submitDeleteTrainer(event) {
    event.preventDefault();
    const id = document.getElementById('deleteTrainerID').value;
    const res = await fetch(`http://localhost:3000/trainers/${id}`, { method: 'DELETE' });
    const result = await res.json();
    alert(result.message);
    hideTrainerForms();
    populateTrainerDropdown();
}

//CLASS CRUD
function hideClassForms() {
    document.querySelectorAll('#classForms .crud-form').forEach(f => f.classList.add('d-none'));
}

function showClassForm(type) {
    hideClassForms();
    if (type === 'add') document.getElementById('addClassForm').classList.remove('d-none');
    if (type === 'view') showClasses();
    if (type === 'update') document.getElementById('updateClassForm').classList.remove('d-none');
    if (type === 'delete') document.getElementById('deleteClassForm').classList.remove('d-none');
}

async function submitAddClass(event) {
    event.preventDefault();
    const data = {
        class_name: document.getElementById('addClassName').value,
        class_day: document.getElementById('addClassDay').value,
        class_time: document.getElementById('addClassTime').value,
        trainer_id: document.getElementById('addClassTrainer').value,
        max_members: document.getElementById('addClassMax').value
    };
    try {
        const res = await fetch('http://localhost:3000/classes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const result = await res.json();
        alert(result.message);
        hideClassForms();
    } catch (err) {
        console.error('Error adding class:', err);
        alert('Failed to add class. Check console.');
    }
}

async function showClasses() {
    hideClassForms();
    try {
        const [classRes, trainerRes] = await Promise.all([
            fetch('http://localhost:3000/classes'),
            fetch('http://localhost:3000/trainers')
        ]);
        if (!classRes.ok) throw new Error('Failed to fetch classes');
        if (!trainerRes.ok) throw new Error('Failed to fetch trainers');

        const classes = await classRes.json();
        const trainers = await trainerRes.json();
        const trainerMap = {};
        trainers.forEach(t => { trainerMap[t.trainer_id] = `${t.first_name} ${t.last_name}`; });

        const tbody = document.getElementById('classTableBody');
        tbody.innerHTML = '';
        classes.forEach(c => {
            const trainerName = trainerMap[c.trainer_id] || c.trainer_id;
            tbody.innerHTML += `
                <tr>
                    <td>${c.class_id}</td>
                    <td>${c.class_name}</td>
                    <td>${c.class_day}</td>
                    <td>${c.class_time}</td>
                    <td>${trainerName}</td>
                    <td>${c.max_members}</td>
                </tr>
            `;
        });
        document.getElementById('viewClassForm').classList.remove('d-none');
    } catch (err) {
        console.error('Error loading classes:', err);
        alert('Error loading classes. Check console.');
    }
}

async function submitUpdateClass(event) {
    event.preventDefault();
    const id = document.getElementById('updateClassID').value;
    const data = {
        class_name: document.getElementById('updateClassName').value,
        class_day: document.getElementById('updateClassDay').value,
        class_time: document.getElementById('updateClassTime').value,
        trainer_id: document.getElementById('updateClassTrainer').value,
        max_members: document.getElementById('updateClassMax').value
    };
    try {
        const res = await fetch(`http://localhost:3000/classes/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const result = await res.json();
        alert(result.message);
        hideClassForms();
    } catch (err) {
        console.error('Error updating class:', err);
        alert('Failed to update class. Check console.');
    }
}

async function submitDeleteClass(event) {
    event.preventDefault();
    const id = document.getElementById('deleteClassID').value;
    try {
        const res = await fetch(`http://localhost:3000/classes/${id}`, { method: 'DELETE' });
        const result = await res.json();
        alert(result.message);
        hideClassForms();
    } catch (err) {
        console.error('Error deleting class:', err);
        alert('Failed to delete class. Check console.');
    }
}
