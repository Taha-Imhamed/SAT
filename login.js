document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Define user credentials and their respective pages
    const users = {
        'taha': { password: 'taha', page: 'admin.html' },
        'mehmet': { password: 'mehmet', page: 'dispatcher.html' },
        '903': { password: 'jonida', page: 'unit#903jonida.html' },
        'anas': { password: 'anas', page: 'unit#901anas.html' },
        'mohamed': { password: 'mohamed', page: 'unit#904mohamed.html' },
        'angela': { password: 'angela', page: 'unit#902angela.html' }
    };

    // Check credentials
    if (users[username] && users[username].password === password) {
        // Redirect to respective page
        window.location.href = users[username].page;
    } else {
        
        errorMessage.textContent = 'Invalid username or password';
    }
});