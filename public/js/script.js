document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
  
    const data = Object.fromEntries(formData.entries());
  
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Login Successful!');
        window.location.href = result.role === 'Student' ? '/student/dashboard' : '/teacher/dashboard';
      } else {
        alert(result.message || 'Login Failed!');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred, please try again later.');
    }
  });
  