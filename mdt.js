// Page Navigation Logic
document.addEventListener('DOMContentLoaded', function() {
  // Get all navigation links
  const navLinks = document.querySelectorAll('.mdt-nav-link');
  
  // Add click event listener to each link
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the page ID from the data-page attribute
      const pageId = this.getAttribute('data-page');
      
      // Change the page title
      const pageTitle = document.getElementById('page-title');
      switch(pageId) {
        case 'dashboard':
          pageTitle.textContent = 'Mobile Data Terminal';
          break;
        case 'active-calls':
          pageTitle.textContent = 'Active Emergency Calls';
          break;
        case 'persons':
          pageTitle.textContent = 'Person Database Search';
          break;
        case 'vehicles':
          pageTitle.textContent = 'Vehicle Database Search';
          break;
        case 'reports':
          pageTitle.textContent = 'Reports Management';
          break;
        case 'bulletins':
          pageTitle.textContent = 'Department Bulletins';
          break;
        case 'map':
          pageTitle.textContent = 'Department Map';
          break;
        case 'warrants':
          pageTitle.textContent = 'Active Warrants';
          break;
        default:
          pageTitle.textContent = 'Mobile Data Terminal';
      }
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Hide all pages
      const pages = document.querySelectorAll('.mdt-page');
      pages.forEach(page => page.classList.remove('active'));
      
      // Show the selected page
      const selectedPage = document.getElementById(`${pageId}-page`);
      if(selectedPage) {
        selectedPage.classList.add('active');
        
        // Add animation effect
        selectedPage.style.animation = 'fadeIn 0.3s forwards';
      }
    });
  });
  
  // Connect dashboard search button to search function
  const searchButton = document.getElementById('search-button');
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      performSearch();
    });
  }
  
  // Connect search input field to allow search on Enter key
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
  
  // Connect close button for search results
  const closeSearchBtn = document.getElementById('close-search-btn');
  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', closeSearchResults);
  }
  
  // Connect duty status toggle button
  const toggleDutyBtn = document.getElementById('toggle-duty-btn');
  if (toggleDutyBtn) {
    toggleDutyBtn.addEventListener('click', toggleDutyStatus);
  }
  
  // Connect logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  // Connect notification close button
  const closeNotificationBtn = document.getElementById('close-notification-btn');
  if (closeNotificationBtn) {
    closeNotificationBtn.addEventListener('click', closeNotification);
  }
  
  // Connect acknowledge notification button
  const acknowledgeNotificationBtn = document.getElementById('acknowledge-notification-btn');
  if (acknowledgeNotificationBtn) {
    acknowledgeNotificationBtn.addEventListener('click', closeNotification);
  }
  
  // Connect close map details button
  const closeMapDetailsBtn = document.getElementById('close-map-details-btn');
  if (closeMapDetailsBtn) {
    closeMapDetailsBtn.addEventListener('click', closeMapDetails);
  }
  
  // Connect refresh buttons
  const refreshCallsBtn = document.getElementById('refresh-calls-btn');
  if (refreshCallsBtn) {
    refreshCallsBtn.addEventListener('click', function() {
      showNotification('Refreshed', 'Active calls data has been refreshed');
    });
  }
  
  const refreshActivityBtn = document.getElementById('refresh-activity-btn');
  if (refreshActivityBtn) {
    refreshActivityBtn.addEventListener('click', refreshActivity);
  }
  
  // Connect stats period selector
  const statsPeriod = document.getElementById('stats-period');
  if (statsPeriod) {
    statsPeriod.addEventListener('change', updateCrimeStats);
  }
  
  // Initialize tabs functionality
  initializeTabs();
  
  // Setup map interactions if map exists
  if (document.getElementById('cityMap')) {
    setupMapInteractions();
  }
  
  // Initialize charts if they exist
  if (document.getElementById('activityChart') || 
      document.getElementById('crimeTypesChart') || 
      document.getElementById('crimeLocationChart')) {
    initializeCharts();
  }
});

