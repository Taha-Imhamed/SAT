// Global variables
let users = [
    { id: 1, username: "admin_taha", role: "Admin", email: "admin@example.com", status: "Active" },
    { id: 2, username: "dispatcher1", role: "Dispatcher", email: "dispatcher1@example.com", status: "Active" },
    { id: 3, username: "officer1", role: "Officer", email: "officer1@example.com", status: "Inactive" }
];

let cases = [
    { id: 1, title: "Theft Report", location: "123 Main St", status: "Open", assignedTo: "officer1", priority: "High", created: "2025-03-25" },
    { id: 2, title: "Traffic Incident", location: "456 Oak Ave", status: "In Progress", assignedTo: "officer1", priority: "Medium", created: "2025-03-28" },
    { id: 3, title: "Noise Complaint", location: "789 Pine Rd", status: "Closed", assignedTo: "dispatcher1", priority: "Low", created: "2025-03-29" }
];

let officers = [
    { id: 1, name: "John Smith", badge: "B-1234", status: "On Duty", location: "Downtown", lastUpdate: "2025-04-01 09:30 AM" },
    { id: 2, name: "Maria Garcia", badge: "B-2345", status: "Off Duty", location: "N/A", lastUpdate: "2025-03-31 08:15 PM" },
    { id: 3, name: "David Johnson", badge: "B-3456", status: "On Call", location: "East District", lastUpdate: "2025-04-01 10:45 AM" }
];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeClock();
    updateStats();
    setupEventListeners();
    updateQuickActions();
    showDashboard();
    
    // Remove modal element (we use inline sections instead)
    const modalElement = document.getElementById('user-management-modal');
    if (modalElement) modalElement.remove();
});

// Initialize and update the system clock
function initializeClock() {
    const systemClockElement = document.getElementById('system-clock');
    function updateClock() {
        const now = new Date();
        const options = { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        };
        systemClockElement.textContent = now.toLocaleDateString('en-US', options);
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// Update dashboard statistics
function updateStats() {
    document.getElementById('total-users-stat').textContent = users.length;
    const activeUsers = users.filter(user => user.status === 'Active').length;
    document.getElementById('active-users-stat').textContent = activeUsers;
}

// Set up all event listeners
function setupEventListeners() {
    // User Management buttons
    document.querySelectorAll('#user-management-btn').forEach(btn => {
        btn.addEventListener('click', openUserManagementSection);
    });
    
    // Add sidebar navigation event listeners
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            document.querySelectorAll('.sidebar-nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Handle different menu items
            const menuText = this.textContent.trim();
            switch(menuText) {
                case 'Dashboard': showDashboard(); break;
                case 'User Management': openUserManagementSection(); break;
                case 'System Settings': openSystemSettings(); break;
                case 'Reports': openReports(); break;
                case 'Analytics': openAnalytics(); break;
                default: showDashboard();
            }
        });
    });
    
    // Other dashboard buttons
    document.getElementById('add-user-form')?.addEventListener('submit', addNewUser);
    document.getElementById('generate-report-btn')?.addEventListener('click', generateReport);
    document.getElementById('system-backup-btn')?.addEventListener('click', startSystemBackup);
    document.getElementById('edit-case-btn')?.addEventListener('click', openCaseManagement);
    document.getElementById('add-case-btn')?.addEventListener('click', openCaseManagement);
    document.getElementById('officer-management-btn')?.addEventListener('click', openOfficerManagement);
}

// Update the quick actions buttons
function updateQuickActions() {
    const quickActions = document.querySelector('.action-buttons');
    if (!quickActions) return;
    
    quickActions.innerHTML = '';
    
    // Add all action buttons
    const buttons = [
        { id: 'user-management-btn', text: 'User Management' },
        { id: 'case-management-btn', text: 'Case Management' },
        { id: 'officer-management-btn', text: 'Officer Management' },
        { id: 'add-case-btn', text: 'Add New Case' },
        { id: 'edit-case-btn', text: 'Edit Cases' },
        { id: 'generate-report-btn', text: 'Generate Report' },
        { id: 'system-backup-btn', text: 'System Backup' }
    ];
    
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.id = btn.id;
        button.className = 'action-btn';
        button.textContent = btn.text;
        quickActions.appendChild(button);
    });
    
    // Re-attach event listeners
    document.getElementById('user-management-btn')?.addEventListener('click', openUserManagementSection);
    document.getElementById('case-management-btn')?.addEventListener('click', openCaseManagement);
    document.getElementById('officer-management-btn')?.addEventListener('click', openOfficerManagement);
    document.getElementById('add-case-btn')?.addEventListener('click', () => openAddCase());
    document.getElementById('edit-case-btn')?.addEventListener('click', () => openCaseManagement());
    document.getElementById('generate-report-btn')?.addEventListener('click', generateReport);
    document.getElementById('system-backup-btn')?.addEventListener('click', startSystemBackup);
}

