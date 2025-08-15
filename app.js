
        // Define the Web App URL for Google Apps Script.
        // IMPORTANT: Replace 'YOUR_DEPLOYED_WEB_APP_URL_HERE' with the actual URL
        // obtained after deploying your Google Apps Script as a Web App.
        const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzqIQLIzFAe-2p6dCATgywadlovctmZ6XBIfQO5eiZeg70YpFPUAXdUerPEskmfZPXjUA/exec'; 

        document.addEventListener('DOMContentLoaded', () => {
            const startAssessmentBtn = document.getElementById('startAssessmentBtn');
            const mentalHealthAssessmentForm = document.getElementById('mentalHealthAssessmentForm');
            const assessment9QSection = document.getElementById('assessment-9q');
            const q9AssessmentForm = document.getElementById('q9AssessmentForm');
            const assessmentResults9Q = document.getElementById('assessment-results');
            const score9QDisplay = document.getElementById('score-9q');
            const resultLevel9QDisplay = document.getElementById('resultLevel-9q');
            const recommendationText9Q = document.getElementById('recommendationText-9q');
            const bookAppointmentBtn = document.getElementById('bookAppointmentBtn'); // 9Q booking button
            const goTo8QAssessmentBtn = document.getElementById('goTo8QAssessmentBtn');

            const assessment8QSection = document.getElementById('assessment-8q');
            const q8AssessmentForm = document.getElementById('q8AssessmentForm');
            const assessmentResults8Q = document.getElementById('assessment-results-8q');
            const score8QDisplay = document.getElementById('score-8q');
            const resultLevel8QDisplay = document.getElementById('resultLevel-8q');
            const recommendationText8Q = document.getElementById('recommendationText-8q');
            const bookAppointment8QBtn = document.getElementById('bookAppointment8QBtn'); // 8Q booking button
            const contactExpert8QBtn = document.getElementById('contactExpert8QBtn'); // 8Q emergency button

            // Get elements for initial page visibility control
            const introParagraph = document.getElementById('introParagraph');
            const initialFormWrapper = document.getElementById('initialFormWrapper');
            const personalInfoHeading = document.getElementById('personalInfoHeading'); // Get the heading
            const consentHeading = document.getElementById('consentHeading'); // Get the heading
            const consentBox = document.getElementById('consentBox'); // Get the consent box

            // 8Q specific elements for conditional display
            const q8a3MainRadios = document.querySelectorAll('input[name="q8a_3_main"]');
            const q8a3SubGroup = document.getElementById('q8a_3_sub_group');

            // Store user info and assessment results globally or pass them around
            let userData = {};
            let q9Score = 0;
            let q9Level = '';
            let q9Recommendation = '';
            let q8Score = 0;
            let q8Level = '';
            let q8Recommendation = '';


            // Function to show a custom alert/modal
            function showCustomAlert(message) {
                const alertBox = document.createElement('div');
                alertBox.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    z-index: 1000;
                    text-align: center;
                    font-family: 'Kanit', sans-serif;
                    max-width: 80%;
                    min-width: 300px;
                    border: 2px solid var(--primary-color);
                `;
                alertBox.innerHTML = `
                    <p style="font-size: 1.2em; margin-bottom: 20px; color: var(--text-dark);">${message}</p>
                    <button class="btn" style="background-color: var(--primary-color); padding: 10px 20px; font-size: 1em;">ตกลง</button>
                `;
                document.body.appendChild(alertBox);

                const closeBtn = alertBox.querySelector('.btn');
                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(alertBox);
                });
            }

            // Function to submit all collected data to Google Sheet
            async function submitFormDataToGoogleSheet() {
                // Collect personal info
                const formData = new FormData(mentalHealthAssessmentForm);
                userData = Object.fromEntries(formData.entries());

                // Combine all data
                const allData = {
                    ...userData,
                    q9_score: q9Score,
                    q9_level: q9Level,
                    q9_recommendation: q9Recommendation,
                    q8_score: q8Score,
                    q8_level: q8Level,
                    q8_recommendation: q8Recommendation
                };

                console.log("Data to be sent:", allData); // For debugging

                try {
                    console.log('Attempting to send data to Google Sheet...');
                    const response = await fetch(WEB_APP_URL, {
                        method: 'POST',
                        mode: 'cors', // Use 'no-cors' for simple POST to Apps Script Web App
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams(allData).toString()
                    });

                    // With 'no-cors', response.ok will always be true and response.json() will fail.
                    // We assume success if no network error.
                    console.log('Fetch request sent. Please check your Google Sheet for confirmation.');
                    // showCustomAlert('ข้อมูลถูกส่งไปยัง Google Sheet เรียบร้อยแล้ว!'); // Optional: show alert after submission

                } catch (error) {
                    console.error('Error submitting data to Google Sheet:', error);
                    showCustomAlert('เกิดข้อผิดพลาดในการส่งข้อมูลไปยัง Google Sheet: ' + error.message);
                }
            }


            // Event listener for "Start Assessment" button
            startAssessmentBtn.addEventListener('click', () => {
                if (mentalHealthAssessmentForm.checkValidity()) {
                    // Collect personal info when starting assessment
                    const formData = new FormData(mentalHealthAssessmentForm);
                    userData = Object.fromEntries(formData.entries());

                    // Hide initial page elements
                    if (introParagraph) introParagraph.style.display = 'none';
                    if (initialFormWrapper) initialFormWrapper.style.display = 'none';

                    // Show 9Q assessment section
                    assessment9QSection.style.display = 'block';
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
                } else {
                    // Trigger browser's validation messages
                    mentalHealthAssessmentForm.reportValidity();
                    showCustomAlert('กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วนก่อนเริ่มทำแบบประเมิน');
                }
            });

            // Event listener for 9Q form submission
            q9AssessmentForm.addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent default form submission

                let currentScore9Q = 0;
                for (let i = 1; i <= 9; i++) {
                    const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
                    if (selectedOption) {
                        currentScore9Q += parseInt(selectedOption.value);
                    } else {
                        showCustomAlert('กรุณาตอบคำถาม 9Q ให้ครบทุกข้อ');
                        return; // Stop submission if any question is unanswered
                    }
                }
                q9Score = currentScore9Q; // Store the score

                score9QDisplay.textContent = q9Score;

                // Reset button visibility for 9Q results
                bookAppointmentBtn.style.display = 'none';
                goTo8QAssessmentBtn.style.display = 'none';

                if (q9Score >= 19) {
                    q9Level = 'รุนแรงมาก';
                    q9Recommendation = 'ท่านมีความเสี่ยงสูงมากที่จะมีภาวะซึมเศร้าระดับรุนแรง ควรปรึกษาจิตแพทย์หรือผู้เชี่ยวชาญด้านสุขภาพจิตโดยเร็วที่สุด';
                    goTo8QAssessmentBtn.style.display = 'block'; // Force 8Q
                } else if (q9Score >= 13) {
                    q9Level = 'รุนแรงปานกลาง';
                    q9Recommendation = 'ท่านมีความเสี่ยงที่จะมีภาวะซึมเศร้าระดับปานกลาง ควรพิจารณาส่งพบจิตแพทย์เพื่อรับการตรวจวินิจฉัยเพิ่มเติม';
                    goTo8QAssessmentBtn.style.display = 'block'; // Force 8Q
                } else if (q9Score >= 7) {
                    q9Level = 'รุนแรงน้อย';
                    q9Recommendation = 'ท่านมีความเสี่ยงที่จะมีภาวะซึมเศร้าระดับน้อย ควรใส่ใจดูแลสุขภาพจิตของตนเอง หากอาการไม่ดีขึ้นหรือแย่ลง ควรปรึกษาผู้เชี่ยวชาญ และประเมินการฆ่าตัวตาย 8 คำถามต่อ';
                    bookAppointmentBtn.style.display = 'block'; // Show booking for low severity
                    goTo8QAssessmentBtn.style.display = 'block'; // Show 8Q
                } else { // totalScore9Q 0-6
                    q9Level = 'ไม่มีภาวะซึมเศร้า';
                    q9Recommendation = 'ท่านมีสุขภาพจิตที่ดี ไม่พบภาวะซึมเศร้า ควรดูแลรักษาสุขภาพจิตที่ดีนี้ต่อไป';
                    // No buttons displayed
                    // Only submit data if 9Q score is 0-6, as the assessment ends here for them
                    await submitFormDataToGoogleSheet(); 
                }

                resultLevel9QDisplay.textContent = q9Level;
                recommendationText9Q.textContent = q9Recommendation;

                // Hide 9Q assessment and show results
                assessment9QSection.style.display = 'none';
                assessmentResults9Q.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
            });

            // Event listener for "Go to 8Q Assessment" button
            goTo8QAssessmentBtn.addEventListener('click', () => {
                assessmentResults9Q.style.display = 'none';
                assessment8QSection.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
            });

            // Event listener for Q8a_3_main radio buttons to show/hide sub-question
            q8a3MainRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (document.querySelector('input[name="q8a_3_main"]:checked').value === '6') {
                        q8a3SubGroup.style.display = 'block';
                        // Make sub-question radios required when visible
                        q8a3SubGroup.querySelectorAll('input[type="radio"]').forEach(subRadio => {
                            subRadio.setAttribute('required', 'required');
                        });
                    } else {
                        q8a3SubGroup.style.display = 'none';
                        // Remove required attribute and uncheck sub-question radios when hidden
                        q8a3SubGroup.querySelectorAll('input[type="radio"]').forEach(subRadio => {
                            subRadio.removeAttribute('required');
                            subRadio.checked = false;
                        });
                    }
                });
            });


            // Event listener for 8Q form submission
            q8AssessmentForm.addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent default form submission

                let currentScore8Q = 0;
                // Q1
                const q8a1 = document.querySelector('input[name="q8a_1"]:checked');
                if (!q8a1) { showCustomAlert('กรุณาตอบคำถาม 8Q ข้อ 1'); return; }
                currentScore8Q += parseInt(q8a1.value);

                // Q2
                const q8a2 = document.querySelector('input[name="q8a_2"]:checked');
                if (!q8a2) { showCustomAlert('กรุณาตอบคำถาม 8Q ข้อ 2'); return; }
                currentScore8Q += parseInt(q8a2.value);

                // Q3 Main and Sub
                const q8a3Main = document.querySelector('input[name="q8a_3_main"]:checked');
                if (!q8a3Main) { showCustomAlert('กรุณาตอบคำถาม 8Q ข้อ 3'); return; }
                currentScore8Q += parseInt(q8a3Main.value); // Add score for main Q3

                if (q8a3Main.value === '6') { // If "มี" for main Q3
                    const q8a3Sub = document.querySelector('input[name="q8a_3_sub"]:checked');
                    if (!q8a3Sub) { showCustomAlert('กรุณาตอบคำถาม 8Q ข้อ 3 ย่อย'); return; }
                    currentScore8Q += parseInt(q8a3Sub.value); // Add score for sub Q3
                }

                // Q4 to Q8
                const q8Questions = ['q8a_4', 'q8a_5', 'q8a_6', 'q8a_7', 'q8a_8'];
                // Scores are already in the HTML value attributes for each radio button
                for (let i = 0; i < q8Questions.length; i++) {
                    const qName = q8Questions[i];
                    const selectedOption = document.querySelector(`input[name="${qName}"]:checked`);
                    if (!selectedOption) {
                        showCustomAlert(`กรุณาตอบคำถาม 8Q ข้อ ${i + 4}`); // +4 because we start from Q4
                        return;
                    }
                    currentScore8Q += parseInt(selectedOption.value);
                }
                q8Score = currentScore8Q; // Store the score


                score8QDisplay.textContent = q8Score;

                // Reset button visibility for 8Q results
                bookAppointment8QBtn.style.display = 'none'; // Default to hidden
                contactExpert8QBtn.style.display = 'none';

                if (q8Score >= 17) {
                    q8Level = 'รุนแรง';
                    q8Recommendation = 'ท่านมีแนวโน้มฆ่าตัวตายในปัจจุบันระดับรุนแรง กรุณาส่งต่อโรงพยาบาลที่มีจิตแพทย์ด่วน';
                    assessmentResults8Q.classList.add('high-risk');
                    bookAppointment8QBtn.style.display = 'block'; // Show booking button for severe risk
                    contactExpert8QBtn.style.display = 'block'; // Show emergency button for severe risk
                } else if (q8Score >= 9) {
                    q8Level = 'ปานกลาง';
                    q8Recommendation = 'ท่านมีแนวโน้มฆ่าตัวตายในปัจจุบันระดับปานกลาง ควรปรึกษาผู้เชี่ยวชาญด้านสุขภาพจิต';
                    assessmentResults8Q.classList.remove('high-risk'); // Ensure no high-risk styling
                    bookAppointment8QBtn.style.display = 'block'; // Show booking button for moderate risk
                } else if (q8Score >= 1) {
                    q8Level = 'น้อย';
                    q8Recommendation = 'ท่านมีแนวโน้มฆ่าตัวตายในปัจจุบันระดับน้อย ควรใส่ใจดูแลสุขภาพจิตของตนเอง หากมีอาการไม่สบายใจหรือคิดอยากทำร้ายตัวเองเกิดขึ้น ควรขอความช่วยเหลือทันที';
                    assessmentResults8Q.classList.remove('high-risk');
                    bookAppointment8QBtn.style.display = 'block'; // Show booking button for low risk
                } else { // totalScore8Q 0
                    q8Level = 'ไม่มี';
                    q8Recommendation = 'ท่านไม่มีแนวโน้มฆ่าตัวตายในปัจจุบัน ควรดูแลรักษาสุขภาพจิตที่ดีนี้ต่อไป';
                    assessmentResults8Q.classList.remove('high-risk');
                    // Both buttons remain hidden
                }

                resultLevel8QDisplay.textContent = q8Level;
                recommendationText8Q.textContent = q8Recommendation;

                // Hide 8Q assessment and show results
                assessment8QSection.style.display = 'none';
                assessmentResults8Q.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top

                // Submit data after 8Q assessment is completed
                await submitFormDataToGoogleSheet();
            });

            // Update the bookAppointmentBtn (for 9Q results) to redirect to the specified URL
            bookAppointmentBtn.addEventListener('click', () => {
                window.location.href = 'https://outlook.office365.com/owa/calendar/GrowthMindCenter@kmitl.ac.th/bookings/';
            });

            // Update the bookAppointment8QBtn (for 8Q results) to redirect to the specified URL
            bookAppointment8QBtn.addEventListener('click', () => {
                window.location.href = 'https://outlook.office365.com/owa/calendar/GrowthMindCenter@kmitl.ac.th/bookings/';
            });

            // Placeholder for contacting expert (can be expanded)
            contactExpert8QBtn.addEventListener('click', () => {
                showCustomAlert('กรุณาติดต่อสายด่วนสุขภาพจิต 1323 หรือโรงพยาบาลที่ใกล้ที่สุดทันที');
            });
        });
    
// Translation Data
const translations = {
    th: {
        title: "แบบประเมินสุขภาพจิต 9Q & 8Q",
        intro: "✨ กรุณากรอกข้อมูลส่วนตัวและทำแบบประเมินเพื่อรับคำแนะนำด้านสุขภาพจิต",
        firstName: "ชื่อ:",
        lastName: "นามสกุล:",
        gender: "เพศ:",
        startBtn: "เริ่มทำแบบประเมิน",
        q9Title: "แบบประเมิน 9Q",
        q8Title: "แบบประเมิน 8Q (ความคิดฆ่าตัวตาย)"
    },
    en: {
        title: "Mental Health Assessment 9Q & 8Q",
        intro: "✨ Please fill in your personal information and take the assessment to receive mental health advice.",
        firstName: "First Name:",
        lastName: "Last Name:",
        gender: "Gender:",
        startBtn: "Start Assessment",
        q9Title: "9Q Assessment",
        q8Title: "8Q Assessment (Suicidal Thoughts)"
    }
};

// Current language
let currentLang = "th";

// Function to switch language
function switchLanguage() {
    currentLang = currentLang === "th" ? "en" : "th";
    const t = translations[currentLang];

    document.querySelector("h1").textContent = t.title;
    document.getElementById("introParagraph").textContent = t.intro;
    document.querySelector('label[for="firstName"]').textContent = t.firstName;
    document.querySelector('label[for="lastName"]').textContent = t.lastName;
    document.querySelector('label[for="gender"]').textContent = t.gender;
    document.getElementById("startAssessmentBtn").textContent = t.startBtn;
    document.querySelector('#assessment-9q h2').textContent = t.q9Title;
    document.querySelector('#assessment-8q h2').textContent = t.q8Title;
}

// Event Listener
document.getElementById("languageToggleBtn").addEventListener("click", switchLanguage);