// Initialize all tab buttons in the document
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      const parentContainer = this.closest('div').parentElement;
      
      // Remove active class from all buttons within the same container
      const siblingButtons = parentContainer.querySelectorAll('.tab-button');
      siblingButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Hide all tab content within parent container
      const tabContents = parentContainer.querySelectorAll('.tab-content');
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Show the selected tab content
      const selectedTab = document.getElementById(`${tabId}-tab`);
      if(selectedTab) {
        selectedTab.classList.add('active');
      }
    });
  });
}

// Initialize tabs for dynamically added content
function initializeTabsInContainer(container) {
  if (!container) return;
  
  const tabButtons = container.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      const parentContainer = this.closest('div').parentElement;
      
      // Remove active class from all buttons within the same container
      const siblingButtons = parentContainer.querySelectorAll('.tab-button');
      siblingButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Hide all tab content within parent container
      const tabContents = parentContainer.querySelectorAll('.tab-content');
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Show the selected tab content
      const selectedTab = document.getElementById(`${tabId}-tab`);
      if(selectedTab) {
        selectedTab.classList.add('active');
      }
    });
  });
}

// Dashboard search functionality
function performSearch() {
  const searchInput = document.getElementById('search-input').value.trim();
  const searchType = document.getElementById('search-type').value;
  const resultsPanel = document.getElementById('search-results-panel');
  const resultsContainer = document.getElementById('search-results');
  const placeholderElement = document.getElementById('results-placeholder');

  // Show results panel
  if (resultsPanel) {
    resultsPanel.style.display = 'block';
  }

  // Clear previous results
  if (placeholderElement) {
    placeholderElement.style.display = 'none';
  }
  
  if (resultsContainer) {
    resultsContainer.innerHTML = '';
    if (placeholderElement) {
      resultsContainer.appendChild(placeholderElement);
    }
  }

  if (!searchInput) {
    if (placeholderElement) {
      placeholderElement.textContent = 'Please enter a search term';
      placeholderElement.style.display = 'block';
    }
    return;
  }

  // Show loading
  if (placeholderElement) {
    placeholderElement.textContent = 'Searching...';
    placeholderElement.style.display = 'block';
  }

  // Simulate API call delay
  setTimeout(() => {
    // Simulate search results (replace with actual API call)
    const mockResults = {
      person: [
        { 
          name: 'John Doe', 
          dob: '1985-03-15', 
          address: '123 Main St, Anytown, USA', 
          status: 'No Active Warrants'
        },
        { 
          name: 'Jane Smith', 
          dob: '1990-07-22', 
          address: '456 Oak Ave, Somecity, USA', 
          status: 'Pending Investigation'
        }
      ],
      vehicle: [
        { 
          plate: 'ABC-123', 
          make: 'Ford', 
          model: 'F-150', 
          color: 'White', 
          status: 'Registered'
        }
      ],
      report: [
        { 
          caseNumber: 'CR-2024-0572', 
          type: 'Theft', 
          date: '2024-03-15', 
          status: 'Under Investigation'
        }
      ],
      case: [
        {
          caseNumber: 'CR-2024-0572',
          title: 'Theft at Downtown Market',
          date: '2024-03-15',
          status: 'Open'
        }
      ]
    };

    const results = mockResults[searchType] || [];

    // Clear placeholder
    if (placeholderElement) {
      placeholderElement.style.display = 'none';
    }
    
    if (results.length === 0) {
      if (placeholderElement) {
        placeholderElement.textContent = 'No results found';
        placeholderElement.style.display = 'block';
      }
      return;
    }

    // Build results
    if (resultsContainer) {
      results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.classList.add('mdt-result-item');
        
        let resultHTML = '<div class="mdt-result-details">';
        
        if (searchType === 'person') {
          resultHTML += `
            <strong>${result.name}</strong>
            <p>DOB: ${result.dob} | Address: ${result.address}</p>
            <p>Status: ${result.status}</p>
          `;
        } else if (searchType === 'vehicle') {
          resultHTML += `
            <strong>Plate: ${result.plate}</strong>
            <p>${result.make} ${result.model}, Color: ${result.color}</p>
            <p>Status: ${result.status}</p>
          `;
        } else if (searchType === 'report') {
          resultHTML += `
            <strong>Case Number: ${result.caseNumber}</strong>
            <p>Type: ${result.type} | Date: ${result.date}</p>
            <p>Status: ${result.status}</p>
          `;
        } else if (searchType === 'case') {
          resultHTML += `
            <strong>Case Number: ${result.caseNumber}</strong>
            <p>Title: ${result.title} | Date: ${result.date}</p>
            <p>Status: ${result.status}</p>
          `;
        }

        resultHTML += '</div>';
        resultHTML += `
          <div class="mdt-result-actions">
            <button class="mdt-action-button view-btn">View Details</button>
            <button class="mdt-action-button more-btn">More Actions</button>
          </div>
        `;

        resultElement.innerHTML = resultHTML;
        resultsContainer.appendChild(resultElement);
        
        // Add event listeners to the new buttons
        const viewBtn = resultElement.querySelector('.view-btn');
        if (viewBtn) {
          viewBtn.addEventListener('click', function() {
            showNotification('View Details', `Viewing details for ${searchType}: ${result.name || result.plate || result.caseNumber}`);
          });
        }
        
        const moreBtn = resultElement.querySelector('.more-btn');
        if (moreBtn) {
          moreBtn.addEventListener('click', function() {
            showNotification('More Actions', `Additional actions for ${searchType}: ${result.name || result.plate || result.caseNumber}`);
          });
        }
      });
    }
  }, 800); // Simulated delay
}