// Show dashboard and hide all other sections
function showDashboard() {
    // Hide all sections
    hideAllSections();
    
    // Show the dashboard content
    document.querySelector('.admin-stats').style.display = 'grid';
    document.querySelector('.quick-actions').style.display = 'block';
    
    // Make sure Dashboard menu item is active
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (link.textContent.trim() === 'Dashboard') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Hide all sections except header
function hideAllSections() {
    document.querySelector('.admin-stats').style.display = 'none';
    document.querySelector('.quick-actions').style.display = 'none';
    
    // Remove any custom sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.remove());
}

// Generate a sample report
function generateReport() {
    alert('Generating report...');
    
    setTimeout(() => {
        const reportDate = new Date().toLocaleDateString();
        const reportContent = `
            System Report - ${reportDate}
            ---------------------------
            Total Users: ${users.length}
            Active Users: ${users.filter(user => user.status === 'Active').length}
            System Health: 98%
            
            User Distribution by Role:
            - Admin: ${users.filter(user => user.role === 'Admin').length}
            - Dispatcher: ${users.filter(user => user.role === 'Dispatcher').length}
            - Officer: ${users.filter(user => user.role === 'Officer').length}
        `;
        
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `system_report_${reportDate.replace(/\//g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        alert('Report generated successfully!');
    }, 1500);
}

// Start system backup process
function startSystemBackup() {
    const progressBar = document.getElementById('backup-progress');
    const backupBtn = document.getElementById('system-backup-btn');
    
    // Display progress bar and disable button
    progressBar.style.display = 'block';
    progressBar.value = 0;
    backupBtn.disabled = true;
    backupBtn.textContent = 'Backup in progress...';
    
    // Simulate backup progress
    let progress = 0;
    const backupInterval = setInterval(() => {
        progress += 5;
        progressBar.value = progress;
        
        if (progress >= 100) {
            clearInterval(backupInterval);
            backupBtn.disabled = false;
            backupBtn.textContent = 'System Backup';
            
            // Hide progress bar after a delay
            setTimeout(() => {
                progressBar.style.display = 'none';
                alert('System backup completed successfully!');
            }, 500);
        }
    }, 200);
}

// User Management Functions

// Show User Management in main content
function openUserManagementSection() {
    // Hide all sections
    hideAllSections();
    
    // Create and show user management content
    const userManagementSection = document.createElement('div');
    userManagementSection.id = 'user-management-section';
    userManagementSection.className = 'admin-section';
    userManagementSection.innerHTML = `
        <div class="section-header">
            <h2>User Management</h2>
            <button id="back-to-dashboard" class="back-btn">Back to Dashboard</button>
        </div>
        
        <!-- Add User Form -->
        <form id="add-user-form" class="add-user-form">
            <h3>Add New User</h3>
            <input type="text" id="new-username" placeholder="Username" required>
            <input type="email" id="new-email" placeholder="Email" required>
            <select id="new-role" required>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Officer">Officer</option>
            </select>
            <button type="submit">Add User</button>
        </form>

        <!-- User Table -->
        <table class="user-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="user-table-body">
                <!-- Users will be dynamically inserted here -->
            </tbody>
        </table>
    `;
    
    // Append to main content
    document.querySelector('.main-content').appendChild(userManagementSection);
    
    // Add event listener to back button
    document.getElementById('back-to-dashboard').addEventListener('click', showDashboard);
    
    // Update the user table
    updateUserTable();
    
    // Re-attach event listener to add user form
    document.getElementById('add-user-form').addEventListener('submit', addNewUser);
}

// Update the user table with current users
function updateUserTable() {
    const tableBody = document.getElementById('user-table-body');
    if (!tableBody) return; // Guard clause in case table isn't rendered yet
    
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        
        // Create table cells for each property
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${user.email}</td>
            <td>
                <span class="status-indicator ${user.status.toLowerCase()}">${user.status}</span>
            </td>
            <td>
                <button class="toggle-status-btn" data-id="${user.id}">
                    ${user.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                <button class="delete-user-btn" data-id="${user.id}">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Add event listeners to the buttons
    document.querySelectorAll('.toggle-status-btn').forEach(btn => {
        btn.addEventListener('click', toggleUserStatus);
    });
    
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', deleteUser);
    });
}

// Add a new user
function addNewUser(event) {
    event.preventDefault();
    
    const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value;
    const role = document.getElementById('new-role').value;
    
    // Validate form inputs
    if (!username || !email || !role) {
        alert('Please fill in all fields');
        return;
    }
    
    // Create new user object
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
        username: username,
        role: role,
        email: email,
        status: 'Active'
    };
    
    // Add to users array
    users.push(newUser);
    
    // Update the table and stats
    updateUserTable();
    updateStats();
    
    // Reset the form
    document.getElementById('add-user-form').reset();
    
    // Show success message
    alert(`User ${username} has been added successfully!`);
}

// Toggle user status (Active/Inactive)
function toggleUserStatus(event) {
    const userId = parseInt(event.target.getAttribute('data-id'));
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
        // Toggle the status
        users[userIndex].status = users[userIndex].status === 'Active' ? 'Inactive' : 'Active';
        
        // Update the table and stats
        updateUserTable();
        updateStats();
    }
}

// Delete a user
function deleteUser(event) {
    const userId = parseInt(event.target.getAttribute('data-id'));
    
    // Confirm deletion
    if (confirm('Are you sure you want to delete this user?')) {
        // Remove the user from the array
        users = users.filter(user => user.id !== userId);
        
        // Update the table and stats
        updateUserTable();
        updateStats();
    }
}

// Case Management Functions

// Open Case Management
function openCaseManagement() {
    // Hide all sections
    hideAllSections();
    
    // Create case management section
    const caseSection = document.createElement('div');
    caseSection.id = 'case-management-section';
    caseSection.className = 'admin-section';
    caseSection.innerHTML = `
        <div class="section-header">
            <h2>Case Management</h2>
            <button id="back-to-dashboard" class="back-btn">Back to Dashboard</button>
        </div>
        
        <div class="action-row">
            <button id="add-new-case-btn" class="primary-btn">Add New Case</button>
            <div class="search-bar">
                <input type="text" id="case-search" placeholder="Search cases...">
                <button id="search-btn">Search</button>
            </div>
        </div>
        
        <!-- Case Table -->
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Priority</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="case-table-body">
                <!-- Cases will be dynamically inserted here -->
            </tbody>
        </table>
    `;
    
    // Append to main content
    document.querySelector('.main-content').appendChild(caseSection);
    
    // Add event listeners
    document.getElementById('back-to-dashboard').addEventListener('click', showDashboard);
    document.getElementById('add-new-case-btn').addEventListener('click', openAddCase);
    document.getElementById('search-btn').addEventListener('click', searchCases);
    document.getElementById('case-search').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchCases();
        }
    });
    
    // Update the case table
    updateCaseTable();
}

// Open Add New Case form
function openAddCase() {
    // Hide all sections
    hideAllSections();
    
    // Create add case section
    const addCaseSection = document.createElement('div');
    addCaseSection.id = 'add-case-section';
    addCaseSection.className = 'admin-section';
    addCaseSection.innerHTML = `
        <div class="section-header">
            <h2>Add New Case</h2>
            <button id="back-to-cases" class="back-btn">Back to Cases</button>
        </div>
        
        <form id="add-case-form" class="add-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="case-title">Case Title</label>
                    <input type="text" id="case-title" required>
                </div>
                <div class="form-group">
                    <label for="case-location">Location</label>
                    <input type="text" id="case-location" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="case-priority">Priority</label>
                    <select id="case-priority" required>
                        <option value="High">High</option>
                        <option value="Medium" selected>Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="case-assigned">Assigned To</label>
                    <select id="case-assigned" required>
                        <option value="">Select User</option>
                        ${users.map(user => `<option value="${user.username}">${user.username} (${user.role})</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label for="case-details">Case Details</label>
                <textarea id="case-details" rows="5" required></textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="primary-btn">Create Case</button>
                <button type="button" id="cancel-add-case" class="secondary-btn">Cancel</button>
            </div>
        </form>
    `;
    
    // Append to main content
    document.querySelector('.main-content').appendChild(addCaseSection);
    
    // Add event listeners
    document.getElementById('back-to-cases').addEventListener('click', openCaseManagement);
    document.getElementById('cancel-add-case').addEventListener('click', openCaseManagement);
    document.getElementById('add-case-form').addEventListener('submit', addNewCase);
}

// Add a new case
function addNewCase(event) {
    event.preventDefault();
    
    const title = document.getElementById('case-title').value;
    const location = document.getElementById('case-location').value;
    const priority = document.getElementById('case-priority').value;
    const assignedTo = document.getElementById('case-assigned').value;
    const details = document.getElementById('case-details').value;
    
    // Create new case object
    const newCase = {
        id: cases.length > 0 ? Math.max(...cases.map(c => c.id)) + 1 : 1,
        title: title,
        location: location,
        status: "Open",
        assignedTo: assignedTo,
        priority: priority,
        created: new Date().toISOString().split('T')[0],
        details: details
    };
    
    // Add to cases array
    cases.push(newCase);
    
    // Show success message
    alert(`Case "${title}" has been created successfully!`);
    
    // Return to case management
    openCaseManagement();
}

// Update the case table
function updateCaseTable(filteredCases = null) {
    const tableBody = document.getElementById('case-table-body');
    if (!tableBody) return;
    
    const casesToShow = filteredCases || cases;
    tableBody.innerHTML = '';
    
    casesToShow.forEach(c => {
        const tr = document.createElement('tr');
        
        // Set row class based on status
        if (c.status === 'Closed') {
            tr.classList.add('inactive-row');
        } else if (c.priority === 'High') {
            tr.classList.add('priority-row');
        }
        
        // Create table cells for each property
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.title}</td>
            <td>${c.location}</td>
            <td>
                <span class="status-pill ${c.status.toLowerCase().replace(' ', '-')}">${c.status}</span>
            </td>
            <td>${c.assignedTo}</td>
            <td>
                <span class="priority-pill ${c.priority.toLowerCase()}">${c.priority}</span>
            </td>
            <td>${c.created}</td>
            <td>
                <button class="edit-btn" data-id="${c.id}">Edit</button>
                <button class="delete-btn" data-id="${c.id}">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('#case-table-body .edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const caseId = parseInt(e.target.getAttribute('data-id'));
            editCase(caseId);
        });
    });
    
    document.querySelectorAll('#case-table-body .delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const caseId = parseInt(e.target.getAttribute('data-id'));
            deleteCase(caseId);
        });
    });
}

