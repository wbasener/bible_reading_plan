// Bible Reading Plan App - Main Application Logic

let currentPlan = null;
let currentDay = 1;
let completedDays = new Set();

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadState();
    updateUI();
});

// Load saved state from localStorage
function loadState() {
    const savedPlan = localStorage.getItem('selectedPlan');
    const savedDay = localStorage.getItem('currentDay');
    const savedCompleted = localStorage.getItem('completedDays');
    
    if (savedPlan) {
        currentPlan = savedPlan;
    }
    
    if (savedDay) {
        currentDay = parseInt(savedDay);
    } else {
        // Default to current day of year
        const today = new Date();
        currentDay = getDayOfYear(today);
    }
    
    if (savedCompleted) {
        completedDays = new Set(JSON.parse(savedCompleted));
    }
}

// Save state to localStorage
function saveState() {
    if (currentPlan) {
        localStorage.setItem('selectedPlan', currentPlan);
    }
    localStorage.setItem('currentDay', currentDay.toString());
    localStorage.setItem('completedDays', JSON.stringify([...completedDays]));
}

// Update the UI based on current state
function updateUI() {
    if (!currentPlan) {
        document.getElementById('planSelector').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
    } else {
        document.getElementById('planSelector').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        displayReading();
        updateStats();
        updateProgress();
    }
}

// Select a reading plan
function selectPlan(planKey) {
    currentPlan = planKey;
    currentDay = 1;
    saveState();
    updateUI();
}

// Show plan selector
function showPlanSelector() {
    if (confirm('Are you sure you want to change plans? Your progress will be saved.')) {
        document.getElementById('planSelector').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
    }
}

// Display the current day's reading
function displayReading() {
    const plan = READING_PLANS[currentPlan];
    if (!plan) return;
    
    // Update plan name
    document.getElementById('currentPlanName').textContent = plan.name;
    
    // Update day label
    const date = dayToDate(currentDay);
    document.getElementById('dayLabel').textContent = `Day ${currentDay} - ${formatDate(date)}`;
    
    // Update date input
    document.getElementById('dateInput').value = date.toISOString().split('T')[0];
    
    // Get reading content
    let readingText = '';
    if (currentPlan === '52week') {
        // 52-week plan is structured by weeks
        const weekIndex = Math.floor((currentDay - 1) / 7);
        const dayIndex = (currentDay - 1) % 7;
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const categories = ['Epistles', 'Law', 'History', 'Psalms', 'Poetry', 'Prophecy', 'Gospels'];
        
        if (weekIndex < plan.weeks.length) {
            const weekReadings = plan.weeks[weekIndex];
            readingText = `<div class="reading-passage"><strong>${dayNames[dayIndex]} (${categories[dayIndex]}):</strong><br>${weekReadings[dayIndex]}</div>`;
        }
    } else {
        // Other plans are day-based
        if (currentDay <= plan.days.length) {
            readingText = `<div class="reading-passage">${plan.days[currentDay - 1]}</div>`;
        } else {
            readingText = '<div class="reading-passage">You have completed the entire plan! 🎉</div>';
        }
    }
    
    document.getElementById('readingContent').innerHTML = readingText;
    
    // Update checkbox
    document.getElementById('completedCheckbox').checked = completedDays.has(currentDay);
}

// Toggle completed status
function toggleCompleted() {
    const isChecked = document.getElementById('completedCheckbox').checked;
    if (isChecked) {
        completedDays.add(currentDay);
    } else {
        completedDays.delete(currentDay);
    }
    saveState();
    updateStats();
    updateProgress();
}

// Navigate to previous day
function previousDay() {
    if (currentDay > 1) {
        currentDay--;
        saveState();
        displayReading();
    }
}

// Navigate to next day
function nextDay() {
    if (currentDay < 365) {
        currentDay++;
        saveState();
        displayReading();
    }
}

// Go to today
function goToToday() {
    const today = new Date();
    currentDay = getDayOfYear(today);
    saveState();
    displayReading();
}

// Go to specific date
function goToDate() {
    const dateInput = document.getElementById('dateInput').value;
    if (dateInput) {
        const selectedDate = new Date(dateInput);
        currentDay = getDayOfYear(selectedDate);
        saveState();
        displayReading();
    }
}

// Convert day number to date
function dayToDate(dayNumber) {
    const year = new Date().getFullYear();
    const date = new Date(year, 0);
    date.setDate(dayNumber);
    return date;
}

// Update stats
function updateStats() {
    // Days completed
    document.getElementById('daysCompleted').textContent = completedDays.size;
    
    // Current streak
    let streak = 0;
    for (let i = currentDay; i >= 1; i--) {
        if (completedDays.has(i)) {
            streak++;
        } else {
            break;
        }
    }
    document.getElementById('currentStreak').textContent = streak;
    
    // Longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    for (let i = 1; i <= 365; i++) {
        if (completedDays.has(i)) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    }
    document.getElementById('longestStreak').textContent = longestStreak;
}

// Update progress bar
function updateProgress() {
    const percentage = (completedDays.size / 365) * 100;
    document.getElementById('progressBar').style.width = percentage + '%';
    document.getElementById('progressText').textContent = Math.round(percentage) + '% Complete';
}

// Toggle calendar view
function toggleCalendar() {
    const calendar = document.getElementById('calendarView');
    if (calendar.style.display === 'none') {
        calendar.style.display = 'block';
        renderCalendar();
    } else {
        calendar.style.display = 'none';
    }
}

// Render calendar
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    
    const today = getDayOfYear(new Date());
    
    for (let day = 1; day <= 365; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;
        
        if (completedDays.has(day)) {
            dayDiv.classList.add('completed');
        }
        
        if (day === today) {
            dayDiv.classList.add('today');
        }
        
        dayDiv.onclick = function() {
            currentDay = day;
            saveState();
            displayReading();
            document.getElementById('calendarView').style.display = 'none';
        };
        
        grid.appendChild(dayDiv);
    }
}