// Close search results panel
function closeSearchResults() {
  const searchResultsPanel = document.getElementById('search-results-panel');
  if (searchResultsPanel) {
    searchResultsPanel.style.display = 'none';
  }
}

// Persons search functionality
function searchPersons() {
  const searchInput = document.getElementById('persons-search-input').value.trim();
  if (!searchInput) {
    showNotification('Search Error', 'Please enter a name, ID, or date of birth to search');
    return;
  }
  // In a real app, this would fetch data from an API
  // For this demo, we're already showing sample data
  showNotification('Search Completed', `Found 1 record matching "${searchInput}"`);
}

// Vehicles search functionality
function searchVehicles() {
  const searchInput = document.getElementById('vehicle-search-input').value.trim();
  if (!searchInput) {
    showNotification('Search Error', 'Please enter a license plate, VIN, or make/model to search');
    return;
  }
  
  const resultsContainer = document.getElementById('vehicle-results');
  if (!resultsContainer) return;
  
  resultsContainer.innerHTML = '';
  
  // Simulate loading
  const loadingElement = document.createElement('div');
  loadingElement.className = 'mdt-placeholder';
  loadingElement.textContent = 'Searching for vehicles...';
  resultsContainer.appendChild(loadingElement);
  
  // Simulate API call delay
  setTimeout(() => {
    resultsContainer.innerHTML = `
      <div class="mdt-vehicle-detail">
        <div class="vehicle-header">
          <h3>Vehicle Information: ${searchInput.toUpperCase()}</h3>
          <div class="status-flag">Status: Registered</div>
        </div>
        <div class="vehicle-info">
          <div class="info-section">
            <h4>Vehicle Details</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">License Plate:</span>
                <span>${searchInput.toUpperCase()}</span>
              </div>
              <div class="info-item">
                <span class="label">Make/Model:</span>
                <span>Ford F-150</span>
              </div>
              <div class="info-item">
                <span class="label">Year:</span>
                <span>2022</span>
              </div>
              <div class="info-item">
                <span class="label">Color:</span>
                <span>White</span>
              </div>
              <div class="info-item">
                <span class="label">VIN:</span>
                <span>1FTFW1E85MFB12345</span>
              </div>
              <div class="info-item">
                <span class="label">Registration:</span>
                <span>Valid until 12/31/2025</span>
              </div>
              <div class="info-item">
                <span class="label">Insurance:</span>
                <span>State Farm #INS-4567890</span>
              </div>
              <div class="info-item">
                <span class="label">Registered Owner:</span>
                <span>John Doe (ID: 850315-4721)</span>
              </div>
            </div>
          </div>
          <div class="history-section">
            <h4>Vehicle History</h4>
            <div class="history-tabs">
              <button class="tab-button active" data-tab="citations">Citations</button>
              <button class="tab-button" data-tab="incidents">Incidents</button>
            </div>
            <div class="tab-content active" id="citations-tab">
              <div class="history-item">
                <div class="date">11/04/2023</div>
                <div class="description">Speeding (78/55)</div>
                <button class="mdt-action-button small">View</button>
              </div>
            </div>
            <div class="tab-content" id="incidents-tab">
              <div class="history-item">
                <div class="date">03/10/2024</div>
                <div class="description">Involved in Hit and Run (Case #24-0327)</div>
                <button class="mdt-action-button small">View</button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile-actions">
          <button class="mdt-action-button">New Citation</button>
          <button class="mdt-action-button">Flag Vehicle</button>
          <button class="mdt-action-button">Print Record</button>
        </div>
      </div>
    `;
    
    // Initialize tabs in the dynamically added content
    initializeTabsInContainer(resultsContainer);
    
    // Add event listeners to newly created buttons
    const actionButtons = resultsContainer.querySelectorAll('.mdt-action-button');
    actionButtons.forEach(button => {
      button.addEventListener('click', function() {
        showNotification('Action', `${this.textContent} for vehicle ${searchInput.toUpperCase()}`);
      });
    });
  }, 1000);
}