// Edit a case
function editCase(caseId) {
    const caseToEdit = cases.find(c => c.id === caseId);
    if (!caseToEdit) return;
    
    // Hide all sections
    hideAllSections();
    
    // Create edit case section
    const editCaseSection = document.createElement('div');
    editCaseSection.id = 'edit-case-section';
    editCaseSection.className = 'admin-section';
    editCaseSection.innerHTML = `
        <div class="section-header">
            <h2>Edit Case #${caseId}</h2>
            <button id="back-to-cases" class="back-btn">Back to Cases</button>
        </div>
        
        <form id="edit-case-form" class="add-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="case-title">Case Title</label>
                    <input type="text" id="case-title" value="${caseToEdit.title}" required>
                </div>
                <div class="form-group">
                    <label for="case-location">Location</label>
                    <input type="text" id="case-location" value="${caseToEdit.location}" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="case-status">Status</label>
                    <select id="case-status" required>
                        <option value="Open" ${caseToEdit.status === 'Open' ? 'selected' : ''}>Open</option>
                        <option value="In Progress" ${caseToEdit.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Pending" ${caseToEdit.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Closed" ${caseToEdit.status === 'Closed' ? 'selected' : ''}>Closed</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="case-priority">Priority</label>
                    <select id="case-priority" required>
                        <option value="High" ${caseToEdit.priority === 'High' ? 'selected' : ''}>High</option>
                        <option value="Medium" ${caseToEdit.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                        <option value="Low" ${caseToEdit.priority === 'Low' ? 'selected' : ''}>Low</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="case-assigned">Assigned To</label>
                    <select id="case-assigned" required>
                        ${users.map(user => `<option value="${user.username}" ${caseToEdit.assignedTo === user.username ? 'selected' : ''}>${user.username} (${user.role})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="case-created">Created Date</label>
                    <input type="date" id="case-created" value="${caseToEdit.created}" readonly>
                </div>
            </div>
            
            <div class="form-group">
                <label for="case-details">Case Details</label>
                <textarea id="case-details" rows="5" required>${caseToEdit.details || ''}</textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="primary-btn">Update Case</button>
                <button type="button" id="cancel-edit-case" class="secondary-btn">Cancel</button>
            </div>
            <input type="hidden" id="case-id" value="${caseId}">
        </form>
    `;
    
    // Append to main content
    document.querySelector('.main-content').appendChild(editCaseSection);
    
    // Add event listeners
    document.getElementById('back-to-cases').addEventListener('click', openCaseManagement);
    document.getElementById('cancel-edit-case').addEventListener('click', openCaseManagement);
    document.getElementById('edit-case-form').addEventListener('submit', updateCase);
}

// Update an existing case
function updateCase(event) {
    event.preventDefault();
    
    const caseId = parseInt(document.getElementById('case-id').value);
    const caseIndex = cases.findIndex(c => c.id === caseId);
    
    if (caseIndex === -1) return;
    
    // Update case data
    cases[caseIndex] = {
        ...cases[caseIndex],
        title: document.getElementById('case-title').value,
        location: document.getElementById('case-location').value,
        status: document.getElementById('case-status').value,
        priority: document.getElementById('case-priority').value,
        assignedTo: document.getElementById('case-assigned').value,
        details: document.getElementById('case-details').value
    };
    
    // Show success message
    alert(`Case #${caseId} has been updated successfully!`);
    
    // Return to case management
    openCaseManagement();
}

