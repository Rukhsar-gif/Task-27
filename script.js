"use strict";

const timerElement =
    document.getElementById("timer");

const progressBar =
    document.getElementById("progressBar");

const sessionBadge =
    document.getElementById("sessionBadge");

const sessionStatus =
    document.getElementById("sessionStatus");

const startButton =
    document.getElementById("startButton");

const pauseButton =
    document.getElementById("pauseButton");

const resetButton =
    document.getElementById("resetButton");

const sessionCountElement =
    document.getElementById("sessionCount");

const workDurationInput =
    document.getElementById("workDuration");

const breakDurationInput =
    document.getElementById("breakDuration");

const saveSettingsButton =
    document.getElementById("saveSettingsButton");

const settingsMessage =
    document.getElementById("settingsMessage");

const workInfo =
    document.getElementById("workInfo");

const breakInfo =
    document.getElementById("breakInfo");

const settingsKey =
    "vedaTask27PomodoroSettings";

let state = "idle";

let sessionType = "work";

let remainingSeconds = 25 * 60;

let totalSessionSeconds = 25 * 60;

let completedSessions = 0;

let timerInterval = null;

let endTime = null;

let workMinutes = 25;

let breakMinutes = 5;


function loadSettings() {
    try {
        const savedSettings =
            localStorage.getItem(
                settingsKey
            );

        if (!savedSettings) {
            return;
        }

        const parsedSettings =
            JSON.parse(savedSettings);

        if (
            Number.isFinite(
                Number(parsedSettings.workMinutes)
            )
        ) {
            workMinutes =
                clamp(
                    Number(parsedSettings.workMinutes),
                    1,
                    120
                );
        }

        if (
            Number.isFinite(
                Number(parsedSettings.breakMinutes)
            )
        ) {
            breakMinutes =
                clamp(
                    Number(parsedSettings.breakMinutes),
                    1,
                    60
                );
        }

    } catch (error) {
        workMinutes = 25;
        breakMinutes = 5;
    }
}


function saveSettings() {
    localStorage.setItem(
        settingsKey,
        JSON.stringify({
            workMinutes,
            breakMinutes
        })
    );
}


function clamp(value, min, max) {
    return Math.min(
        Math.max(value, min),
        max
    );
}


function formatTime(seconds) {
    const minutes =
        Math.floor(seconds / 60);

    const remaining =
        seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}


function updateDisplay() {
    timerElement.textContent =
        formatTime(remainingSeconds);

    sessionCountElement.textContent =
        completedSessions;

    workInfo.textContent =
        `${workMinutes} min`;

    breakInfo.textContent =
        `${breakMinutes} min`;

    const elapsed =
        totalSessionSeconds -
        remainingSeconds;

    const progress =
        totalSessionSeconds === 0
            ? 0
            : (elapsed / totalSessionSeconds) * 100;

    progressBar.style.width =
        `${Math.min(Math.max(progress, 0), 100)}%`;

    if (sessionType === "work") {

        sessionBadge.textContent =
            "WORK";

        sessionBadge.className =
            "session-badge work";

        sessionStatus.textContent =
            state === "running"
                ? "Stay focused"
                : "Ready to focus";

    } else {

        sessionBadge.textContent =
            "BREAK";

        sessionBadge.className =
            "session-badge break";

        sessionStatus.textContent =
            state === "running"
                ? "Take a short break"
                : "Time to recharge";
    }
}


function getSessionDuration() {
    return sessionType === "work"
        ? workMinutes * 60
        : breakMinutes * 60;
}


function resetTimerValues() {
    totalSessionSeconds =
        getSessionDuration();

    remainingSeconds =
        totalSessionSeconds;

    endTime = null;

    updateDisplay();
}


function startTimer() {
    if (state === "running") {
        return;
    }

    if (state === "idle") {
        totalSessionSeconds =
            getSessionDuration();

        if (remainingSeconds <= 0) {
            remainingSeconds =
                totalSessionSeconds;
        }

        requestNotificationPermission();
    }

    state = "running";

    endTime =
        Date.now() +
        remainingSeconds * 1000;

    clearInterval(timerInterval);

    timerInterval =
        setInterval(
            updateTimer,
            200
        );

    startButton.disabled = true;
    pauseButton.disabled = false;

    document.body.classList.add(
        "timer-running"
    );

    updateDisplay();
}


function pauseTimer() {
    if (state !== "running") {
        return;
    }

    updateTimer();

    state = "paused";

    clearInterval(timerInterval);

    timerInterval = null;

    endTime = null;

    startButton.disabled = false;
    pauseButton.disabled = true;

    document.body.classList.remove(
        "timer-running"
    );

    sessionStatus.textContent =
        "Timer paused";
}


function resetTimer() {
    clearInterval(timerInterval);

    timerInterval = null;

    state = "idle";

    sessionType = "work";

    completedSessions = 0;

    startButton.disabled = false;
    pauseButton.disabled = true;

    document.body.classList.remove(
        "timer-running"
    );

    resetTimerValues();
}


function updateTimer() {
    if (state !== "running") {
        return;
    }

    const millisecondsLeft =
        endTime - Date.now();

    remainingSeconds =
        Math.max(
            0,
            Math.ceil(
                millisecondsLeft / 1000
            )
        );

    updateDisplay();

    if (millisecondsLeft <= 0) {
        finishSession();
    }
}


function finishSession() {
    clearInterval(timerInterval);

    timerInterval = null;

    if (sessionType === "work") {

        completedSessions++;

        showNotification(
            "Work session completed",
            "Great work! Time for a short break."
        );

        sessionType = "break";

    } else {

        showNotification(
            "Break completed",
            "Your break is over. Ready for the next focus session?"
        );

        sessionType = "work";
    }

    totalSessionSeconds =
        getSessionDuration();

    remainingSeconds =
        totalSessionSeconds;

    state = "running";

    endTime =
        Date.now() +
        remainingSeconds * 1000;

    updateDisplay();

    startButton.disabled = true;
    pauseButton.disabled = false;

    timerInterval =
        setInterval(
            updateTimer,
            200
        );
}


function requestNotificationPermission() {
    if (
        "Notification" in window &&
        Notification.permission === "default"
    ) {
        Notification.requestPermission();
    }
}


function showNotification(title, body) {
    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {
        new Notification(
            title,
            {
                body
            }
        );
    }
}


function applySettings() {
    if (state === "running") {
        settingsMessage.textContent =
            "Pause or reset the timer before changing settings.";

        return;
    }

    const workValue =
        Number(workDurationInput.value);

    const breakValue =
        Number(breakDurationInput.value);

    if (
        !Number.isFinite(workValue) ||
        !Number.isFinite(breakValue)
    ) {
        settingsMessage.textContent =
            "Please enter valid durations.";

        return;
    }

    workMinutes =
        clamp(workValue, 1, 120);

    breakMinutes =
        clamp(breakValue, 1, 60);

    workDurationInput.value =
        workMinutes;

    breakDurationInput.value =
        breakMinutes;

    saveSettings();

    sessionType = "work";

    resetTimerValues();

    settingsMessage.textContent =
        "Settings saved successfully.";
}


startButton.addEventListener(
    "click",
    startTimer
);


pauseButton.addEventListener(
    "click",
    pauseTimer
);


resetButton.addEventListener(
    "click",
    resetTimer
);


saveSettingsButton.addEventListener(
    "click",
    applySettings
);


loadSettings();

workDurationInput.value =
    workMinutes;

breakDurationInput.value =
    breakMinutes;

resetTimerValues();