// Notification system
function showNotification(title, message) {
  const modal = document.getElementById('notification-modal');
  const titleElement = document.getElementById('notification-title');
  const messageElement = document.getElementById('notification-message');
  
  if (!modal || !titleElement || !messageElement) return;
  
  titleElement.textContent = title;
  messageElement.textContent = message;
  
  modal.style.display = 'flex';
  
  // Add animation
  const modalContent = modal.querySelector('.notification-content');
  if (modalContent) {
    modalContent.style.animation = 'slideIn 0.3s forwards';
  }
}

function closeNotification() {
  const modal = document.getElementById('notification-modal');
  if (!modal) return;
  
  const modalContent = modal.querySelector('.notification-content');
  
  // Add exit animation
  if (modalContent) {
    modalContent.style.animation = 'slideOut 0.3s forwards';
  }
  
  // Hide modal after animation
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

// Duty status toggle
function toggleDutyStatus() {
  const statusIndicator = document.querySelector('.status-indicator');
  if (!statusIndicator) return;
  
  if (statusIndicator.classList.contains('online')) {
    statusIndicator.classList.remove('online');
    statusIndicator.classList.add('offline');
    statusIndicator.textContent = '10-7 | Off Duty';
    showNotification('Status Changed', 'You are now Off Duty (10-7)');
  } else {
    statusIndicator.classList.remove('offline');
    statusIndicator.classList.add('online');
    statusIndicator.textContent = '10-8 | On Duty';
    showNotification('Status Changed', 'You are now On Duty (10-8)');
  }
}

// Logout function
function logout() {
  showNotification('Logout', 'Logging out of Mobile Data Terminal...');
  
  // Simulate logout delay
  setTimeout(() => {
    // In a real app, this would redirect to login page
    window.location.reload();
  }, 2000);
}

// Close map details panel
function closeMapDetails() {
  const mapDetailsPanel = document.querySelector('.map-details-panel');
  if (mapDetailsPanel) {
    mapDetailsPanel.classList.remove('active');
  }
}

// Function to refresh activity feed
function refreshActivity() {
  const activityFeed = document.querySelector('.activity-feed');
  
  // Add a loading indicator
  if (activityFeed) {
    activityFeed.innerHTML = '<div class="loading-indicator">Refreshing activity feed...</div>';
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real application, this would fetch new data
      activityFeed.innerHTML = `
        <div class="activity-item new-activity">
          <span class="activity-time">10:47 AM</span>
          <span class="activity-badge call">911 CALL</span>
          <span class="activity-text">Medical emergency at 312 Birch Lane</span>
        </div>
        <div class="activity-item">
          <span class="activity-time">10:45 AM</span>
          <span class="activity-badge arrest">ARREST</span>
          <span class="activity-text">Officer Wilson - DUI Arrest at 5th & Main</span>
        </div>
        <div class="activity-item">
          <span class="activity-time">10:38 AM</span>
          <span class="activity-badge incident">INCIDENT</span>
          <span class="activity-text">Vehicle accident reported at Highway 101 N</span>
        </div>
        <div class="activity-item">
          <span class="activity-time">10:30 AM</span>
          <span class="activity-badge call">911 CALL</span>
          <span class="activity-text">Domestic disturbance at 123 Elm Street</span>
        </div>
        <div class="activity-item">
          <span class="activity-time">10:22 AM</span>
          <span class="activity-badge report">REPORT</span>
          <span class="activity-text">Officer Johnson filed report #24-0578</span>
        </div>
      `;
      
      // Highlight new activity
      const newActivity = document.querySelector('.new-activity');
      if (newActivity) {
        newActivity.style.animation = 'highlightNew 2s';
      }
      
      showNotification('Refreshed', 'Activity feed has been updated');
    }, 1000);
  }
}

