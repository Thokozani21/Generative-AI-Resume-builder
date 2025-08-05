// Function to get the trimmed value of an element by ID
const f = id => document.getElementById(id).value.trim();

// Function to display custom messages
function showMessageBox(message) {
    document.getElementById('messageText').innerText = message;
    document.getElementById('messageBox').classList.remove('hidden');
}

// Function to hide custom messages
function hideMessageBox() {
    document.getElementById('messageBox').classList.add('hidden');
}

// Function to show loading overlay
function showLoading() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

// Function to hide loading overlay
function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

// Capitalizes the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to create HTML sections for the resume
function createSection(title, content) {
    if (!content.trim()) return ''; // Don't create section if content is empty
    return `
        <h3 class="text-xl font-semibold text-blue-700 mb-2">${title}</h3>
        <div class="prose max-w-none">
            <p>${content.replace(/\n/g, '<br>')}</p>
        </div>
    `;
}

// Helper function to create HTML for list-based sections (e.g., comma-separated)
function createListSection(title, content) {
    const items = content.split(',').map(item => item.trim()).filter(item => item);
    if (items.length === 0) return '';
    return `
        <h3 class="text-xl font-semibold text-blue-700 mb-2">${title}</h3>
        <ul class="list-disc list-inside ml-4 mb-4 text-gray-700">
            ${items.map(item => `<li>${item}</li>`).join('')}
        </ul>
    `;
}

// Main function to generate the resume preview
function generateResume() {
    const fields = [
        'name', 'idno', 'address', 'email', 'contact', 'linkedin', 'github', 'portfolio',
        'skills', 'about', 'highlights', 'languages', 'interests',
        'background', 'experience', 'qualification', 'certifications', 'courses'
        // Removed AI & Technical Portfolio fields
    ];
    const data = {};
    let allFieldsFilled = true;

    // Collect data and check for required fields
    for (let id of fields) {
        data[id] = document.getElementById(id).value.trim(); // Use .value directly
        // Mark certain fields as required (you can customize this list)
        if (['name', 'email', 'contact', 'skills', 'about', 'background', 'experience', 'qualification'].includes(id) && !data[id]) {
            showMessageBox('Please fill in the required field: ' + capitalize(id.replace(/([A-Z])/g, ' $1').trim()));
            allFieldsFilled = false;
            break;
        }
    }

    if (!allFieldsFilled) {
        document.getElementById('result').innerHTML = '<p class="text-red-500 text-center">Please fill in all required fields to generate the resume.</p>';
        return;
    }

    // Build the HTML for the resume result
    let resumeHtml = `
        <div class="text-center mb-6">
            <h2 class="text-3xl font-bold text-gray-800">${data.name}</h2>
            <p class="text-gray-600 mt-2">
                ${data.address ? `${data.address} | ` : ''}
                ${data.contact ? `${data.contact} | ` : ''}
                ${data.email ? `<a href="mailto:${data.email}" class="text-blue-600 hover:underline">${data.email}</a>` : ''}
            </p>
            <p class="text-gray-600">
                ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="text-blue-600 hover:underline mr-4"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
                ${data.github ? `<a href="${data.github}" target="_blank" class="text-blue-600 hover:underline mr-4"><i class="fab fa-github"></i> GitHub</a>` : ''}
                ${data.portfolio ? `<a href="${data.portfolio}" target="_blank" class="text-blue-600 hover:underline"><i class="fas fa-globe"></i> Portfolio</a>` : ''}
            </p>
            ${data.idno ? `<p class="text-sm text-gray-500">ID No: ${data.idno}</p>` : ''}
        </div>
        <hr class="border-gray-300 my-6"/>

        <section class="mb-6">
            ${createSection('Professional Summary', data.about)}
        </section>

        <section class="mb-6">
            ${createListSection('Skills', data.skills)}
        </section>

        <section class="mb-6">
            ${createSection('Key Accomplishments/Highlights', data.highlights)}
        </section>

        <section class="mb-6">
            <h2 class="text-2xl font-semibold text-gray-700 mb-4 text-center">Education & Training</h2>
            ${createSection('Academic Background', data.background)}
            ${createSection('Degrees & Qualifications', data.qualification)}
            ${createSection('Work Experience', data.experience)}
            ${createSection('Certifications', data.certifications)}
            ${createSection('Relevant Online Courses', data.courses)}
        </section>
        <hr class="border-gray-300 my-6"/>

        <section class="mb-6">
            ${createListSection('Languages Spoken', data.languages)}
            ${createSection('Interests or Hobbies', data.interests)}
        </section>
    `;

    document.getElementById('result').innerHTML = resumeHtml;
}

