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
    
    if (savedPlan) {
        currentPlan = savedPlan;
        
        // Load completed days for this specific plan
        const savedCompleted = localStorage.getItem(`completedDays_${currentPlan}`);
        if (savedCompleted) {
            completedDays = new Set(JSON.parse(savedCompleted));
        } else {
            completedDays = new Set();
        }
    }
    
    if (savedDay) {
        currentDay = parseInt(savedDay);
    } else {
        // Use getCurrentDay() to determine starting day
        currentDay = getCurrentDay();
    }
}

// Save state to localStorage
function saveState() {
    if (currentPlan) {
        localStorage.setItem('selectedPlan', currentPlan);
        // Save completed days for this specific plan
        localStorage.setItem(`completedDays_${currentPlan}`, JSON.stringify([...completedDays]));
    }
    localStorage.setItem('currentDay', currentDay.toString());
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
        renderCalendar(); // Always render calendar on load
    }
}

// Select a reading plan
function selectPlan(planKey) {
    currentPlan = planKey;
    
    // Load completed days for this specific plan
    const savedCompleted = localStorage.getItem(`completedDays_${currentPlan}`);
    if (savedCompleted) {
        completedDays = new Set(JSON.parse(savedCompleted));
    } else {
        completedDays = new Set();
    }
    
    // Set to current day for 2026 (or day 1 if in 2025)
    currentDay = getCurrentDay();
    
    saveState();
    updateUI();
    renderCalendar(); // Render calendar when plan is selected
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
    
    // Update the calendar checkbox for current day
    updateCalendarRow(currentDay);
    const calendarCheckbox = document.querySelector(`input[data-day="${currentDay}"]`);
    if (calendarCheckbox) {
        calendarCheckbox.checked = isChecked;
    }
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

// Convert day number to date in 2026
function dayToDate(dayNumber) {
    const date = new Date(2026, 0); // January 1, 2026
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

// Render calendar
function renderCalendar() {
    const tbody = document.getElementById('calendarTableBody');
    tbody.innerHTML = '';
    
    const today = getDayOfYear2026(new Date()); // Returns null if not in 2026
    const plan = READING_PLANS[currentPlan];
    if (!plan) return;
    
    for (let day = 1; day <= 365; day++) {
        const row = document.createElement('tr');
        const date = dayToDate(day);
        
        // Add classes
        if (completedDays.has(day)) {
            row.classList.add('completed');
        }
        if (today !== null && day === today) {
            row.classList.add('today');
            row.id = 'today-row'; // For scrolling to today
        }
        
        // Status column (checkbox)
        const statusCell = document.createElement('td');
        statusCell.className = 'col-status';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'calendar-checkbox';
        checkbox.checked = completedDays.has(day);
        checkbox.setAttribute('data-day', day);
        
        // Prevent row click when clicking checkbox
        checkbox.onclick = function(e) {
            e.stopPropagation();
            toggleDayFromCalendar(day);
        };
        
        statusCell.appendChild(checkbox);
        
        // Date column
        const dateCell = document.createElement('td');
        dateCell.className = 'col-date';
        dateCell.textContent = formatDate(date);
        
        // Reading column
        const readingCell = document.createElement('td');
        readingCell.className = 'col-reading';
        
        // Get reading text based on plan type
        let readingText = '';
        if (currentPlan === '52week') {
            const weekIndex = Math.floor((day - 1) / 7);
            const dayIndex = (day - 1) % 7;
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const categories = ['Epistles', 'Law', 'History', 'Psalms', 'Poetry', 'Prophecy', 'Gospels'];
            
            if (weekIndex < plan.weeks.length) {
                const weekReadings = plan.weeks[weekIndex];
                readingText = `${dayNames[dayIndex]} (${categories[dayIndex]}): ${weekReadings[dayIndex]}`;
            }
        } else {
            if (day <= plan.days.length) {
                readingText = plan.days[day - 1];
            } else {
                readingText = 'Plan completed! 🎉';
            }
        }
        
        readingCell.textContent = readingText;
        
        // Add click handler to entire row (but not checkbox)
        row.onclick = function(e) {
            // Don't navigate if clicking the checkbox
            if (e.target.type === 'checkbox') return;
            
            currentDay = day;
            saveState();
            displayReading();
            
            // Scroll to top to see the reading
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        
        // Append cells to row
        row.appendChild(statusCell);
        row.appendChild(dateCell);
        row.appendChild(readingCell);
        
        // Append row to tbody
        tbody.appendChild(row);
    }
}

// Toggle day completion from calendar checkbox
function toggleDayFromCalendar(day) {
    const checkbox = document.querySelector(`input[data-day="${day}"]`);
    
    if (checkbox.checked) {
        completedDays.add(day);
    } else {
        completedDays.delete(day);
    }
    
    saveState();
    updateStats();
    updateProgress();
    updateCalendarRow(day);
    
    // If the toggled day is the current day, update the main checkbox
    if (day === currentDay) {
        document.getElementById('completedCheckbox').checked = completedDays.has(day);
    }
}

// Update a single calendar row without re-rendering entire calendar
function updateCalendarRow(day) {
    const checkbox = document.querySelector(`input[data-day="${day}"]`);
    if (checkbox) {
        const row = checkbox.closest('tr');
        if (completedDays.has(day)) {
            row.classList.add('completed');
        } else {
            row.classList.remove('completed');
        }
    }
}

// Scroll to today's row in calendar
function scrollToToday() {
    const todayRow = document.getElementById('today-row');
    if (todayRow) {
        todayRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