// Function to update crime statistics based on selected period
function updateCrimeStats() {
  const period = document.getElementById('stats-period').value;
  
  // In a real application, this would fetch new data and update the charts
  console.log(`Updating crime stats for period: ${period}`);
  
  // For demo purposes, we're just showing a notification
  showNotification('Statistics Updated', `Crime statistics now showing data for ${period}`);
}

// Setup map interactions
function setupMapInteractions() {
  // Add event listeners to map markers
  const mapMarkers = document.querySelectorAll('.map-marker');
  const mapDetailsContent = document.getElementById('map-details-content');

  mapMarkers.forEach(marker => {
    marker.addEventListener('click', function() {
      const markerId = this.getAttribute('data-id');
      const markerType = this.classList.contains('unit') ? 'unit' : 'incident';
      
      // Update the details panel with info about the selected marker
      if (markerType === 'unit') {
        const unitDetails = getUnitDetails(markerId);
        if (mapDetailsContent) {
          mapDetailsContent.innerHTML = unitDetails;
        }
      } else {
        const incidentDetails = getIncidentDetails(markerId);
        if (mapDetailsContent) {
          mapDetailsContent.innerHTML = incidentDetails;
        }
      }
      
      // Show the details panel if it's not already visible
      const detailsPanel = document.querySelector('.map-details-panel');
      if (detailsPanel) {
        detailsPanel.classList.add('active');
      }
      
      // Add event listeners to details panel buttons
      const detailActionButtons = document.querySelectorAll('.detail-actions button');
      detailActionButtons.forEach(button => {
        button.addEventListener('click', function() {
          showNotification('Map Action', `${this.textContent} for ${markerId}`);
        });
      });
    });
  });
}
// MDT Interactive Map Implementation

// Global variables
let map;
let markers = {
  units: [],
  calls: []
};

// Initialize when document loads
document.addEventListener('DOMContentLoaded', function() {
  initMap();
});

/**
 * Initialize the Mapbox map
 */
function initMap() {
  // Check if map is already initialized or if container isn't visible
  if (map || !document.getElementById('mapbox-map')) return;
  
  // Mapbox public token - replace with your own in production
  mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
  
  // Initialize map
  map = new mapboxgl.Map({
    container: 'mapbox-map',
    style: 'mapbox://styles/mapbox/dark-v11', // Dark style to match MDT aesthetic
    center: [-122.4194, 37.7749], // Default center (San Francisco)
    zoom: 13
  });
  
  // When map has loaded, add markers
  map.on('load', function() {
    // Add unit markers
    addUnitMarkers();
    
    // Add incident markers
    addIncidentMarkers();
  });
}

/**
 * Add police unit markers to the map
 */