// Delete a case
function deleteCase(caseId) {
    if (confirm('Are you sure you want to delete this case?')) {
        // Remove the case from the array
        cases = cases.filter(c => c.id !== caseId);
        
        // Update the table
        updateCaseTable();
        
        // Show success message
        alert(`Case #${caseId} has been deleted.`);
    }
}

// Search cases
function searchCases() {
    const searchTerm = document.getElementById('case-search').value.toLowerCase();
    
    if (!searchTerm.trim()) {
        updateCaseTable(); // Show all cases if search is empty
        return;
    }
    
    // Filter cases based on search term
    const filteredCases = cases.filter(c => 
        c.title.toLowerCase().includes(searchTerm) ||
        c.location.toLowerCase().includes(searchTerm) ||
        c.assignedTo.toLowerCase().includes(searchTerm) ||
        c.status.toLowerCase().includes(searchTerm) ||
        c.priority.toLowerCase().includes(searchTerm)
    );
    
    // Update the table with filtered results
    updateCaseTable(filteredCases);
}
// Officer Management Functions

// Open Officer Management
function openOfficerManagement() {
    // Hide all sections
    hideAllSections();
    
    // Create officer management section
    const officerSection = document.createElement('div');
    officerSection.id = 'officer-management-section';
    officerSection.className = 'admin-section';
    officerSection.innerHTML = `
        <div class="section-header">
            <h2>Officer Management</h2>
            <button id="back-to-dashboard" class="back-btn">Back to Dashboard</button>
        </div>
        
        <div class="action-row">
            <button id="add-new-officer-btn" class="primary-btn">Add New Officer</button>
            <div class="search-bar">
                <input type="text" id="officer-search" placeholder="Search officers...">
                <button id="search-officers-btn">Search</button>
            </div>
        </div>
        
        <!-- Officer Table -->
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Badge</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Last Update</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="officer-table-body">
                <!-- Officers will be dynamically inserted here -->
            </tbody>
        </table>
    `;
    
    // Append to main content
    document.querySelector('.main-content').appendChild(officerSection);
    
    // Add event listeners
    document.getElementById('back-to-dashboard').addEventListener('click', showDashboard);
    document.getElementById('add-new-officer-btn').addEventListener('click', openAddOfficer);
    document.getElementById('search-officers-btn').addEventListener('click', searchOfficers);
    document.getElementById('officer-search').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchOfficers();
        }
    });
    
    // Update the officer table
    updateOfficerTable();
}

// Open Add New Officer form
function openAddOfficer() {
    // Hide all sections
    hideAllSections();
    
    // Create add officer section
    const addOfficerSection = document.createElement('div');
    addOfficerSection.id = 'add-officer-section';
    addOfficerSection.className = 'admin-section';
    addOfficerSection.innerHTML = `
        <div class="section-header">
            <h2>Add New Officer</h2>
            <button id="back-to-officers" class="back-btn">Back to Officers</button>
        </div>
        
        <form id="add-officer-form" class="add-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="officer-name">Officer Name</label>
                    <input type="text" id="officer-name" required>
                </div>
                <div class="form-group">
                    <label for="officer-badge">Badge Number</label>
                    <input type="text" id="officer-badge" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="officer-status">Status</label>
                    <select id="officer-status" required>
                        <option value="On Duty">On Duty</option>
                        <option value="Off Duty">Off Duty</option>
                        <option value="On Call">On Call</option>
                        <option value="Vacation">Vacation</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="officer-location">Current Location</label>
                    <input type="text" id="officer-location">
                </div>
            </div>
            
            <div class="form-group">
                <label for="officer-notes">Additional Notes</label>
                <textarea id="officer-notes" rows="3"></textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="primary-btn">Add Officer</button>
                <button type="button" id="cancel-add-officer" class="secondary-btn">Cancel</button>
            </div>
        </form>
    `;
    
    // Append to main content
    document.querySelector('.main-content').appendChild(addOfficerSection);
    
    // Add event listeners
    document.getElementById('back-to-officers').addEventListener('click', openOfficerManagement);
    document.getElementById('cancel-add-officer').addEventListener('click', openOfficerManagement);
    document.getElementById('add-officer-form').addEventListener('submit', addNewOfficer);
}

