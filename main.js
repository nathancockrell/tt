// Select the form element
const eventForm = document.getElementById('eventForm');
const timelineCanvas = document.getElementById('timelineCanvas');
const ctx = timelineCanvas.getContext('2d');

// Select modal elements
const eventModal = document.getElementById('eventModal');
const closeModalBtn = document.querySelector('.close');
const editEventForm = document.getElementById('editEventForm');

// Global variables
let selectedScore = null;
let events = JSON.parse(localStorage.getItem('events')) || [];
let selectedEventIndex = null;

// temp history display
const histbtn = document.getElementById("showhistory");
const histdisp = document.getElementById("history-display");
let shown=false;
histbtn.addEventListener("click",()=>{
    if(shown){
        histdisp.style.display = 'none'
        shown=false;
    }else{
        histdisp.style.display = 'block'
        shown=true;
    }
    histdisp.innerHTML=localStorage.getItem('events')
})


// Create score buttons and append to the scoreButtons div
const scoreButtonsContainer = document.getElementById('scoreButtons');

// Set today's date as default in the date input field
function setTodaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    document.getElementById('date').value = formattedDate;
    document.getElementById("selectDate").value = formattedDate;
}

// Call the function to set the date when the page loads
window.onload = function() {
    setTodaysDate();
    generateScoreButtons(); // Generate the score buttons
    renderTimeline(); // Render the timeline with existing events
};




// Function to generate score buttons
function generateScoreButtons() {
    for (let i = 0; i < 10; i++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = i;
        button.value = i;

        button.addEventListener('click', () => handleScoreSelect(i, button));

        scoreButtonsContainer.appendChild(button);
    }
}

// Handle form submission
eventForm.addEventListener('submit', handleFormSubmit);
editEventForm.addEventListener('submit', handleEditSubmit);

// Handle score selection
function handleScoreSelect(score, button) {
    selectedScore = score;
    const buttons = scoreButtonsContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

// Handle event form submission
function handleFormSubmit(event) {
    event.preventDefault();
    if (selectedScore === null) {
        alert('Please select a score');
        return;
    }

    const eventData = {
        date: document.getElementById('date').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        score: selectedScore
    };

    events.push(eventData);
    localStorage.setItem('events', JSON.stringify(events));

    eventForm.reset();
    selectedScore = null;
    scoreButtonsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));

    renderTimeline();
}

// Render the timeline on the canvas
function renderTimeline() {
    ctx.clearRect(0, 0, timelineCanvas.width, timelineCanvas.height);
    const blockHeight = 50;
    for(let i = 0; i<24; i++){
        ctx.fillStyle="#000000";
        ctx.font = '16px Arial';
        ctx.fillText(i, 0, ((blockHeight*i))+16);
        ctx.strokeRect(0,(blockHeight*i)-1,timelineCanvas.width,0);
    }

    let todaysEvents=[];
    let selectedDate=document.getElementById("selectDate").value;

    events.forEach((event)=>{
        if(event.date==selectedDate){
            todaysEvents.push(event);
        }
    })
    todaysEvents.forEach((event, index) => {
        let begin = event.startTime;
        let startHour=begin.slice(0,2);
        let startMin = begin.slice(3);
        let end = event.endTime;
        let endHour = event.endTime.slice(0,2);
        let endMin = event.endTime.slice(3);
        

        const yPosition = ((Number(startHour))* (blockHeight))+(Number(startMin)*(5/6));
        ctx.fillStyle = '#007bff';
        ctx.fillRect(20, yPosition, timelineCanvas.width - 20, blockHeight);
        ctx.fillStyle = '#fff';
        ctx.strokeRect(20, yPosition, timelineCanvas.width - 20, blockHeight)
        ctx.font = '16px Arial';
        ctx.fillText(event.title, 20, yPosition + 16);

        // Store the event position for click handling
        events[index].yPosition = yPosition;
    });
}

// Handle clicking on the canvas to edit event
timelineCanvas.addEventListener('click', (event) => {
    const clickY = event.offsetY;
    const clickedEvent = events.find(evt => clickY >= evt.yPosition && clickY <= evt.yPosition + 60);
    if (clickedEvent) {
        openModal(clickedEvent);
    }
});

// Open modal with event data
function openModal(event) {
    const { title, description, startTime, endTime } = event;
    document.getElementById('editTitle').value = title;
    document.getElementById('editDescription').value = description;
    document.getElementById('editStartTime').value = startTime;
    document.getElementById('editEndTime').value = endTime;
    selectedEventIndex = events.indexOf(event);
    eventModal.style.display = 'flex';
}

// Close modal
closeModalBtn.addEventListener('click', () => {
    eventModal.style.display = 'none';
});

// Handle editing and saving event
function handleEditSubmit(event) {
    event.preventDefault();
    const updatedEvent = {
        ...events[selectedEventIndex],
        title: document.getElementById('editTitle').value,
        description: document.getElementById('editDescription').value,
        startTime: document.getElementById('editStartTime').value,
        endTime: document.getElementById('editEndTime').value,
    };

    events[selectedEventIndex] = updatedEvent;
    localStorage.setItem('events', JSON.stringify(events));

    eventModal.style.display = 'none';
    renderTimeline();
}

document.getElementById("selectDate").addEventListener("change", ()=>{
    renderTimeline();
})
