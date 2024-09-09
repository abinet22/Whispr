<template>
    <div class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-header-left">
            <svg class="modal-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#ff5a5f" stroke-width="5" />
              <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="#ff5a5f" />
            </svg>
            <h2>Sign Up</h2>
          </div>
          <span class="close" @click="$emit('close')">&times;</span>
        </div>
        <div class="modal-body">
          <form id="registerForm">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="form.email" required />
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" v-model="form.password" required />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm Password:</label>
              <input type="password" id="confirmPassword" v-model="form.confirmPassword" required />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="button" @click="submitForm">Sign Up</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          email: '',
          password: '',
          confirmPassword: ''
        }
      };
    },
    methods: {
      submitForm() {
        console.log('Register Form:', this.form);
        // Handle form submission
      }
    }
  };
  </script>
  
 
  <style scoped>

  .main-content {
    display: flex;
    flex: 1;
    height: 100vh; /* Full viewport height */
    
  }

  .left-side, .right-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    
  }

  .right-side {
    background-color: var(--secondary-background);
    width: 100%;
  }

  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
  }

  .logo {
    width: 150px;
    height: 150px;
    margin-bottom: 20px;
  }

  .logo-text {
    color: var(--primary-color);
    font-size: 36px;
    font-weight: bold;
  }

  .button {
    background-color: var(--primary-color);
    color: var(--text-color);
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    text-decoration: none;
    margin: 5px 0;
    text-align: center;
    width: 100%;
    max-width: 300px;
  }

  .button:hover {
    background-color: #ff7b7f;
    transform: translateY(-2px);
  }

  .motto {
    font-family: "Font Awesome 6 Brands";
    font-size: 38px;
    font-weight: bold;
    margin-bottom: 120px;
    margin-top: -120px;
    text-align: right;
    /* transform: scaleY(2.2); 
  transform-origin: top;  */
  }

  .join-options {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 350px;
  }

  .login-link {
    color: var(--primary-color);
    text-decoration: none;
    font-size: 16px;
    margin-top: 20px;
    cursor: pointer;
  }

  .footer-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    padding: 20px;
    background-color: var(--secondary-background);
    text-align: center;
    width:100%;
  }

  .footer-links a {
    color: var(--link-color);
    text-decoration: none;
    font-size: 14px;
  }

  .footer-links a:hover {
    text-decoration: underline;
  }

  .or-divider {
    display: flex;
    align-items: center;
    text-align: center;
    width: 100%;
    margin: 15px 0;
  }

  .or-divider::before,
  .or-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--text-color);
  }

  .or-divider span {
    padding: 0 10px;
  }

  .modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: var(--modal-background);
  }

  .modal-content {
    background-color: var(--secondary-background);
    margin: 10% auto;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 500px;
  }

  .close {
    color: var(--text-color);
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }

  .close:hover,
  .close:focus {
    color: var(--primary-color);
    text-decoration: none;
    cursor: pointer;
  }

  .modal-header {
    padding: 10px 0;
    border-bottom: 1px solid var(--text-color);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-header-left {
    display: flex;
    align-items: center;
  }

  .modal-logo {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }

  .modal-body {
    padding: 10px 0;
  }

  .modal-footer {
    padding: 10px 0;
    border-top: 1px solid var(--text-color);
    margin-top: 20px;
    text-align: right;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
  }

  .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--link-color);
    border-radius: 4px;
    background-color: var(--background-color);
    color: var(--text-color);
  }

  .auth-iframe {
    width: 100%;
    height: 400px;
    border: none;
  }

  /* Dashboard styles */
  .dashboard {
    display: none;
    flex-direction: column;
    height: 100vh;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: var(--secondary-background);
    height: var(--nav-height);
  }

  .top-bar .logo {
    width: 40px;
    height: 40px;
  }

  .menu-toggle {
    font-size: 24px;
    cursor: pointer;
    color: var(--text-color);
  }

  .side-nav {
    position: fixed;
    top: 0;
    left: -250px;
    width: 250px;
    height: 100%;
    background-color: var(--secondary-background);
    transition: left 0.3s ease-in-out;
    z-index: 1000;
  }

  .side-nav.open {
    left: 0;
  }

  .side-nav-content {
    padding: 20px;
  }

  .side-nav-content a {
    display: block;
    color: var(--text-color);
    text-decoration: none;
    padding: 10px 0;
    font-size: 18px;
  }

  .dashboard-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }

  .bottom-nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: var(--secondary-background);
    height: var(--nav-height);
  }

  .bottom-nav a {
    color: var(--text-color);
    text-decoration: none;
    font-size: 24px;
  }

  
  @media (max-width: 1024px) {
    .main-content {
      flex-direction: column;
    }

    .left-side, .right-side {
      width: 100%;
      
    }

    .logo-container {
      position: absolute;
      top: 20px;
      left: 20px;
      margin-bottom: 0;
    }

    .logo {
      width: 60px;
      height: 60px;
      margin-bottom: 0;
    }

    .logo-text {
      display: none;
    }

    .left-side {
      padding-top: 20px;
    }

    .modal-content {
      margin: 15% auto;
      width: 90%;
    }
    .button {
    width: 80%; /* Adjust width for medium screens */
    max-width: none; /* Remove max-width constraint */
    }
  }

  @media (max-width: 768px) {
    .motto {
      font-size: 42px;
    }

    .button {
      font-size: 14px;
      padding: 10px 20px;
      width: 90%; /* Adjust width for small screens */
      max-width: none; /* Remove max-width constraint */
    }

    .footer-links {
      gap: 10px;
    }

    .footer-links a {
      font-size: 12px;
    }

    .modal-content {
      margin: 20% auto;
    }
  }

  @media (max-width: 480px) {
    .logo {
      width: 50px;
      height: 50px;
      
    }
    .left-side {
   max-height: 250px;
  }
 

    .motto {
      font-size: 30px;
    
      margin-top: -200px;
      margin-right: 20px;
   
    }

    .button {
     
      font-size: 12px;
      padding: 8px 16px;
      width: 80%; /* Adjust width for small screens */
    max-width: none; /* Remove max-width constraint */
 
    }

    .footer-links a {
      font-size: 10px;
    }

    .modal-content {
      margin: 25% auto;
      width: 95%;
    }
  }
</style>
  