<template>
    <div >
      <div class="main-content">
        
        <div class="left-side">
          <div class="logo-container">
            <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#ff5a5f" stroke-width="5">
                <animate attributeName="r" values="45;47;45" dur="2s" repeatCount="indefinite" />
              </circle>
              <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="#ff5a5f">
                <animate attributeName="d" values="M30 50 Q50 30 70 50 Q50 70 30 50;M30 50 Q50 40 70 50 Q50 60 30 50;M30 50 Q50 30 70 50 Q50 70 30 50" dur="2s" repeatCount="indefinite" />
              </path>
            </svg>
            <span class="logo-text">Whispr</span>
          </div>
          <a href="/AnonymousChat" class="button" >
            <i class="fas fa-comment-alt"></i> Start Whispering
          </a>
        </div>
        
        <div class="right-side">
         
          <h1 class="motto">Connect through <br>whispers</h1>
          <div class="join-options">
          
          
            <button class="button" @click="openModal('googleAuthModal')">
              <i class="fab fa-google"></i> Sign up with Google
            </button>
          
          
          </div>
          <div class="or-divider">
              <span>or</span>
            </div>
          
         
          
            <button class="button" @click="openModal('phoneAuthModal')">
              Create Account
            </button>
          <a class="login-link" >Already have an account? </a>
          <button class="buttonlogin" @click="openModal('loginModal')">
               Sign in
            </button>
        </div>
      </div>
      <div class="footer-links">
        <a href="/about">About</a>
        <a href="/download">Download the Whispr app</a>
        <a href="/help">Help Center</a>
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/cookies">Cookie Policy</a>
        <a href="#">© 2023 Whispr, Inc.</a>
       
      </div>
 
      <RegisterModal v-if="modals.registerModal" @close="closeModal('registerModal')" />
    <LoginModal v-if="modals.loginModal" @close="closeModal('loginModal')" />
    <PhoneAuthModal v-if="modals.phoneAuthModal" @close="closeModal('phoneAuthModal')" />
    <TelegramAuthModal v-if="modals.telegramAuthModal" @close="closeModal('telegramAuthModal')" />
    <GoogleAuthModal v-if="modals.googleAuthModal" @close="closeModal('googleAuthModal')" />
   
     
    </div>
  </template>
  <script>
  import { reactive } from 'vue';
  import RegisterModal from './RegisterModal.vue';
  import LoginModal from './LoginModal.vue';
  import PhoneAuthModal from './PhoneAuthModal.vue';
  import TelegramAuthModal from './TelegramAuthModal.vue';
  import GoogleAuthModal from './GoogleAuthModal.vue';
 
  export default {
  components: {
    RegisterModal,
    LoginModal,
    PhoneAuthModal,
    TelegramAuthModal,
    GoogleAuthModal,
   
  },
  setup() {
    const modals = reactive({
      registerModal: false,
      loginModal: false,
      phoneAuthModal: false,
      telegramAuthModal: false,
      googleAuthModal: false,
    
    });

    const openModal = (modalName) => {
      console.log(`Opening ${modalName}`);
      modals[modalName] = true;
    };

    const closeModal = (modalName) => {
      console.log(`Opening ${modalName}`);
      modals[modalName] = false;
    };

    return {
      modals,
      openModal,
      closeModal
    };
  }};
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
    width: 100vh;
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
  .buttonlogin {
    background-color: transparent;
    color: var(--text-color);
    border: solid black;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 25px;
    border-color:var(--primary-color);
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
  .buttonlogin:hover {
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
    width: 40%;
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