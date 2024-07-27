document.addEventListener('DOMContentLoaded', () => {
  const passwordField = document.getElementById('passwordEnter');
  const togglePasswordEnter = document.getElementById('togglePasswordEnter');
  
  const confirmPasswordField = document.getElementById('confirmPassword');
  const togglePasswordConfirm = document.getElementById('togglePasswordConfirm');
  
  if (passwordField && togglePasswordEnter) {
    togglePasswordEnter.addEventListener('click', () => {
      const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordField.setAttribute('type', type);
      togglePasswordEnter.src = type === 'password' ? '/assets/eye.png' : '/assets/eye-slash.png';
      togglePasswordEnter.alt = type === 'password' ? 'Show Password' : 'Hide Password';
    });
  }

  if (confirmPasswordField && togglePasswordConfirm) {
    togglePasswordConfirm.addEventListener('click', () => {
      const type = confirmPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPasswordField.setAttribute('type', type);
      togglePasswordConfirm.src = type === 'password' ? '/assets/eye.png' : '/assets/eye-slash.png';
      togglePasswordConfirm.alt = type === 'password' ? 'Show Password' : 'Hide Password';
    });
  }

  const toggleForm = document.getElementById('toggleForms');
  if (toggleForm) {
    toggleForm.addEventListener('click', (e) => {
      e.preventDefault(); 
      const currentPath = window.location.pathname;
      const newPath = currentPath === '/' ? '/register' : '/';
      window.location.href = newPath;
    });
  }
});
