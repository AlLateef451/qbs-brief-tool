# QBS Client Website Brief Tool

## Project Overview

The QBS Client Website Brief Tool is a React.js application created for the Junior Software Engineer Practical Assessment.

The purpose of this application is to help a QBS team member capture a client’s website requirements in a clear and structured way before preparing a proposal or starting a website project.

The tool collects important information such as client details, website goals, website type, required pages, required features, design and branding preferences, budget, and timeline information.

---

## Technologies Used

- React.js
- Vite
- JavaScript
- Bootstrap
- CSS
- Browser Local Storage

---

## Features Completed

The application currently includes the following features:

- Client details form
- Website goals selection
- Website type selection
- Required pages selection
- Required features selection
- Design and branding section
- Budget and timeline section
- Required field validation
- Save brief functionality
- Local storage support
- Saved data remains available after refreshing the page
- Clean and responsive interface using Bootstrap and custom CSS

---

## Main Form Sections

The application captures the following sections:

### 1. Client Details

The user can enter:

- Company name
- Contact person
- Email address
- Phone number
- Current website
- Industry / business type

### 2. Website Goals

The user can select one or more website goals, including:

- Generate leads
- Sell products online
- Showcase services
- Take bookings
- Share company information
- Improve credibility
- Other

### 3. Website Type

The user can select one website type, including:

- Basic business website
- E-commerce website
- Landing page
- Blog / content website
- Web application
- Not sure

### 4. Required Pages

The user can select multiple pages, including:

- Home
- About
- Services
- Products
- Contact
- Blog
- FAQ
- Testimonials
- Careers
- Privacy Policy
- Terms and Conditions
- Other

### 5. Required Features

The user can select multiple features, including:

- Contact form
- Quote request form
- WhatsApp button
- Online payments
- Booking calendar
- Newsletter signup
- User login
- Admin dashboard
- Product catalogue
- E-commerce checkout
- SEO setup
- Google Analytics
- Other

### 6. Design and Branding

The user can capture:

- Whether the client has a logo
- Whether the client has brand colours
- Whether the client has existing content
- Whether the client has images
- Example websites the client likes
- Notes about the preferred design style

### 7. Budget and Timeline

The user can capture:

- Estimated budget range
- Desired launch date
- Whether the deadline is flexible
- Important business dates or campaign dates

---

## How to Run the Project

Follow the steps below to run the project locally.

### 8. Open the project folder

Open the project folder in Visual Studio Code.

If you are using the terminal, navigate into the project folder:

```bash
cd qbs-brief-tool


9. Install dependencies

Run the following command:

npm install

If you are using Windows PowerShell and npm is blocked, use:

npm.cmd install
10. Start the development server

Run:

npm run dev

If you are using Windows PowerShell and npm is blocked, use:

npm.cmd run dev
11. Open the application

After running the development server, Vite will provide a local link, usually:

http://localhost:5173/

Open the link in your browser to view the application.

How to Use the Application
Open the application in the browser.
Fill in the client details.
Select the client’s website goals.
Select the website type.
Select the required website pages.
Select the required website features.
Complete the design and branding section.
Enter the budget and timeline information.
Click the Save Brief button.
The brief will be saved in the browser’s local storage.

When the page is refreshed, the saved information will still appear because the application uses local storage.

12. Storage Method

This project uses browser local storage to save the captured client brief.

The brief is saved using the key:

qbsBrief

This means the data is saved only in the user’s browser. It is not stored in an external database or backend server.

13. Validation

Required fields are marked using HTML form validation.

Some important fields must be completed before the form can be submitted, such as:

Company name
Contact person
Email address
Phone number
Website type
Budget
Desired launch date
Assumptions Made

14. The following assumptions were made while building the project:

The tool will be used internally by a QBS team member.
A frontend-only application is acceptable for this assessment.
Local storage is acceptable for saving the brief data.
The tool is intended to capture one brief at a time.
The application does not require user login or authentication.
The application does not require a backend or external database for the current version.
The user completing the form has already spoken to the client or has the client’s website requirements available.


15. AI Section

A simple generated summary was created using the captured form data. It does not use an external AI API.

16. Basic Unit test

Basic unit tests were added using Vitest and React Testing Library to confirm that key UI elements, such as the app title, render correctly.

i was getting an error and according to my research. The issue is that Vitest is running without a browser-like environment, so React Testing Library cannot render the app properly.

17. Regular Expression Validation

Regular expression validation was added to check key form inputs such as email address, South African phone number, website URL, and budget format before the brief can be submitted.