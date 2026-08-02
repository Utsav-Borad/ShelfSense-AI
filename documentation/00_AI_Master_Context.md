####################################################################################################
# DOCUMENT INFORMATION
####################################################################################################

Project Name      : ShelfSense AI
Document          : 00_AI_Master_Context.md
Version           : 1.0
Priority          : Highest
Owner             : Team ShelfSense AI

####################################################################################################
# PURPOSE OF THIS DOCUMENT
####################################################################################################

This document preserves the complete thinking process behind ShelfSense AI.

It is NOT a technical document.

It is NOT a project report.

It is the architectural memory of the project.

Every future AI assistant, developer, teammate or reviewer should read this document BEFORE reading any other documentation.

If every other document explains WHAT the project is,

this document explains WHY the project exists.

####################################################################################################
# AI INSTRUCTIONS (READ FIRST)
####################################################################################################

If you are an AI assistant:

(ChatGPT, Codex, Cursor AI, Claude, Gemini or any coding assistant)

Read this document completely before answering.

Assume every decision inside this file is intentional.

Never redesign the architecture unless explicitly instructed.

Never replace existing decisions with "better" ideas.

Never convert the project into a POS system.

Never add billing functionality.

Never replace CSV synchronization with live POS APIs.

Never ignore module ownership.

If another document conflicts with this document,

THIS DOCUMENT IS CORRECT.

####################################################################################################
# PROJECT IDENTITY
####################################################################################################

Project Name

ShelfSense AI

Official Description

AI Powered Inventory Decision Support & Waste Reduction Platform

Project Type

Business Intelligence Platform

NOT

Inventory Software

NOT

Billing Software

NOT

POS Software

NOT

ERP

The project starts AFTER billing.

####################################################################################################
# PROJECT PHILOSOPHY
####################################################################################################

The project is based on one belief.

Recording data does not create business value.

Making better decisions creates business value.

Existing POS software already records data.

ShelfSense AI converts business data into business decisions.

The project behaves like an AI Business Consultant.

Not an Inventory Register.

####################################################################################################
# ORIGINAL IDEA
####################################################################################################

Original Concept

Expiry Prediction Platform

Idea

Predict which products will expire.

Reason

Expiry causes business loss.

####################################################################################################
# WHY THE ORIGINAL IDEA WAS REJECTED
####################################################################################################

Problem

Simply predicting expiry has very little value.

Example

Milk expires tomorrow.

Recommendation

Sell it first.

Observation

Any experienced shopkeeper already knows this.

Artificial Intelligence should not provide obvious suggestions.

Artificial Intelligence should reveal hidden insights.

Therefore

Expiry prediction alone is NOT sufficient.

####################################################################################################
# IMPORTANT DISCUSSION
####################################################################################################

One major discussion changed the entire project.

Question

Would a shopkeeper actually need AI to tell him

"Sell tomorrow's expiry first."

Answer

No.

That recommendation is common sense.

The AI must solve problems the owner cannot easily discover.

This completely changed project direction.

####################################################################################################
# NEW PROJECT DIRECTION
####################################################################################################

ShelfSense AI became

Decision Support Platform

instead of

Prediction Platform.

Meaning

Instead of asking

"What will expire?"

The project asks

"What should the owner do next?"

Examples

Should reorder?

Should discount?

Should stop purchasing?

Should change supplier?

Should increase inventory?

Should reduce inventory?

####################################################################################################
# WHY WE ARE NOT BUILDING POS SOFTWARE
####################################################################################################

Decision

The project never performs billing.

Reason

Existing POS software already solves

• Billing

• Barcode

• GST

• Inventory

• Invoice

Building another POS would

Duplicate existing software.

Increase project complexity.

Reduce AI importance.

Move outside Semester scope.

Therefore

ShelfSense AI starts only after the POS exports business data.

####################################################################################################
# WHY CSV WAS CHOSEN
####################################################################################################

CSV is the official communication method.

Reason

Every POS software can export reports.

CSV makes the project

Vendor Independent

Simple

Scalable

Offline Compatible

Suitable for Semester Implementation

Changing CSV to APIs later should require minimal architecture changes.

####################################################################################################
# TARGET USERS
####################################################################################################

The project targets

Small and Medium Retail Businesses.

NOT

Large Enterprise Chains.

Reason

Large companies already use

SAP

Oracle

Microsoft Dynamics

Advanced ERP Systems

Small businesses usually have

POS

Excel

Basic Billing Software

But they lack

Business Intelligence.

####################################################################################################
# SUPPORTED BUSINESSES
####################################################################################################

Applicable Businesses

Medical Store

Grocery Store

Bakery

Cosmetic Store

Dairy

Organic Food Store

Frozen Food Store

Pet Food Store