function addUnitMarkers() {
  // Sample unit data - in a real application this would come from your backend
  const unitData = [
    { id: 'Unit-4', lat: 37.7849, lng: -122.4294, status: 'available' },
    { id: 'Unit-12', lat: 37.7869, lng: -122.4169, status: 'available' },
    { id: 'Unit-9', lat: 37.7629, lng: -122.4449, status: 'busy' },
    { id: 'Unit-15', lat: 37.7739, lng: -122.4194, status: 'busy' },
    { id: 'Unit-8', lat: 37.7934, lng: -122.3939, status: 'responding' }
  ];
  
  // Add unit markers
  unitData.forEach(unit => {
    // Create marker element for Mapbox
    const markerEl = document.createElement('div');
    markerEl.className = `unit-marker ${unit.status}`;
    markerEl.textContent = unit.id.split('-')[1]; // Just show unit number
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'marker-tooltip';
    tooltip.textContent = `${unit.id} - ${unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}`;
    markerEl.appendChild(tooltip);
    
    // Set up event listeners for hover effect
    markerEl.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
      tooltip.style.transform = 'translateX(-50%) translateY(-10px)';
    });
    
    markerEl.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      tooltip.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Add to map
    const marker = new mapboxgl.Marker(markerEl)
      .setLngLat([unit.lng, unit.lat])
      .addTo(map);
    
    // Store marker reference
    markers.units.push(marker);
  });
}

/**
 * Add incident markers to the map
 */
function addIncidentMarkers() {
  // Sample call/incident data - in a real application this would come from your backend
  const callData = [
    { id: 'Call-1572', lat: 37.7779, lng: -122.4050, priority: 'high', icon: '🚨', type: 'Robbery in Progress' },
    { id: 'Call-1571', lat: 37.7799, lng: -122.4190, priority: 'medium', icon: '🚦', type: 'Traffic Accident' },
    { id: 'Call-1570', lat: 37.7919, lng: -122.4219, priority: 'low', icon: '🔊', type: 'Noise Complaint' }
  ];
  
  // Add incident markers
  callData.forEach(call => {
    // Create marker element
    const markerEl = document.createElement('div');
    markerEl.className = `incident-marker priority-${call.priority}`;
    
    const iconEl = document.createElement('div');
    iconEl.className = 'incident-icon';
    iconEl.textContent = call.icon;
    
    markerEl.appendChild(iconEl);
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'marker-tooltip';
    tooltip.textContent = `${call.type} - ID: ${call.id}`;
    markerEl.appendChild(tooltip);
    
    // Set up event listeners for hover effect
    markerEl.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
      tooltip.style.transform = 'translateX(-50%) translateY(-10px)';
    });
    
    markerEl.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      tooltip.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Add to map
    const marker = new mapboxgl.Marker(markerEl)
      .setLngLat([call.lng, call.lat])
      .addTo(map);
    
    // Store marker reference
    markers.calls.push(marker);
  });
}

/**
 * Event listener to initialize map when clicking on map tab
 */
document.addEventListener('click', function(e) {
  if (e.target.matches('.mdt-nav-link[data-page="map"]')) {
    // Initialize map with a slight delay to ensure the container is visible
    setTimeout(initMap, 100);
  }
});

/**
 * Update map markers with new data
 * This function would be called when new data is received from the server
 */
function updateMapMarkers(newUnitData, newCallData) {
  // Clear existing markers
  markers.units.forEach(marker => marker.remove());
  markers.calls.forEach(marker => marker.remove());
  markers.units = [];
  markers.calls = [];
  
  // Add new markers
  if (newUnitData) {
    // Add updated unit markers
    newUnitData.forEach(unit => {
      const markerEl = document.createElement('div');
      markerEl.className = `unit-marker ${unit.status}`;
      markerEl.textContent = unit.id.split('-')[1];
      
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([unit.lng, unit.lat])
        .addTo(map);
      
      markers.units.push(marker);
    });
  } else {
    // Re-add the default unit markers if no new data
    addUnitMarkers();
  }
  
  if (newCallData) {
    // Add updated call markers
    newCallData.forEach(call => {
      const markerEl = document.createElement('div');
      markerEl.className = `incident-marker priority-${call.priority}`;
      
      const iconEl = document.createElement('div');
      iconEl.className = 'incident-icon';
      iconEl.textContent = call.icon;
      
      markerEl.appendChild(iconEl);
      
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([call.lng, call.lat])
        .addTo(map);
      
      markers.calls.push(marker);
    });
  } else {
    // Re-add the default call markers if no new data
    addIncidentMarkers();
  }
}

/**
 * Function to fly to a specific location on the map
 */
function flyToLocation(lat, lng, zoom = 15) {
  if (!map) return;
  
  map.flyTo({
    center: [lng, lat],
    zoom: zoom,
    essential: true
  });
}

