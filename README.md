# Pomodoro Timer

A configurable Pomodoro Timer created as **Task 27** of my
**Web Development Internship at Veda Technology**.

## Project Overview

This project is a browser-based Pomodoro timer based on the
work-and-break productivity technique.

Users can configure work and break durations, start and pause the
timer, reset the session, and automatically switch between work and
break periods.

The application also tracks completed work sessions and supports
browser notifications.

## Objective

The main objective was to practice:

- JavaScript timers
- State transitions
- Countdown logic
- Browser Notifications API
- localStorage
- DOM manipulation
- Form handling
- Responsive design

## Technologies Used

- HTML5
- CSS3
- JavaScript
- localStorage
- Notifications API

## Features

- Configurable work duration
- Configurable break duration
- Start button
- Pause button
- Reset button
- Automatic work-to-break transition
- Automatic break-to-work transition
- Completed session counter
- Browser notifications
- Persistent timer settings
- Responsive design

## Timer States

The timer is modeled using three logical states:

```text
IDLE
  ↓
RUNNING
  ↓
PAUSED
