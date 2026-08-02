####################################################################################################
# DOCUMENT INFORMATION
####################################################################################################

Project Name      : ShelfSense AI
Document          : 08_Git_Workflow.md
Version           : 1.0
Priority          : High

####################################################################################################
# PURPOSE
####################################################################################################

This document defines the official Git workflow for ShelfSense AI.

Objectives

• Organized Development

• Parallel Team Work

• Safe Integration

• Version Control

• Easy Recovery

Every team member must follow this workflow.

####################################################################################################
# GIT PHILOSOPHY
####################################################################################################

Never work directly on the Main branch.

Every feature should be developed independently.

Every completed feature should be reviewed before merging.

Git should always contain a stable version of the project.

####################################################################################################
# REPOSITORY STRUCTURE
####################################################################################################

GitHub Repository

ShelfSense-AI

Primary Branches

main

develop

Feature Branches

feature/frontend

feature/backend

feature/analytics

Hotfix Branch

hotfix/*

####################################################################################################
# BRANCH RESPONSIBILITIES
####################################################################################################

main

Purpose

Stable Production Version

Rules

Never commit directly.

Only merge from develop.

------------------------------------------------------------

develop

Purpose

Latest integrated development version.

Rules

Merge tested features only.

------------------------------------------------------------

feature/frontend

Owner

Borad

Contains

React Development

------------------------------------------------------------

feature/backend

Owner

Kansara

Contains

Django

Database

REST APIs

------------------------------------------------------------

feature/analytics

Owner

Thaker

Contains

CSV Engine

Analytics

Machine Learning

Reports

NodeMailer

####################################################################################################
# DAILY WORKFLOW
####################################################################################################

Morning

↓

Pull latest develop branch.

↓

Switch to personal feature branch.

↓

Develop assigned feature.

↓

Run local tests.

↓

Commit changes.

↓

Push to GitHub.

↓

Create Pull Request.

↓

Merge into develop.

####################################################################################################
# MERGE WORKFLOW
####################################################################################################

feature/frontend

↓

develop

------------------------------------------------------------

feature/backend

↓

develop

------------------------------------------------------------

feature/analytics

↓

develop

------------------------------------------------------------

develop

↓

main

Only after successful testing.

####################################################################################################
# COMMIT RULES
####################################################################################################

One Commit

↓

One Logical Change

Bad

"Updated Project"

Good

"Added JWT Authentication"

Good

"Implemented CSV Validation"

Good

"Created Inventory Dashboard"

####################################################################################################
# COMMIT MESSAGE FORMAT
####################################################################################################

feat:

New Feature

Example

feat: Added Product Dashboard

------------------------------------------------------------

fix:

Bug Fix

Example

fix: Corrected CSV Parsing Error

------------------------------------------------------------

docs:

Documentation

Example

docs: Updated API Design

------------------------------------------------------------

style:

Formatting

------------------------------------------------------------

refactor:

Improved Existing Code

------------------------------------------------------------

test:

Testing

####################################################################################################
# PULL REQUEST RULES
####################################################################################################

Every Pull Request should contain

Purpose

Changes Made

Screenshots (If UI)

Testing Result

Related Issue

Never merge without review.

####################################################################################################
# CONFLICT RESOLUTION
####################################################################################################

If Merge Conflict Occurs

Do not panic.

Step 1

Pull latest develop.

↓

Step 2

Resolve conflict.

↓

Step 3

Test project.

↓

Step 4

Commit resolved version.

↓

Step 5

Push again.

Never force push unless absolutely necessary.

####################################################################################################
# CODE REVIEW CHECKLIST
####################################################################################################

Before Merge

✔ Builds Successfully

✔ No Errors

✔ No Warnings

✔ API Tested

✔ UI Tested

✔ Documentation Updated

✔ No Duplicate Logic

✔ Follows Architecture

####################################################################################################
# BRANCH PROTECTION RULES
####################################################################################################

main

No Direct Commit

No Direct Push

Merge Only

------------------------------------------------------------

develop

Merge Only From Feature Branches

------------------------------------------------------------

feature/*

Personal Development

####################################################################################################
# PROJECT MILESTONES
####################################################################################################

Milestone 1

Project Setup

------------------------------------------------------------

Milestone 2

Authentication

------------------------------------------------------------

Milestone 3

Database

------------------------------------------------------------

Milestone 4

CSV Synchronization

------------------------------------------------------------

Milestone 5

Dashboard

------------------------------------------------------------

Milestone 6

Analytics

------------------------------------------------------------

Milestone 7

AI Engine

------------------------------------------------------------

Milestone 8

Notifications

------------------------------------------------------------

Milestone 9

Testing

------------------------------------------------------------

Milestone 10

Final Submission

####################################################################################################
# BACKUP STRATEGY
####################################################################################################

Every completed feature

↓

Push to GitHub

Never keep important work only on local machine.

GitHub becomes the official backup.

####################################################################################################
# RELEASE PROCESS
####################################################################################################

Develop

↓

Testing

↓

Bug Fixes

↓

Merge

↓

Main

↓

Release

####################################################################################################
# COMMON MISTAKES
####################################################################################################

Do not commit directly to Main.

Do not work without pulling latest changes.

Do not ignore merge conflicts.

Do not commit unfinished features.

Do not delete feature branches before merge.

####################################################################################################
# WHAT THIS DOCUMENT GUARANTEES
####################################################################################################

After reading this document

Developer understands

✔ Git Workflow

✔ Branch Strategy

✔ Merge Process

✔ Team Collaboration

✔ Commit Standards

✔ Release Strategy

####################################################################################################
# CODEX CONTEXT
####################################################################################################

When generating project code

Respect module ownership.

Never modify another developer's module.

Generate isolated commits.

Follow feature branch workflow.

####################################################################################################
# CHATGPT CONTEXT
####################################################################################################

Future AI assistants should assume

The project follows Git Flow.

Development occurs in feature branches.

Main always remains stable.

####################################################################################################
# FINAL PRINCIPLE
####################################################################################################

Git is not only a backup system.

It is the history of engineering decisions.

Every commit should clearly explain what changed and why.

####################################################################################################