/**
 * Function to fly to a specific unit on the map
 */
function focusOnUnit(unitId) {
  // Find the unit in the array
  const unit = markers.units.find(marker => {
    return marker.getElement().textContent === unitId.split('-')[1];
  });
  
  if (unit) {
    const lngLat = unit.getLngLat();
    flyToLocation(lngLat.lat, lngLat.lng);
  }
}

/**
 * Function to fly to a specific incident on the map
 */
function focusOnIncident(callId) {
  // This would need to be implemented based on how you identify incidents
  // For now, just a placeholder
  console.log(`Focusing on incident ${callId}`);
}

// Get unit details for map markers
function getUnitDetails(unitId) {
  // This would fetch real data in a production environment
  const unitData = {
    'Unit-4': {
      id: 'Unit 4',
      officer: 'Officer Martinez',
      badge: '#5819',
      status: 'Available',
      vehicle: 'Ford Explorer SUV',
      location: 'Patrol District 2',
      lastUpdate: '10:43 AM'
    },
    'Unit-8': {
      id: 'Unit 8',
      officer: 'Officer Brown',
      badge: '#6023',
      status: 'Responding to Call',
      vehicle: 'Dodge Charger',
      location: 'En route to 123 Elm Street',
      lastUpdate: '10:41 AM'
    },
    'Unit-9': {
      id: 'Unit 9',
      officer: 'Officer Taylor',
      badge: '#5742',
      status: 'On Scene',
      vehicle: 'Ford Explorer SUV',
      location: '185 Oak Street, Downtown',
      lastUpdate: '10:35 AM'
    },
    'Unit-12': {
      id: 'Unit 12',
      officer: 'Officer Johnson',
      badge: '#5472',
      status: 'Available',
      vehicle: 'Ford Explorer SUV',
      location: 'Patrol District 3',
      lastUpdate: '10:40 AM'
    },
    'Unit-15': {
      id: 'Unit 15',
      officer: 'Sgt. Williams',
      badge: '#4821',
      status: 'Traffic Stop',
      vehicle: 'Chevrolet Tahoe',
      location: 'Main St & 5th Ave',
      lastUpdate: '10:36 AM'
    }
  };

  const unit = unitData[unitId] || { id: unitId, status: 'Unknown' };
  
  return `
    <div class="unit-details">
      <h3>${unit.id} - ${unit.officer}</h3>
      <div class="detail-item">
        <span class="detail-label">Badge:</span>
        <span class="detail-value">${unit.badge}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Status:</span>
        <span class="detail-value">${unit.status}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Vehicle:</span>
        <span class="detail-value">${unit.vehicle}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Location:</span>
        <span class="detail-value">${unit.location}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Last Update:</span>
        <span class="detail-value">${unit.lastUpdate}</span>
      </div>
      <div class="detail-actions">
        <button class="mdt-action-button">Contact Unit</button>
        <button class="mdt-action-button">Dispatch to Call</button>
      </div>
    </div>
  `;
}

// Get incident details for map markers
function getIncidentDetails(callId) {
  // This would fetch real data in a production environment
  const callData = {
    'Call-1570': {
      id: '#24-1570',
      type: 'Noise Complaint',
      location: '472 Pine Apartments, Unit 3B',
      time: '10:15 AM (21 min ago)',
      priority: 'Low',
      caller: 'Anonymous',
      description: 'Caller reports loud music coming from neighboring apartment. Ongoing issue.',
      units: 'None assigned'
    },
    'Call-1571': {
      id: '#24-1571',
      type: 'Traffic Accident',
      location: 'Main St & 5th Ave',
      time: '10:28 AM (8 min ago)',
      priority: 'Medium',
      caller: 'John Smith',
      description: 'Two-vehicle collision, minor injuries reported. Lane blocked.',
      units: 'Unit 15 on scene'
    },
    'Call-1572': {
      id: '#24-1572',
      type: 'Robbery in Progress',
      location: '185 Oak Street, Downtown',
      time: '10:32 AM (4 min ago)',
      priority: 'High',
      caller: 'Store Employee',
      description: 'Armed subject demanding cash from register. Weapon displayed.',
      units: 'Unit 9 on scene, Unit 8 responding'
    }
  };

  const call = callData[callId] || { id: callId, type: 'Unknown' };
  
  return `
    <div class="incident-details">
      <h3>Incident ${call.id}</h3>
      <div class="detail-item">
        <span class="detail-label">Type:</span>
        <span class="detail-value">${call.type}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Location:</span>
        <span class="detail-value">${call.location}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Received:</span>
        <span class="detail-value">${call.time}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Priority:</span>
        <span class="detail-value priority-${call.priority.toLowerCase()}">${call.priority}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Caller:</span>
        <span class="detail-value">${call.caller}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Description:</span>
        <span class="detail-value">${call.description}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Units Assigned:</span>
        <span class="detail-value">${call.units}</span>
      </div>
      <div class="detail-actions">
        <button class="mdt-action-button">Assign Unit</button>
        <button class="mdt-action-button">Update Status</button>
        <button class="mdt-action-button">Create Report</button>
      </div>
    </div>
  `;
}

