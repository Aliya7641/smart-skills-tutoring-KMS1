// Google Apps Script endpoint
const endpoint = "https://script.google.com/macros/s/AKfycbwmQ5e19HLPPwcrFj_6ExJMAGr0W2y1mp4PmhJjlahjZ7uzRpqcHAYFaWM0V36wEcpi/exec";

// Capture referral token from URL
function getReferralToken() {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref') || '';
}

// Generic form submission function
function setupForm(formId, type) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = { type };

    // Copy form data into data object
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Add referral token if student form
    if (type === "student") data.referral_token = getReferralToken();

    // Send data to Google Apps Script
    fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        // Redirect to thankyou page
        window.location.href = "thankyou.html";
      } else {
        alert("Error: " + res.message);
      }
    })
    .catch(err => alert("Error: " + err.message));
  });
}

// Setup all forms
setupForm("studentForm", "student");
setupForm("tutorForm", "tutor");
setupForm("trialForm", "trial");
setupForm("referralForm", "referral");
