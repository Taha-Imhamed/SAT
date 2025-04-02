// Global variables and data
let officers = [];

// Initial function to run when page loads
document.addEventListener('DOMContentLoaded', function() {
    showDashboard();
});

// Show dashboard
function showDashboard() {
    // Hide all sections
    hideAllSections();
    
    // Create dashboard section
    const dashboardSection = document.createElement('div');
    dashboardSection.id = 'dashboard-section';
    dashboardSection.className = 'admin-section';
    dashboardSection.innerHTML = `
        <div class="section-header">
            <h2>Dashboard</h2>
        </div>
        
        <div class="dashboard-cards">
            <div class="dashboard-card" id="officer-card">
                <h3>Officer Management</h3>
                <p>Manage department officers and their statuses</p>
                <button class="primary-btn">Open</button>
            </div>
        </div>
    `;
    
    // Append to main content
    document.querySelector('.main-content').appendChild(dashboardSection);
    
    // Add event listener for officer management
    document.querySelector('#officer-card button').addEventListener('click', openOfficerManagement);
}

// Hide all sections
function hideAllSections() {
    const mainContent = document.querySelector('.main-content');
    while (mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild);
    }
}

// Officer Management Functions with Database Connectivity

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
                <!-- Loading indicator -->
                <tr>
                    <td colspan="7" class="loading-indicator">Loading officers from database...</td>
                </tr>
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
    
    // Fetch and update the officer table from database
    fetchOfficersFromDatabase();
}

// Fetch officers from database
function fetchOfficersFromDatabase(searchTerm = '') {
    // Show loading indicator
    const tableBody = document.getElementById('officer-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="loading-indicator">Loading officers from database...</td>
        </tr>
    `;
    
    // Create API endpoint URL
    let apiUrl = '/api/officers';
    if (searchTerm) {
        apiUrl += `?search=${encodeURIComponent(searchTerm)}`;
    }
    
    // Fetch officers from the database through API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            updateOfficerTable(data);
        })
        .catch(error => {
            console.error('Error fetching officers:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="error-message">
                        Error loading officers. Please try again later.
                    </td>
                </tr>
            `;
        });
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
    
    // Get form data
    const name = document.getElementById('officer-name').value;
    const badge = document.getElementById('officer-badge').value;
    const status = document.getElementById('officer-status').value;
    const location = document.getElementById('officer-location').value || 'N/A';
    const notes = document.getElementById('officer-notes').value;
    
    // Create new officer object
    const newOfficer = {
        name: name,
        badge: badge,
        status: status,
        location: location,
        notes: notes
    };
    
    // Show loading state
    const submitButton = document.querySelector('#add-officer-form .primary-btn');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Adding...';
    
    // Send to the server
    fetch('/api/officers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOfficer)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        alert(`Officer "${name}" has been added successfully!`);
        
        // Return to officer management
        openOfficerManagement();
    })
    .catch(error => {
        console.error('Error adding officer:', error);
        alert('Error adding officer. Please try again.');
        
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    });
}

// Update the officer table with data from database
function updateOfficerTable(officers) {
    const tableBody = document.getElementById('officer-table-body');
    if (!tableBody) return;
    
    if (!officers || officers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">No officers found.</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    officers.forEach(officer => {
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
            <td>${officer.last_update || officer.lastUpdate}</td>
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
    // Show loading section while fetching officer details
    hideAllSections();
    
    const loadingSection = document.createElement('div');
    loadingSection.id = 'loading-section';
    loadingSection.className = 'admin-section';
    loadingSection.innerHTML = `
        <div class="loading-message">
            <div class="spinner"></div>
            <p>Loading officer details...</p>
        </div>
    `;
    
    document.querySelector('.main-content').appendChild(loadingSection);
    
    // Fetch officer details from the server
    fetch(`/api/officers/${officerId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(officerToEdit => {
            // Hide loading section
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
        })
        .catch(error => {
            console.error('Error fetching officer details:', error);
            hideAllSections();
            
            const errorSection = document.createElement('div');
            errorSection.id = 'error-section';
            errorSection.className = 'admin-section';
            errorSection.innerHTML = `
                <div class="error-message">
                    <h3>Error</h3>
                    <p>Could not fetch officer details. Please try again later.</p>
                    <button id="back-to-officers" class="primary-btn">Back to Officers</button>
                </div>
            `;
            
            document.querySelector('.main-content').appendChild(errorSection);
            document.getElementById('back-to-officers').addEventListener('click', openOfficerManagement);
        });
}

// Update an existing officer
function updateOfficer(event) {
    event.preventDefault();
    
    const officerId = parseInt(document.getElementById('officer-id').value);
    
    // Get updated values
    const updatedOfficer = {
        id: officerId,
        name: document.getElementById('officer-name').value,
        badge: document.getElementById('officer-badge').value,
        status: document.getElementById('officer-status').value,
        location: document.getElementById('officer-location').value || 'N/A',
        notes: document.getElementById('officer-notes').value
    };
    
    // Show loading state
    const submitButton = document.querySelector('#edit-officer-form .primary-btn');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Updating...';
    
    // Send to the server
    fetch(`/api/officers/${officerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOfficer)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        alert(`Officer information has been updated successfully!`);
        
        // Return to officer management
        openOfficerManagement();
    })
    .catch(error => {
        console.error('Error updating officer:', error);
        alert('Error updating officer. Please try again.');
        
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    });
}

// Delete an officer
function deleteOfficer(officerId) {
    if (confirm('Are you sure you want to delete this officer?')) {
        // Send delete request to the server
        fetch(`/api/officers/${officerId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Show success message
            alert('Officer has been deleted.');
            
            // Refresh the officers table
            fetchOfficersFromDatabase();
        })
        .catch(error => {
            console.error('Error deleting officer:', error);
            alert('Error deleting officer. Please try again.');
        });
    }
}

// Search officers
function searchOfficers() {
    const searchTerm = document.getElementById('officer-search').value.trim();
    fetchOfficersFromDatabase(searchTerm);
}