// Add the missing CSS and animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-50px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-50px); }
}

@keyframes highlightNew {
  0% { background-color: rgba(59, 130, 246, 0.3); }
  100% { background-color: transparent; }
}

.notification-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.7);
  backdrop-filter: blur(3px);
  z-index: 1000;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
}

.notification-content {
  background-color: var(--secondary-bg);
  border-radius: var(--card-radius);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  border: 1px solid var(--border-color);
}

.notification-header {
  background-color: var(--panel-bg);
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.notification-body {
  padding: 20px;
  background-color: var(--secondary-bg);
}

.notification-footer {
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  background-color: var(--panel-bg);
  border-top: 1px solid var(--border-color);
}

/* Add vehicle styles */
.mdt-vehicle-detail {
  background-color: var(--secondary-bg);
  border-radius: var(--card-radius);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: rgba(52, 152, 219, 0.1);
  border-bottom: 1px solid var(--border-color);
}

.vehicle-info {
  padding: 20px;
}

/* Map details panel active state */
.map-details-panel.active {
  transform: translateX(0);
  opacity: 1;
}

/* Search results panel display */
#search-results-panel {
  display: none;
  grid-column: span 12;
}
`;
document.head.appendChild(additionalStyles);

// Initialize charts when they exist
function initializeCharts() {
  // Department Activity Chart - Line Chart
  const activityCtx = document.getElementById('activityChart');
  if (activityCtx && window.Chart) {
    new Chart(activityCtx, {
      type: 'line',
      data: {
        labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12AM', '2AM', '4AM'],
        datasets: [{
          label: 'Calls Volume',
          data: [5, 8, 12, 15, 18, 22, 25, 30, 22, 18, 10, 7],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#bdc3c7'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#bdc3c7'
            }
          }
        }
      }
    });
  }

  // Crime Types Chart - Pie Chart
  const crimeTypesCtx = document.getElementById('crimeTypesChart');
  if (crimeTypesCtx && window.Chart) {
    new Chart(crimeTypesCtx, {
      type: 'doughnut',
      data: {
        labels: ['Theft', 'Assault', 'Burglary', 'DUI', 'Disturbance', 'Other'],
        datasets: [{
          data: [35, 20, 15, 12, 10, 8],
          backgroundColor: [
            '#3498db',
            '#e74c3c',
            '#f39c12',
            '#2ecc71',
            '#9b59b6',
            '#34495e'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#ecf0f1',
              padding: 10,
              font: {
                size: 11
              }
            }
          }
        }
      }
    });
  }

  // Crime Locations Chart - Bar Chart
  const crimeLocationCtx = document.getElementById('crimeLocationChart');
  if (crimeLocationCtx && window.Chart) {
    new Chart(crimeLocationCtx, {
      type: 'bar',
      data: {
        labels: ['Downtown', 'Northside', 'Westend', 'Eastside', 'Southside'],
        datasets: [{
          label: 'Incident Count',
          data: [42, 28, 22, 18, 15],
          backgroundColor: '#3498db',
          barThickness: 15,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#bdc3c7'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#bdc3c7'
            }
          }
        }
      }
    });
  }
}