// Add a new officer
function addNewOfficer(event) {
    event.preventDefault();
    
    const name = document.getElementById('officer-name').value;
    const badge = document.getElementById('officer-badge').value;
    const status = document.getElementById('officer-status').value;
    const location = document.getElementById('officer-location').value || 'N/A';
    const notes = document.getElementById('officer-notes').value;
    
    // Create new officer object
    const newOfficer = {
        id: officers.length > 0 ? Math.max(...officers.map(o => o.id)) + 1 : 1,
        name: name,
        badge: badge,
        status: status,
        location: location,
        lastUpdate: new Date().toLocaleString(),
        notes: notes
    };
    
    // Add to officers array
    officers.push(newOfficer);
    
    // Show success message
    alert(`Officer "${name}" has been added successfully!`);
    
    // Return to officer management
    openOfficerManagement();
}

// Update the officer table
function updateOfficerTable(filteredOfficers = null) {
    const tableBody = document.getElementById('officer-table-body');
    if (!tableBody) return;
    
    const officersToShow = filteredOfficers || officers;
    tableBody.innerHTML = '';
    
    officersToShow.forEach(officer => {
        const tr = document.createElement('tr');
        
        // Set row class based on status
        if (officer.status === 'Off Duty') {
            tr.classList.add('inactive-row');
        } else if (officer.status === 'On Call') {
            tr.classList.add('warning-row');
        }
        
        // Create table cells for each property
        tr.innerHTML = `
            <td>${officer.id}</td>
            <td>${officer.name}</td>
            <td>${officer.badge}</td>
            <td>
                <span class="status-pill ${officer.status.toLowerCase().replace(' ', '-')}">${officer.status}</span>
            </td>
            <td>${officer.location}</td>
            <td>${officer.lastUpdate}</td>
            <td>
                <button class="edit-btn" data-id="${officer.id}">Edit</button>
                <button class="delete-btn" data-id="${officer.id}">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('#officer-table-body .edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const officerId = parseInt(e.target.getAttribute('data-id'));
            editOfficer(officerId);
        });
    });
    
    document.querySelectorAll('#officer-table-body .delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const officerId = parseInt(e.target.getAttribute('data-id'));
            deleteOfficer(officerId);
        });
    });
}

// Edit an officer
function editOfficer(officerId) {
    const officerToEdit = officers.find(o => o.id === officerId);
    if (!officerToEdit) return;
    
    // Hide all sections
    hideAllSections();
    
    // Create edit officer section
    const editOfficerSection = document.createElement('div');
    editOfficerSection.id = 'edit-officer-section';
    editOfficerSection.className = 'admin-section';
    editOfficerSection.innerHTML = `
        <div class="section-header">
            <h2>Edit Officer</h2>
            <button id="back-to-officers" class="back-btn">Back to Officers</button>
        </div>
        
        <form id="edit-officer-form" class="add-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="officer-name">Officer Name</label>
                    <input type="text" id="officer-name" value="${officerToEdit.name}" required>
                </div>
                <div class="form-group">
                    <label for="officer-badge">Badge Number</label>
                    <input type="text" id="officer-badge" value="${officerToEdit.badge}" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="officer-status">Status</label>
                    <select id="officer-status" required>
                        <option value="On Duty" ${officerToEdit.status === 'On Duty' ? 'selected' : ''}>On Duty</option>
                        <option value="Off Duty" ${officerToEdit.status === 'Off Duty' ? 'selected' : ''}>Off Duty</option>
                        <option value="On Call" ${officerToEdit.status === 'On Call' ? 'selected' : ''}>On Call</option>
                        <option value="Vacation" ${officerToEdit.status === 'Vacation' ? 'selected' : ''}>Vacation</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="officer-location">Current Location</label>
                    <input type="text" id="officer-location" value="${officerToEdit.location}">
                </div>
            </div>
            
            <div class="form-group">
                <label for="officer-notes">Additional Notes</label>
                <textarea id="officer-notes" rows="3">${officerToEdit.notes || ''}</textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="primary-btn">Update Officer</button>
                <button type="button" id="cancel-edit-officer" class="secondary-btn">Cancel</button>
            </div>
            <input type="hidden" id="officer-id" value="${officerId}">
        </form>
    `;
    
    // Append to main content
    document.querySelector('.main-content').appendChild(editOfficerSection);
    
    // Add event listeners
    document.getElementById('back-to-officers').addEventListener('click', openOfficerManagement);
    document.getElementById('cancel-edit-officer').addEventListener('click', openOfficerManagement);
    document.getElementById('edit-officer-form').addEventListener('submit', updateOfficer);
}

// Update an existing officer
function updateOfficer(event) {
    event.preventDefault();
    
    const officerId = parseInt(document.getElementById('officer-id').value);
    const officerIndex = officers.findIndex(o => o.id === officerId);
    
    if (officerIndex === -1) return;
    
    // Update officer data
    officers[officerIndex] = {
        ...officers[officerIndex],
        name: document.getElementById('officer-name').value,
        badge: document.getElementById('officer-badge').value,
        status: document.getElementById('officer-status').value,
        location: document.getElementById('officer-location').value || 'N/A',
        lastUpdate: new Date().toLocaleString(),
        notes: document.getElementById('officer-notes').value
    };
    
    // Show success message
    alert(`Officer information has been updated successfully!`);
    
    // Return to officer management
    openOfficerManagement();
}

// Delete an officer
function deleteOfficer(officerId) {
    if (confirm('Are you sure you want to delete this officer?')) {
        // Remove the officer from the array
        officers = officers.filter(o => o.id !== officerId);
        
        // Update the table
        updateOfficerTable();
        
        // Show success message
        alert('Officer has been deleted.');
    }
}

// Search officers
function searchOfficers() {
    const searchTerm = document.getElementById('officer-search').value.toLowerCase();
    
    if (!searchTerm.trim()) {
        updateOfficerTable(); // Show all officers if search is empty
        return;
    }
    
    // Filter officers based on search term
    const filteredOfficers = officers.filter(o => 
        o.name.toLowerCase().includes(searchTerm) ||
        o.badge.toLowerCase().includes(searchTerm) ||
        o.status.toLowerCase().includes(searchTerm) ||
        o.location.toLowerCase().includes(searchTerm)
    );
    
    // Update the table with filtered results
    updateOfficerTable(filteredOfficers);
}
// System Settings and Reports Functions

// Open System Settings
function openSystemSettings() {
    // Hide all sections
    hideAllSections();
    
    // Create system settings section
    const settingsSection = document.createElement('div');
    settingsSection.id = 'system-settings-section';
    settingsSection.className = 'admin-section';
    settingsSection.innerHTML = `
        <div class="section-header">
            <h2>System Settings</h2>
            <button id="back-to-dashboard" class="back-btn">Back to Dashboard</button>
        </div>
        
        <div class="settings-container">
            <div class="settings-group">
                <h3>General Settings</h3>
                <div class="setting-item">
                    <label for="system-name">System Name</label>
                    <input type="text" id="system-name" value="Police Dispatch System">
                </div>
                <div class="setting-item">
                    <label for="department-name">Department Name</label>
                    <input type="text" id="department-name" value="City Police Department">
                </div>
                <div class="setting-item">
                    <label for="timezone">Timezone</label>
                    <select id="timezone">
                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                        <option value="UTC-7">Mountain Time (UTC-7)</option>
                        <option value="UTC-6">Central Time (UTC-6)</option>
                        <option value="UTC-5" selected>Eastern Time (UTC-5)</option>
                    </select>
                </div>
            </div>
            
            <div class="settings-group">
                <h3>Notifications</h3>
                <div class="setting-item checkbox">
                    <label>
                        <input type="checkbox" id="email-notifications" checked>
                        Email Notifications
                    </label>
                </div>
                <div class="setting-item checkbox">
                    <label>
                        <input type="checkbox" id="sms-notifications" checked>
                        SMS Notifications
                    </label>
                </div>
                <div class="setting-item checkbox">
                    <label>
                        <input type="checkbox" id="case-alerts" checked>
                        High Priority Case Alerts
                    </label>
                </div>
                <div class="setting-item checkbox">
                    <label>
                        <input type="checkbox" id="daily-reports">
                        Daily Report Summaries
                    </label>
                </div>
            </div>
            
            <div class="settings-group">
                <h3>Security Settings</h3>
                <div class="setting-item">
                    <label for="session-timeout">Session Timeout (minutes)</label>
                    <input type="number" id="session-timeout" min="5" max="120" value="30">
                </div>
                <div class="setting-item checkbox">
                    <label>
                        <input type="checkbox" id="two-factor-auth">
                        Two-Factor Authentication
                    </label>
                </div>
                <div class="setting-item checkbox">
                    <label>
                        <input type="checkbox" id="audit-logging" checked>
                        Enable Audit Logging
                    </label>
                </div>
                <div class="setting-item">
                    <label for="password-expiry">Password Expiry (days)</label>
                    <input type="number" id="password-expiry" min="30" max="180" value="90">
                </div>
            </div>
        </div>
        
        <div class="form-actions">
            <button id="save-settings" class="primary-btn">Save Settings</button>
            <button id="reset-settings" class="secondary-btn">Reset to Defaults</button>
        </div>
    `;
    
    // Append to main content
    document.querySelector('.main-content').appendChild(settingsSection);
    
    // Add event listeners
    document.getElementById('back-to-dashboard').addEventListener('click', showDashboard);
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('reset-settings').addEventListener('click', resetSettings);
}

// Save system settings
function saveSettings() {
    // In a real application, you would save these to a database
    alert('Settings saved successfully!');
}

// Reset system settings to defaults
function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
        openSystemSettings();
        alert('Settings have been reset to default values.');
    }
}

// Open Reports Section
function openReports() {
    // Hide all sections
    hideAllSections();
    
    // Create reports section
    const reportsSection = document.createElement('div');
    reportsSection.id = 'reports-section';
    reportsSection.className = 'admin-section';
    reportsSection.innerHTML = `
        <div class="section-header">
            <h2>Reports & Analytics</h2>
            <button id="back-to-dashboard" class="back-btn">Back to Dashboard</button>
        </div>
        
        <div class="tabs-container">
            <div class="tabs">
                <button class="tab-btn active" data-tab="reports-tab">Reports</button>
                <button class="tab-btn" data-tab="stats-tab">Statistics</button>
                <button class="tab-btn" data-tab="export-tab">Export Data</button>
            </div>
            
            <div class="tab-content active" id="reports-tab">
                <h3>Available Reports</h3>
                <div class="report-cards">
                    <div class="report-card">
                        <h4>Daily Activity Summary</h4>
                        <p>Overview of all incidents and officer activities in the last 24 hours.</p>
                        <div class="report-actions">
                            <button class="view-report-btn" data-report="daily-activity">View Report</button>
                            <button class="download-report-btn" data-report="daily-activity">Download</button>
                        </div>
                    </div>
                    
                    <div class="report-card">
                        <h4>Weekly Case Status</h4>
                        <p>Summary of all cases and their current status for the past week.</p>
                        <div class="report-actions">
                            <button class="view-report-btn" data-report="weekly-case">View Report</button>
                            <button class="download-report-btn" data-report="weekly-case">Download</button>
                        </div>
                    </div>
                    
                    <div class="report-card">
                        <h4>Officer Performance</h4>
                        <p>Analysis of response times and case resolution rates by officer.</p>
                        <div class="report-actions">
                            <button class="view-report-btn" data-report="officer-performance">View Report</button>
                            <button class="download-report-btn" data-report="officer-performance">Download</button>
                        </div>
                    </div>
                    
                    <div class="report-card">
                        <h4>Incident Heatmap</h4>
                        <p>Geographic distribution of incidents by type and priority.</p>
                        <div class="report-actions">
                            <button class="view-report-btn" data-report="incident-heatmap">View Report</button>
                            <button class="download-report-btn" data-report="incident-heatmap">Download</button>
                        </div>
                    </div>
                </div>
                
                <h3>Scheduled Reports</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Report Name</th>
                            <th>Frequency</th>
                            <th>Recipients</th>
                            <th>Last Generated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Daily Activity Summary</td>
                            <td>Daily (8:00 AM)</td>
                            <td>Command Staff, Supervisors</td>
                            <td>2025-04-01 08:00 AM</td>
                            <td>
                                <button class="edit-btn">Edit</button>
                                <button class="delete-btn">Delete</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Weekly Case Status</td>
                            <td>Weekly (Monday, 9:00 AM)</td>
                            <td>All Staff</td>
                            <td>2025-03-31 09:00 AM</td>
                            <td>
                                <button class="edit-btn">Edit</button>
                                <button class="delete-btn">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="tab-content" id="stats-tab">
                <h3>Department Statistics</h3>
                
                <div class="stats-cards">
                    <div class="stat-summary-card">
                        <h4>Case Resolution Rate</h4>
                        <div class="stat-chart">
                            <div class="chart-placeholder">
                                <div class="progress-circle" data-percentage="72">
                                    <span class="progress-circle-text">72%</span>
                                </div>
                            </div>
                            <p>Case resolution rate in the last 30 days</p>
                        </div>
                    </div>
                    
                    <div class="stat-summary-card">
                        <h4>Average Response Time</h4>
                        <div class="stat-chart">
                            <div class="chart-placeholder">
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: 65%">8.2 min</div>
                                </div>
                            </div>
                            <p>Average officer response time (Target: 10 min)</p>
                        </div>
                    </div>
                    
                    <div class="stat-summary-card">
                        <h4>Cases by Priority</h4>
                        <div class="stat-chart">
                            <div class="chart-placeholder">
                                <div class="pie-chart-placeholder">
                                    <div class="pie-segment high"></div>
                                    <div class="pie-segment medium"></div>
                                    <div class="pie-segment low"></div>
                                </div>
                                <div class="pie-legend">
                                    <div><span class="legend-color high"></span> High: 24%</div>
                                    <div><span class="legend-color medium"></span> Medium: 45%</div>
                                    <div><span class="legend-color low"></span> Low: 31%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-summary-card">
                        <h4>Monthly Case Trend</h4>
                        <div class="stat-chart">
                            <div class="chart-placeholder bar-chart-placeholder">
                                <div class="bar-chart">
                                    <div class="bar-container">
                                        <div class="bar" style="height: 60%"></div>
                                        <span>Jan</span>
                                    </div>
                                    <div class="bar-container">
                                        <div class="bar" style="height: 75%"></div>
                                        <span>Feb</span>
                                    </div>
                                    <div class="bar-container">
                                        <div class="bar" style="height: 65%"></div>
                                        <span>Mar</span>
                                    </div>
                                    <div class="bar-container">
                                        <div class="bar highlight" style="height: 40%"></div>
                                        <span>Apr</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="tab-content" id="export-tab">
                <h3>Export Data</h3>
                
                <form id="export-form" class="export-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="export-data-type">Data Type</label>
                            <select id="export-data-type" required>
                                <option value="">Select Data Type</option>
                                <option value="cases">Cases</option>
                                <option value="officers">Officers</option>
                                <option value="users">Users</option>
                                <option value="all">All Data</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="export-format">Export Format</label>
                            <select id="export-format" required>
                                <option value="csv">CSV</option>
                                <option value="excel">Excel</option>
                                <option value="pdf">PDF</option>
                                <option value="json">JSON</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="export-date-from">Date Range (From)</label>
                            <input type="date" id="export-date-from">
                        </div>
                        
                        <div class="form-group">
                            <label for="export-date-to">Date Range (To)</label>
                            <input type="date" id="export-date-to">
                        </div>
                    </div>
                    
                    <div class="form-group checkbox">
                        <label>
                            <input type="checkbox" id="include-archived">
                            Include Archived Data
                        </label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="primary-btn">Export Data</button>
                    </div>
                </form>
                
                <div class="export-history">
                    <h3>Recent Exports</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Data Type</th>
                                <th>Format</th>
                                <th>Generated By</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2025-03-31 10:15 AM</td>
                                <td>Cases</td>
                                <td>Excel</td>
                                <td>admin_taha</td>
                                <td>
                                    <button class="download-btn">Download</button>
                                </td>
                            </tr>
                            <tr>
                                <td>2025-03-28 03:45 PM</td>
                                <td>Officers</td>
                                <td>CSV</td>
                                <td>admin_taha</td>
                                <td>
                                    <button class="download-btn">Download</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Append to main content
    document.querySelector('.main-content').appendChild(reportsSection);
    
    // Add event listeners
    document.getElementById('back-to-dashboard').addEventListener('click', showDashboard);
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs and content
            document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Report view and download buttons
    document.querySelectorAll('.view-report-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reportType = this.getAttribute('data-report');
            viewReport(reportType);
        });
    });
    
    document.querySelectorAll('.download-report-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reportType = this.getAttribute('data-report');
            downloadReport(reportType);
        });
    });
    
    // Export form submission
    document.getElementById('export-form').addEventListener('submit', function(event) {
        event.preventDefault();
        exportData();
    });
    
    // Download buttons in export history
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Downloading exported file...');
        });
    });
}

