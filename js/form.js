// ========================================
// FORM VALIDATION & INTERACTIONS
// ========================================

const form = document.getElementById('heroForm');
const fullNameInput = document.getElementById('fullName');
const phoneInput = document.getElementById('phone');
const companyInput = document.getElementById('companyName');
const productSelect = document.getElementById('productInterest');
const kvkkCheckbox = document.getElementById('kvkk');
const submitBtn = form.querySelector('.btn-submit');
const formSuccess = document.getElementById('formSuccess');

// Select floating label: add/remove has-value class
if (productSelect) {
  productSelect.addEventListener('change', () => {
    if (productSelect.value) {
      productSelect.classList.add('has-value');
    } else {
      productSelect.classList.remove('has-value');
    }
  });
}

// ========================================
// PHONE FORMATTING
// ========================================
phoneInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');

  // Limit to 11 digits
  if (value.length > 11) value = value.slice(0, 11);

  // Format: (5xx) xxx xx xx
  let formatted = '';
  if (value.length > 0) {
    // If starts with 0, skip it
    if (value.startsWith('0')) {
      value = value.slice(1);
    }
    if (value.length > 0) formatted += '(' + value.slice(0, 3);
    if (value.length >= 3) formatted += ') ';
    if (value.length > 3) formatted += value.slice(3, 6);
    if (value.length > 6) formatted += ' ' + value.slice(6, 8);
    if (value.length > 8) formatted += ' ' + value.slice(8, 10);
  }

  e.target.value = formatted;
});

// ========================================
// VALIDATION
// ========================================
function validateField(input, errorEl, rules) {
  const value = input.value.trim();
  let error = '';

  for (const rule of rules) {
    if (!rule.test(value)) {
      error = rule.message;
      break;
    }
  }

  if (error) {
    input.classList.add('error');
    input.classList.remove('success');
    errorEl.textContent = error;
    return false;
  } else {
    input.classList.remove('error');
    input.classList.add('success');
    errorEl.textContent = '';
    return true;
  }
}

const nameRules = [
  { test: v => v.length > 0, message: 'Ad soyad gereklidir' },
  { test: v => v.length >= 3, message: 'En az 3 karakter giriniz' },
  { test: v => /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(v), message: 'Sadece harf kullanınız' },
];

const phoneRules = [
  { test: v => v.length > 0, message: 'Telefon numarası gereklidir' },
  { test: v => v.replace(/\D/g, '').length >= 10, message: 'Geçerli bir telefon numarası giriniz' },
];

const companyRules = [
  { test: v => v.length > 0, message: 'Firma adı gereklidir' },
  { test: v => v.length >= 2, message: 'En az 2 karakter giriniz' },
];

// Validate on blur
fullNameInput.addEventListener('blur', () => {
  validateField(fullNameInput, document.getElementById('fullNameError'), nameRules);
});

phoneInput.addEventListener('blur', () => {
  const raw = phoneInput.value.replace(/\D/g, '');
  validateField({ value: raw, classList: phoneInput.classList }, document.getElementById('phoneError'), phoneRules);
});

companyInput.addEventListener('blur', () => {
  validateField(companyInput, document.getElementById('companyNameError'), companyRules);
});

// Clear error on input
[fullNameInput, phoneInput, companyInput].forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('error');
  });
});

// ========================================
// FORM SUBMIT
// ========================================
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValid = validateField(fullNameInput, document.getElementById('fullNameError'), nameRules);
  const phoneRaw = phoneInput.value.replace(/\D/g, '');
  const phoneValid = validateField(
    { value: phoneRaw, classList: phoneInput.classList },
    document.getElementById('phoneError'),
    phoneRules
  );
  const companyValid = validateField(companyInput, document.getElementById('companyNameError'), companyRules);

  if (!kvkkCheckbox.checked) {
    kvkkCheckbox.parentElement.style.color = 'var(--error)';
    setTimeout(() => {
      kvkkCheckbox.parentElement.style.color = '';
    }, 2000);
  }

  if (nameValid && phoneValid && companyValid && kvkkCheckbox.checked) {
    // Show loading state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    btnText.textContent = 'Gönderiliyor...';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate submit (no backend)
    setTimeout(() => {
      form.style.display = 'none';
      document.querySelector('.form-title').style.display = 'none';
      document.querySelector('.form-subtitle').style.display = 'none';
      formSuccess.style.display = 'block';
    }, 1500);
  }
});