// Function to export the generated resume
async function exportFile(type) {
    const resultDiv = document.getElementById('result');
    if (!resultDiv.innerHTML || resultDiv.innerHTML.includes('Please fill in')) {
        showMessageBox('Please generate the resume preview first!');
        return;
    }

    showLoading(); // Show loading indicator

    try {
        if (type === 'html') {
            const htmlContent = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Generated Resume</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; margin: 20px; }
                    .resume-container { max-width: 800px; margin: auto; padding: 20px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
                    h1, h2, h3, h4 { color: #2c3e50; margin-bottom: 0.5em; }
                    h1 { text-align: center; font-size: 2.2em; }
                    h2 { font-size: 1.8em; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 20px; }
                    h3 { font-size: 1.4em; color: #3498db; margin-top: 15px; }
                    h4 { font-size: 1.1em; color: #555; margin-top: 10px; }
                    p, ul { margin-bottom: 1em; }
                    ul { list-style-type: disc; margin-left: 20px; }
                    a { color: #3498db; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                    hr { border: none; border-top: 1px dashed #ddd; margin: 20px 0; }
                    .text-center { text-align: center; }
                    .prose p { margin-bottom: 0.5em; }
                </style>
            </head>
            <body>
                <div class="resume-container">
                    ${resultDiv.innerHTML}
                </div>
            </body>
            </html>`;
            downloadBlob(new Blob([htmlContent], { type: 'text/html' }), 'resume.html');
        } else if (type === 'pdf') {
            const element = document.getElementById('result');
            await html2pdf().from(element).save('resume.pdf');
        } else if (type === 'docx') {
            const content = `<!DOCTYPE html><html><body>${resultDiv.innerHTML}</body></html>`;
            const blob = HtmlDocx.asBlob(content); // from html-docx-js
            downloadBlob(blob, 'resume.docx');
        } else {
            showMessageBox('Unsupported file type.');
        }
    } catch (e) {
        console.error('Export failed:', e);
        showMessageBox('Export failed: ' + e.message);
    } finally {
        hideLoading(); // Hide loading indicator
    }
}

// Helper function to download a blob as a file
function downloadBlob(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
}

// Function to generate professional summary using AI
async function generateAISummary() {
    const skills = f('skills');
    const background = f('background');
    const experience = f('experience');
    // Removed AI Projects as it's no longer in the form
    // const projects = f('projects');

    if (!skills && !background && !experience) { // Removed projects from check
        showMessageBox('Please fill in Skills, Academic Background, or Work Experience to generate an AI summary.');
        return;
    }

    showLoading(); // Show loading indicator

    const prompt = `Based on the following information, please write a concise, professional, and impactful summary for a resume. Focus on achievements, technical strengths, and career aspirations. Keep it under 150 words.
    Skills: ${skills}
    Academic Background: ${background}
    Work Experience: ${experience}
    `;
    // Removed AI Projects from prompt

    try {
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiKey = ""; // Canvas will automatically provide the API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const aiSummary = result.candidates[0].content.parts[0].text;
            document.getElementById('about').value = aiSummary; // Populate the 'about' textarea
            showMessageBox('AI summary generated successfully!');
        } else {
            showMessageBox('AI could not generate a summary. Please try again or provide more input.');
            console.error('Unexpected API response structure:', result);
        }
    } catch (error) {
        console.error('Error generating AI summary:', error);
        showMessageBox('Failed to generate AI summary: ' + error.message);
    } finally {
        hideLoading(); // Hide loading indicator
    }
}

// Function to clear all form fields
function clearAllFields() {
    const fields = [
        'name', 'idno', 'address', 'email', 'contact', 'linkedin', 'github', 'portfolio',
        'skills', 'about', 'highlights', 'languages', 'interests',
        'background', 'experience', 'qualification', 'certifications', 'courses'
        // Removed AI & Technical Portfolio fields
    ];
    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
        }
    });
    document.getElementById('result').innerHTML = '<p class="text-gray-500 text-center">Your generated resume will appear here.</p>';
    showMessageBox('All form fields have been cleared.');
}

// Function to toggle the visibility of the resume preview
function togglePreview() {
    const resultDiv = document.getElementById('result');
    if (resultDiv.classList.contains('hidden')) {
        resultDiv.classList.remove('hidden');
        showMessageBox('Resume preview is now visible.');
    } else {
        resultDiv.classList.add('hidden');
        showMessageBox('Resume preview is now hidden.');
    }
}

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const darkModeIconMobile = document.getElementById('darkModeIconMobile'); // For mobile menu icon
    if (document.body.classList.contains('dark-mode')) {
        if (darkModeIcon) {
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
        }
        if (darkModeIconMobile) {
            darkModeIconMobile.classList.remove('fa-moon');
            darkModeIconMobile.classList.add('fa-sun');
        }
        showMessageBox('Dark Mode enabled!');
    } else {
        if (darkModeIcon) {
            darkModeIcon.classList.remove('fa-sun');
            darkModeIcon.classList.add('fa-moon');
        }
        if (darkModeIconMobile) {
            darkModeIconMobile.classList.remove('fa-sun');
            darkModeIconMobile.classList.add('fa-moon');
        }
        showMessageBox('Dark Mode disabled!');
    }
}

// Function to toggle mobile sub-menus
function toggleMobileSubMenu(event) {
    const targetId = event.currentTarget.dataset.target;
    const subMenu = document.getElementById(targetId);
    if (subMenu) {
        subMenu.classList.toggle('hidden');
        const icon = event.currentTarget.querySelector('.fa-caret-right, .fa-caret-down');
        if (icon) {
            if (subMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-caret-down');
                icon.classList.add('fa-caret-right');
            } else {
                icon.classList.remove('fa-caret-right');
                icon.classList.add('fa-caret-down');
            }
        }
    }
}

// Function to load template data into the form
function loadTemplate(templateType) {
    clearAllFields(); // Clear current fields before loading new template
    let templateData = {};

    switch (templateType) {
        case 'modern':
            templateData = {
                name: 'Jane Doe',
                about: 'Highly motivated and results-oriented professional with expertise in project management and data analysis. Proven ability to lead successful initiatives, optimize workflows, and contribute to organizational growth. Seeking to leverage strong analytical skills and dedication to drive impactful projects.', // Modified summary
                skills: 'Project Management, Data Analysis, SQL, Microsoft Excel, Communication, Problem-solving, Report Generation, Team Leadership', // Modified skills
                experience: `Project Manager, Tech Innovations Inc. (2022-Present)
- Successfully managed 3 key projects from conception to completion, consistently meeting deadlines and budget.
- Implemented new data tracking procedures, improving data accuracy by 20%.
- Led cross-functional teams to streamline project workflows.

Data Analyst, Data Insights Co. (2020-2022)
- Analyzed large datasets to identify trends and provide actionable insights.
- Developed interactive dashboards using Tableau for key stakeholders.`,
                background: `Master of Business Administration, University of Tech (2020)
Bachelor of Science in Business Analytics, State University (2018)`,
                qualification: `MBA, B.Sc. Business Analytics`,
                certifications: 'PMP Certified, Certified Data Analyst', // Modified certifications
                courses: 'Advanced Data Analytics (Coursera), Project Management Professional (Udemy)' // Modified courses
                // Removed AI/ML specific template data
            };
            break;
        case 'creative':
            templateData = {
                name: 'Alex Rivera',
                about: 'Creative and innovative professional with a flair for design and engaging content creation. Passionate about exploring new ideas and crafting unique solutions that captivate audiences. Excited to contribute to projects that push creative boundaries.', // Modified summary
                skills: 'Graphic Design, Content Creation, UI/UX Principles, Storytelling, Video Editing, Social Media Management, Adobe Creative Suite, Photography', // Modified skills
                experience: `Content Creator, Art & Design Studio (2021-Present)
- Designed compelling visual content for digital campaigns, increasing engagement by 30%.
- Produced and edited promotional videos for various clients.
- Collaborated with marketing teams to develop creative strategies.`,
                background: `B.A. Graphic Design & Communications, City College (2020)`,
                qualification: `B.A. Graphic Design`,
                projects: `Brand Redesign Project: Led the complete rebranding effort for a local startup, resulting in a 25% increase in brand recognition.
Photography Portfolio: Curated and showcased a diverse portfolio of landscape and portrait photography.`,
                interests: 'Digital Art, Photography, Travel, Writing, Film' // Modified interests
                // Removed AI/ML specific template data
            };
            break;
        case 'professional':
            templateData = {
                name: 'Michael Chen',
                about: 'Experienced Operations Lead with a strong track record of optimizing processes and leading high-performing teams. Expertise in strategic planning, operational efficiency, and cross-functional collaboration. Seeking a leadership role to drive continuous improvement and achieve organizational excellence.', // Modified summary
                skills: 'Operations Management, Process Improvement, Supply Chain Optimization, Project Management, Team Leadership, Strategic Planning, Data-Driven Decision Making, Vendor Management', // Modified skills
                experience: `Lead Operations Manager, Global Logistics Solutions (2018-Present)
- Streamlined warehouse operations, reducing fulfillment time by 15% and cutting costs by 10%.
- Led a team of 10 operations specialists, overseeing daily activities and professional development.
- Developed and implemented new inventory management systems.

Senior Logistics Coordinator, Enterprise Supply Chain (2015-2018)
- Managed end-to-end logistics for key clients, ensuring on-time delivery and customer satisfaction.
- Identified and resolved supply chain bottlenecks, improving efficiency.`,
                background: `M.Sc. Supply Chain Management, Prestigious University (2015)
B.Sc. Business Administration, University of Excellence (2012)`,
                qualification: `M.Sc. Supply Chain, B.Sc. Business Admin`,
                certifications: 'Lean Six Sigma Black Belt, Certified Supply Chain Professional (CSCP)' // Modified certifications
                // Removed AI/ML specific template data
            };
            break;
        case 'simple':
            templateData = {
                name: 'Sarah Lee',
                about: 'Dedicated and organized individual with foundational administrative skills and a strong desire to contribute to a positive work environment. Eager to apply attention to detail and a proactive approach to entry-level administrative or support roles. Quick learner with a solid work ethic.', // Modified summary
                skills: 'Office Administration, Data Entry, Customer Service, Microsoft Office (Word, Excel), Scheduling, Communication, Organization', // Modified skills
                experience: `Office Assistant, Local Clinic (2023)
- Managed patient appointments and maintained office records.
- Assisted with data entry and document organization.`,
                background: `Associate of Arts in General Studies, Community College (Expected 2024)`,
                qualification: `A.A. General Studies`,
                courses: 'Introduction to Business Communication (Online Course), Basic Office Software (Vocational Training)' // Modified courses
                // Removed AI/ML specific template data
            };
            break;
        default:
            showMessageBox('Unknown template type.');
            return;
    }

    // Populate the form fields with template data
    for (const key in templateData) {
        const element = document.getElementById(key);
        if (element) {
            element.value = templateData[key];
        }
    }
    showMessageBox(`${capitalize(templateType)} Template Loaded!`);
    generateResume(); // Generate preview with new template data
    // Close mobile menu if it's open
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
}

// Function to show a specific section and hide others
function showSection(sectionId) {
    const sections = ['buildResumeSection', 'matchJobDescriptionSection'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            if (id === sectionId) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        }
    });
    // Close mobile menu if it's open
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
}

// Function to calculate job matching percentage and top skills
function matchJobDescription() {
    const jobDescriptionText = f('jobDescription').toLowerCase();
    const userSkillsText = f('skills').toLowerCase();
    const userExperienceText = f('experience').toLowerCase();
    const userEducationText = f('background').toLowerCase(); // Using background for education

    if (!jobDescriptionText) {
        showMessageBox('Please paste a job description to match.');
        return;
    }

    showLoading();

    // Tokenize skills from job description and user's resume
    const jobSkills = new Set(jobDescriptionText.match(/\b\w+\b/g) || []);
    const userSkillsArray = (userSkillsText.split(',').map(s => s.trim()).filter(s => s));

    let matchedSkillsCount = 0;
    const topMatchedSkills = [];

    userSkillsArray.forEach(userSkill => {
        if (jobSkills.has(userSkill)) {
            matchedSkillsCount++;
            topMatchedSkills.push(capitalize(userSkill));
        }
    });

    const totalJobSkills = jobSkills.size;
    let matchingPercentage = 0;
    if (totalJobSkills > 0) {
        matchingPercentage = Math.round((matchedSkillsCount / totalJobSkills) * 100);
    }
    
    // Simple relevance check for resume sections
    let skillsProgress = (matchedSkillsCount / Math.max(userSkillsArray.length, 1)) * 100;
    skillsProgress = Math.min(skillsProgress, 100); // Cap at 100%

    let experienceProgress = 0;
    if (userExperienceText.length > 50 && jobDescriptionText.includes('experience')) { // Simple check for presence and job description relevance
        experienceProgress = 70 + Math.random() * 30; // Simulate higher progress if experience is present
    } else if (userExperienceText.length > 0) {
        experienceProgress = 30 + Math.random() * 40;
    }
    experienceProgress = Math.min(experienceProgress, 100);

    let educationProgress = 0;
    if (userEducationText.length > 30 && jobDescriptionText.includes('education')) { // Simple check for presence and job description relevance
        educationProgress = 70 + Math.random() * 30; // Simulate higher progress
    } else if (userEducationText.length > 0) {
        educationProgress = 30 + Math.random() * 40;
    }
    educationProgress = Math.min(educationProgress, 100);


    // Update UI
    document.getElementById('matchingPercentage').innerText = `${matchingPercentage}%`;

    const topSkillsList = document.getElementById('topSkillsMatched');
    topSkillsList.innerHTML = ''; // Clear previous list
    if (topMatchedSkills.length > 0) {
        topMatchedSkills.forEach(skill => {
            const li = document.createElement('li');
            li.innerText = skill;
            topSkillsList.appendChild(li);
        });
    } else {
        topSkillsList.innerHTML = '<li class="text-gray-500">No matching skills found.</li>';
    }

    document.getElementById('skillsProgressBar').style.width = `${skillsProgress}%`;
    document.getElementById('experienceProgressBar').style.width = `${experienceProgress}%`;
    document.getElementById('educationProgressBar').style.width = `${educationProgress}%`;

    hideLoading();
    showMessageBox('Job description matched!');
}


// Event listeners for all interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Buttons in the main action group (from build resume section)
    document.getElementById('generatePreviewBtn').addEventListener('click', generateResume);
    document.getElementById('exportPdfBtn').addEventListener('click', () => exportFile('pdf'));
    document.getElementById('exportDocxBtn').addEventListener('click', () => exportFile('docx'));
    document.getElementById('exportHtmlBtn').addEventListener('click', () => exportFile('html'));
    document.getElementById('clearAllFieldsBtn').addEventListener('click', clearAllFields);
    document.getElementById('toggleDarkModeBtn').addEventListener('click', toggleDarkMode);
    document.getElementById('togglePreviewBtn').addEventListener('click', togglePreview);

    // Button in the match job description section
    document.getElementById('matchJobBtn').addEventListener('click', matchJobDescription);

    // OK button for message box
    document.getElementById('messageBoxOkBtn').addEventListener('click', hideMessageBox);

    // Hamburger menu toggle for mobile
    const hamburgerButton = document.getElementById('hamburgerButton');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburgerButton && mobileMenu) {
        hamburgerButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Attach event listeners to all nav links and dropdown items using data attributes
    document.querySelectorAll('[data-action]').forEach(element => {
        const action = element.dataset.action;
        if (action === 'showMessage') {
            element.addEventListener('click', () => showMessageBox(element.dataset.message));
        } else if (action === 'export') {
            element.addEventListener('click', () => exportFile(element.dataset.type));
        } else if (action === 'clearFields') {
            element.addEventListener('click', clearAllFields);
        } else if (action === 'generateAISummary') {
            element.addEventListener('click', generateAISummary);
        } else if (action === 'togglePreview') {
            element.addEventListener('click', togglePreview);
        } else if (action === 'toggleDarkMode') {
            element.addEventListener('click', toggleDarkMode);
        } else if (action === 'toggleMobileSubMenu') {
            element.addEventListener('click', toggleMobileSubMenu);
        } else if (action === 'loadTemplate') {
            element.addEventListener('click', () => loadTemplate(element.dataset.templateType));
        } else if (action === 'showSection') {
             element.addEventListener('click', () => showSection(element.dataset.targetSection));
        }
    });

    // Initialize by showing the build resume section
    showSection('buildResumeSection');
});


// Firebase Initialization (mandatory for Canvas environment, even if not used for persistence)
// Ensure these are globally accessible if needed by other functions, or passed as arguments.
let app;
let db;
let auth;
let userId;

window.onload = async function() {
    try {
        // Initialize Firebase app if __firebase_config is available
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
        if (firebaseConfig) {
            app = firebase.initializeApp(firebaseConfig);
            db = firebase.firestore(app); // Use getFirestore(app) in modern Firebase v9+
            auth = firebase.auth(app); // Use getAuth(app) in modern Firebase v9+

            // Sign in anonymously or with custom token
            const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
            if (initialAuthToken) {
                await firebase.auth().signInWithCustomToken(initialAuthToken);
            } else {
                await firebase.auth().signInAnonymously();
            }

            // Get user ID after authentication
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    userId = user.uid;
                    console.log("Firebase initialized and user authenticated:", userId);
                    // You can now safely perform Firestore operations if needed.
                } else {
                    console.log("Firebase initialized, no user authenticated (or signed out).");
                    // Generate a random ID if not authenticated for local operations
                    userId = crypto.randomUUID();
                }
            });

        } else {
            console.warn("Firebase config not found. Running without Firebase.");
            userId = crypto.randomUUID(); // Fallback for environments without Firebase
        }
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        showMessageBox("Firebase initialization failed. Some features might be unavailable.");
        userId = crypto.randomUUID(); // Fallback in case of Firebase init error
    }
};

// Dummy Firebase namespace for local testing if not running in Canvas
if (typeof firebase === 'undefined') {
    const firebase = {
        initializeApp: (config) => {
            console.log("Mock Firebase: Initializing app with config:", config);
            return {
                firestore: () => ({ /* mock firestore methods */ }),
                auth: () => ({
                    signInWithCustomToken: async (token) => console.log("Mock Firebase: Signing in with custom token:", token),
                    signInAnonymously: async () => console.log("Mock Firebase: Signing in anonymously"),
                    onAuthStateChanged: (callback) => {
                        console.log("Mock Firebase: Setting up auth state change listener.");
                        // Simulate an authenticated user after a short delay
                        setTimeout(() => {
                            callback({ uid: 'mock-user-id-' + Math.random().toString(36).substring(2, 9) });
                        }, 100);
                    }
                }),
                // Add other modules if needed for more comprehensive mocks
            };
        },
        firestore: () => ({ /* mock firestore methods */ }),
        auth: () => ({ /* mock auth methods */ })
    };
    window.firebase = firebase;
}