// View a report
function viewReport(reportType) {
    alert(`Viewing ${reportType} report... This would display a detailed report view.`);
}

// Download a report
function downloadReport(reportType) {
    alert(`Preparing ${reportType} report for download...`);
    setTimeout(() => {
        alert('Report download complete!');
    }, 1500);
}

// Export data
function exportData() {
    const dataType = document.getElementById('export-data-type').value;
    const format = document.getElementById('export-format').value;
    
    if (!dataType || !format) {
        alert('Please select a data type and format.');
        return;
    }
    
    alert(`Exporting ${dataType} data in ${format.toUpperCase()} format...`);
    
    // Simulate export delay
    setTimeout(() => {
        alert('Data export complete! The file is ready for download.');
    }, 2000);
}
// Analytics Dashboard Functions

// Open Analytics Dashboard
function openAnalytics() {
    // Hide all sections
    hideAllSections();
    
    // Create analytics section
    const analyticsSection = document.createElement('div');
    analyticsSection.id = 'analytics-section';
    analyticsSection.className = 'admin-section';
    analyticsSection.innerHTML = `
        <div class="section-header">
            <h2>Analytics Dashboard</h2>
            <button id="back-to-dashboard" class="back-btn">Back to Dashboard</button>
        </div>
        
        <div class="analytics-filters">
            <div class="filter-group">
                <label for="time-period">Time Period:</label>
                <select id="time-period">
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week" selected>Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="data-type">Data Type:</label>
                <select id="data-type">
                    <option value="all" selected>All Data</option>
                    <option value="cases">Cases</option>
                    <option value="officers">Officer Activity</option>
                    <option value="response">Response Times</option>
                </select>
            </div>
            
            <button id="update-analytics" class="primary-btn">Update Analytics</button>
        </div>
        
        <div class="analytics-grid">
            <div class="analytics-card full-width">
                <h3>Case Volume Trend</h3>
                <div class="analytics-chart case-volume-chart">
                    <div class="line-chart-placeholder">
                        <div class="line-chart">
                            <div class="line-point" style="left: 0%; bottom: 30%"></div>
                            <div class="line-point" style="left: 20%; bottom: 50%"></div>
                            <div class="line-point" style="left: 40%; bottom: 35%"></div>
                            <div class="line-point" style="left: 60%; bottom: 45%"></div>
                            <div class="line-point" style="left: 80%; bottom: 25%"></div>
                            <div class="line-point" style="left: 100%; bottom: 40%"></div>
                            <div class="line-connector"></div>
                        </div>
                        <div class="chart-labels">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="analytics-card">
                <h3>Cases by Status</h3>
                <div class="analytics-chart status-chart">
                    <div class="donut-chart-placeholder">
                        <div class="donut-segment open" style="--percentage: 35%"></div>
                        <div class="donut-segment in-progress" style="--percentage: 40%"></div>
                        <div class="donut-segment closed" style="--percentage: 25%"></div>
                        <div class="donut-hole"></div>
                    </div>
                    <div class="chart-legend">
                        <div><span class="legend-color open"></span> Open: 35%</div>
                        <div><span class="legend-color in-progress"></span> In Progress: 40%</div>
                        <div><span class="legend-color closed"></span> Closed: 25%</div>
                    </div>
                </div>
            </div>
            
            <div class="analytics-card">
                <h3>Response Times</h3>
                <div class="analytics-chart response-chart">
                    <div class="comparison-chart">
                        <div class="comparison-item">
                            <span class="comparison-label">High Priority</span>
                            <div class="comparison-bar-container">
                                <div class="comparison-bar high" style="width: 60%">4.8 min</div>
                            </div>
                        </div>
                        <div class="comparison-item">
                            <span class="comparison-label">Medium Priority</span>
                            <div class="comparison-bar-container">
                                <div class="comparison-bar medium" style="width: 85%">10.2 min</div>
                            </div>
                        </div>
                        <div class="comparison-item">
                            <span class="comparison-label">Low Priority</span>
                            <div class="comparison-bar-container">
                                <div class="comparison-bar low" style="width: 100%">15.7 min</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="analytics-card">
                <h3>Top Performers</h3>
                <div class="analytics-chart performers-chart">
                    <table class="mini-table">
                        <thead>
                            <tr>
                                <th>Officer</th>
                                <th>Cases</th>
                                <th>Resolution %</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>John Smith</td>
                                <td>28</td>
                                <td>92%</td>
                            </tr>
                            <tr>
                                <td>Maria Garcia</td>
                                <td>23</td>
                                <td>87%</td>
                            </tr>
                            <tr>
                                <td>David Johnson</td>
                                <td>19</td>
                                <td>84%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="analytics-card full-width">
                <h3>Geographic Distribution</h3>
                <div class="analytics-chart geo-chart">
                    <div class="map-placeholder">
                        <div class="map-grid">
                            <div class="map-area high"></div>
                            <div class="map-area medium"></div>
                            <div class="map-area low"></div>
                            <div class="map-area high"></div>
                            <div class="map-area medium"></div>
                            <div class="map-area low"></div>
                            <div class="map-area medium"></div>
                            <div class="map-area low"></div>
                            <div class="map-area medium"></div>
                        </div>
                        <div class="map-legend">
                            <div><span class="legend-color high"></span> High Activity</div>
                            <div><span class="legend-color medium"></span> Medium Activity</div>
                            <div><span class="legend-color low"></span> Low Activity</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Append to main content
    document.querySelector('.main-content').appendChild(analyticsSection);
    
    // Add event listeners
    document.getElementById('back-to-dashboard').addEventListener('click', showDashboard);
    document.getElementById('update-analytics').addEventListener('click', updateAnalytics);
}

// Update analytics based on filters
function updateAnalytics() {
    const timePeriod = document.getElementById('time-period').value;
    const dataType = document.getElementById('data-type').value;
    
    alert(`Updating analytics for ${dataType} over ${timePeriod}...`);
    // In a real app, this would fetch and render new data
    
    // For demonstration, we'll just show a loading message
    setTimeout(() => {
        alert('Analytics updated successfully!');
    }, 1500);
}