Selection Rule

Any business where

Products have

Manufacturing Date

Expiry Date

####################################################################################################
# PROJECT BOUNDARY
####################################################################################################

ShelfSense AI begins

AFTER

POS exports reports.

Workflow

Supplier

↓

POS

↓

Billing

↓

CSV Export

↓

ShelfSense AI

↓

Analytics

↓

AI

↓

Recommendations

↓

Dashboard

↓

Email

The project never interacts with customers.

Only with business owners.

####################################################################################################
# CORE BUSINESS PROBLEM
####################################################################################################

The real business problem is NOT

Expiry.

The real business problem is

Poor Inventory Decisions.

Poor decisions cause

Wrong Purchasing

↓

Dead Stock

↓

Expiry

↓

Discounts

↓

Loss

Therefore

The AI should improve inventory decisions.

Not simply identify expiry.

####################################################################################################
# VALUE CREATED BY AI
####################################################################################################

Artificial Intelligence should answer questions the owner cannot answer easily.

Examples

Expected inventory loss

Dead stock prediction

Demand forecast

Supplier comparison

Purchase recommendations

Discount recommendations

Inventory optimization

Financial impact estimation

The AI should always produce

Business Value.

####################################################################################################
# WHAT THE AI MUST NEVER DO
####################################################################################################

Never

Predict obvious information.

Never

Replace human decisions.

Never

Automatically modify inventory.

Never

Automatically reorder products.

Never

Automatically apply discounts.

The AI only recommends.

Final decision belongs to the owner.

####################################################################################################
# SYSTEM PHILOSOPHY
####################################################################################################

React

Displays information.

Django

Controls the system.

SQLite

Stores information.

Pandas

Processes information.

Machine Learning

Generates intelligence.

Node.js

Delivers emails.

Every technology has one responsibility.

####################################################################################################
# TEAM STRUCTURE
####################################################################################################

Borad

Frontend

React

Bootstrap

Dashboard

UI

--------------------------------------------

Kansara

Backend

Django

REST

Database

Authentication

--------------------------------------------

Thaker

Analytics

CSV

Pandas

AI

NodeMailer

Reports

Every member owns independent modules.

####################################################################################################
# CODING PHILOSOPHY
####################################################################################################

Always

Modular

Scalable

Reusable

Independent

REST Based

Environment Driven

Never

Hardcode

Duplicate Logic

Mix Frontend and Backend

Break Module Ownership

####################################################################################################
# ARCHITECTURAL RULES
####################################################################################################

React never accesses SQLite.

SQLite never communicates with React.

AI never communicates with React.

Node.js never accesses database.

Every request passes through Django.

Django is the system controller.

####################################################################################################
# DOCUMENT HIERARCHY
####################################################################################################

Read documents in this order.

00_AI_Master_Context

↓

01_Project_Description

↓

02_Business_Workflow

↓

03_System_Architecture

↓

04_Database_Design

↓

05_API_Design

↓

06_AI_Architecture

↓

07_Development_Guide

↓

08_Git_Workflow

↓

09_Viva_Guide

####################################################################################################
# COMMON MISTAKES TO AVOID
####################################################################################################

Do NOT convert project into Inventory Software.

Do NOT create billing pages.

Do NOT redesign architecture.

Do NOT bypass REST APIs.

Do NOT put ML inside React.

Do NOT create direct SQLite access.

Do NOT create unnecessary complexity.

Keep every module independent.

####################################################################################################
# WHAT MAKES THIS PROJECT UNIQUE
####################################################################################################

Most inventory software answers

"What happened?"

ShelfSense AI answers

"What should happen next?"

The project focuses on

Decision Intelligence

instead of

Transaction Management.

This difference defines the entire architecture.

####################################################################################################
# CONTEXT FOR FUTURE AI ASSISTANTS
####################################################################################################

After reading this document,

an AI assistant should understand

✔ Why the project exists.

✔ Why CSV is used.

✔ Why POS is excluded.

✔ Why AI exists.

✔ Why Decision Support is the main objective.

✔ Team structure.

✔ Technology philosophy.

✔ Project boundaries.

No additional explanation should be required before reading technical documents.

####################################################################################################
# CONTEXT FOR CODEX
####################################################################################################

Before generating code

Read every documentation file.

Never modify architecture.

Generate production quality code.

Implement only requested module.

Respect module ownership.

Follow clean architecture.

Generate maintainable code.

####################################################################################################
# FINAL PRINCIPLE
####################################################################################################

The project is not built to demonstrate Artificial Intelligence.

The project is built to solve a real business problem.

Artificial Intelligence is only one tool used to achieve that goal.

If a future feature does not improve business decisions,

it should not become part of ShelfSense AI.

####################################################################################################