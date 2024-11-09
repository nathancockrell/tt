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
let shown="graph";
histbtn.addEventListener("click",()=>{
    if(shown==="graph"){
        histdisp.style.display = 'block'
        histbtn.style.backgroundColor="#707070"
        timelineCanvas.style.display="none"
        graphbtn.style.backgroundColor="#404040"

        shown="list";
    }else{
    }
})
const graphbtn = document.getElementById("showGraph")
graphbtn.addEventListener("click", ()=>{
    if(shown==="list"){
        timelineCanvas.style.display = 'block'
        graphbtn.style.backgroundColor="#707070"
        histdisp.style.display="none"
        histbtn.style.backgroundColor="#404040"

        shown="graph";
    }else{
    }
})
graphbtn.style.backgroundColor="#707070"

document.getElementById("close").addEventListener("click",()=>{
    document.getElementById("formCC").style.display="none";
    document.getElementById("trigger").style.display="block";
})
document.getElementById("trigger").addEventListener("click",()=>{
    document.getElementById("formCC").style.display="flex";
    document.getElementById("trigger").style.display="none";
})


// Create score buttons and append to the scoreButtons div
const scoreButtonsContainer = document.querySelectorAll('.score-buttons');
console.log(scoreButtonsContainer)

// Set today's date as default in the date input field
function setTodaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    document.getElementById('date').value = formattedDate;
    document.getElementById("selectDate").value = formattedDate;
    document.getElementById("today").textContent=formattedDate;
}
document.getElementById("yesterday").addEventListener("click", yesterday)
document.getElementById("tomorrow").addEventListener("click", tomorrow)

function yesterday(){
    let current = document.getElementById("selectDate").value;

    let newD = new Date(current);
    let year = newD.getFullYear();
    let month = String(newD.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    let day = String(newD.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;

    document.getElementById("selectDate").value = formattedDate;
    renderTimeline();
}

function tomorrow(){
    let current = document.getElementById("selectDate").value;
    current = new Date(current)
    current.setDate(current.getDate()+1)
    const tomorrow = new Date(current);
    tomorrow.setDate(current.getDate() + 1);

    let year = tomorrow.getFullYear();
    let month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    let day = String(tomorrow.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;

    document.getElementById("selectDate").value = formattedDate;
    renderTimeline();
}

function moveSelectedDate(dir){
    console.log("s")
    let newDate = new Date();
    console.log(newDate)
    if(dir=="back"){

    }else if(dir=="forward"){

    }
    document.getElementById("selectDate").value =newDate;
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
        for(let k = 0; k<scoreButtonsContainer.length;k++){
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = i;
            button.value = i;

            button.addEventListener('click', () => handleScoreSelect(i, button, k));
            scoreButtonsContainer[k].appendChild(button)
        }
    }
}

// Handle form submission
eventForm.addEventListener('submit', handleFormSubmit);
editEventForm.addEventListener('submit', handleEditSubmit);

// Handle score selection
function handleScoreSelect(score, button, contIndex) {
    const buttons = scoreButtonsContainer[contIndex].querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('selected'));
    if(selectedScore==score){
        selectedScore=null;    
    }else{
        selectedScore = score;
    
    button.classList.add('selected');
    }
    
}

// Handle event form submission
function handleFormSubmit(event) {
    event.preventDefault();
    if (selectedScore === null) {
        selectedScore="";
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
    scoreButtonsContainer[1].querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
    setTodaysDate();
    renderTimeline();
    triggerNoti("Event saved.")
    // document.getElementById("formCC").style.display="none"
}

// Render the timeline on the canvas
function renderTimeline() {
    ctx.clearRect(0, 0, timelineCanvas.width, timelineCanvas.height);
    const blockHeight = timelineCanvas.height/24;
    for(let i = 0; i<24; i++){
        ctx.fillStyle="#000000";
        ctx.font = '16px Arial';
        ctx.fillText(i+":00", 0, ((blockHeight*i))+16);
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
        // console.log("AHDH",startHour, startMin," ", endHour,endMin)
        let length = (endHour-startHour) + (endMin-startMin)/60;
        if(length<0.33){
            length=.33;
        }

        const yPosition = ((Number(startHour))* (blockHeight))+(Number(startMin)/60);
        const xOffset = 50;
        ctx.fillStyle = 'rgb(80,80,80)';
        ctx.fillRect(xOffset, yPosition, timelineCanvas.width - xOffset, blockHeight*length);
        ctx.fillStyle = '#fff';
        ctx.strokeRect(xOffset, yPosition, timelineCanvas.width - xOffset, blockHeight*length)
        ctx.font = '12px Arial';
        console.log("TEXT", event.title)
        ctx.fillText(event.title, xOffset, yPosition + 12);

        // Store the event position for click handling
        events[index].yPosition = yPosition;
    });

    // timelineCanvas.addEventListener('click', (event) => {
    //     const clickY = event.offsetY;
    
    //     const clickedEvent = todaysEvents.find(evt => clickY >= evt.yPosition && clickY <= evt.yPosition + 60);
    //     if (clickedEvent) {
    //         openModal(clickedEvent);
    //     }
    // });

    // 
    histdisp.innerHTML ="";
    todaysEvents.forEach((event)=>{
        const element = document.createElement("div");
        const title = document.createElement("p");
        title.textContent=event.title;
        const date = document.createElement("p");
        date.textContent=event.date;
        const time = document.createElement("p");
        time.textContent=event.startTime +"-"+event.endTime;
        const score =document.createElement("p");
        score.textContent=event.score;
        const desc = document.createElement("p")
        desc.textContent=event.description;

        element.appendChild(title)
        element.appendChild(date)
        element.appendChild(time)
        element.appendChild(score)
        element.appendChild(desc)

        element.style.border="1px solid black";
        element.style.marginBottom="3px";

        element.addEventListener("click", ()=>{
            openModal(event)
        })
        histdisp.appendChild(element);
    })
}


// Handle clicking on the canvas to edit event


// Open modal with event data
function openModal(event) {
    console.log(event)
    const { title, date, description, startTime, endTime } = event;
    document.getElementById('editDate').value = date;
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
        date: document.getElementById('editDate').value,
        title: document.getElementById('editTitle').value,
        description: document.getElementById('editDescription').value,
        startTime: document.getElementById('editStartTime').value,
        endTime: document.getElementById('editEndTime').value,
        score: selectedScore
    };

    events[selectedEventIndex] = updatedEvent;
    localStorage.setItem('events', JSON.stringify(events));

    triggerNoti("Edits saved.")
    eventModal.style.display = 'none';

    renderTimeline();
}

function triggerNoti(message){
    console.log("noti triggered", message)
    document.getElementById("notification").textContent=message;
    document.getElementById("notidiv").classList.add("visible")
    document.getElementById("notidiv").classList.remove("hidden")
    setTimeout(()=>{
        document.getElementById("notidiv").classList.add('hidden')
        document.getElementById("notidiv").classList.remove("visible");
    },3000)

}

document.getElementById("selectDate").addEventListener("change", ()=>{
    renderTimeline();
})
