// MediVolt Login Script
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const hospitalId = document.getElementById('hospitalid');
    const password = document.getElementById('password');
    const button = form.querySelector('button');

    // Validation functions
    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('has-error');
        input.classList.add('error');
        
        let errorEl = formGroup.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            formGroup.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    function clearError(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('has-error');
        input.classList.remove('error');
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validate() {
        let valid = true;
        
        clearError(email);
        clearError(hospitalId);
        clearError(password);

        if (!email.value || !validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            valid = false;
        }

        if (!hospitalId.value || hospitalId.value.length < 6) {
            showError(hospitalId, 'Hospital ID must be at least 6 characters');
            valid = false;
        }

        if (!password.value || password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            valid = false;
        }

        return valid;
    }

    // Real-time validation
    [email, hospitalId, password].forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validate()) return;

        button.textContent = 'Signing In...';
        button.disabled = true;

       // 🔹 Real login API call
       fetch('/api/login', {
       method: 'POST',
       headers: {
        'Content-Type': 'application/json'
       },
       body: JSON.stringify({
        email: email.value,
        hospital_id: hospitalId.value,
        password: password.value
      })
})
.then(res => res.json())
.then(data => {
    if (data.success) {
        window.location.href = 'dashboard.html';
    } else {
        alert(data.message || 'Login failed');
        button.textContent = 'Sign In';
        button.disabled = false;
    }
})
.catch(err => {
    console.error('Login API error:', err);
    // ❌ removed popup
    button.textContent = 'Sign In';
    button.disabled = false;
});
    });
});
