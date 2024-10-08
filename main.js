// Select the form element
const eventForm = document.getElementById('eventForm');

// Create score buttons and append to the scoreButtons div
const scoreButtonsContainer = document.getElementById('scoreButtons');
let selectedScore = null;

// Function to generate score buttons
function generateScoreButtons() {
    for (let i = 1; i <= 10; i++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = i;
        button.value = i;

        // Add click event listener to select score
        button.addEventListener('click', () => handleScoreSelect(i, button));

        scoreButtonsContainer.appendChild(button);
    }
}

// Function to handle score selection
function handleScoreSelect(score, button) {
    selectedScore = score;

    // Remove selected class from all buttons and add it to the clicked one
    const buttons = scoreButtonsContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('selected'));

    button.classList.add('selected');
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();  // Prevent page refresh on form submit

    // Check if a score is selected
    if (selectedScore === null) {
        alert('Please select a score');
        return;
    }

    // Get form values
    const eventData = {
        date: document.getElementById('date').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        score: selectedScore
    };

    // Save the data to localStorage as a JSON string
    saveEventData(eventData);
    
    // Clear form after submission
    eventForm.reset();
    selectedScore = null; // Reset score selection
    scoreButtonsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
}

// Function to save event data to localStorage
function saveEventData(eventData) {
    // Get existing events from localStorage
    let events = JSON.parse(localStorage.getItem('events')) || [];

    // Add new event to the array
    events.push(eventData);

    // Save updated array back to localStorage
    localStorage.setItem('events', JSON.stringify(events));

    console.log('Event saved:', eventData);
}

// Attach submit event listener to the form
eventForm.addEventListener('submit', handleFormSubmit);

// Generate the score buttons on page load
generateScoreButtons();
