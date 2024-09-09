<template>
  <div id="loginModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-header-left">
          <svg class="modal-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#ff5a5f" stroke-width="5" />
            <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="#ff5a5f" />
          </svg>
          <h2>Log In</h2>
        </div>
        <span class="close" @click="$emit('close')">&times;</span>
      </div>
      <div class="modal-body">
        <form id="phoneAuthForm" @submit.prevent="submitForm">
            <div v-if="!otpSent">
              <div class="form-group">
               
                <label for="phoneNumber">Phone Number:</label>
                <input type="tel" id="phoneNumber" v-model="form.phoneNumber" required />
              
              </div>
              <button type="submit" class="button">Submit</button>
            </div>
            <div v-if="otpSent">
              <div class="form-groups">
                <label for="otp">Enter OTP:</label>
                <otp-input :num-digits="6" @complete="handleComplete" />
    
              </div>
              <button type="submit" @click="verifyOtp" class="button ">Verify OTP</button>
            </div>
          </form>
      </div>
      <div class="modal-footer">
            <AlertMessage 
  v-show="showAlert" 
  :type="alertType" 
  :message="errorMessage" 
  :duration="alertDuration"
/>
        </div>
    </div>
  </div>
</template>

<script>
 import AlertMessage from './Alert.vue';
  import axios from 'axios';
  import OtpInput from './OtpScreen.vue';
 
export default {
  components: {
      AlertMessage,
      OtpInput
    },
  data() {
    return {
      
      form: {
         
          phoneNumber: '',
          otp: ''
        },
        user: null,
        sessionToken: null,
        otpSent: false,
        errorMessage: '',
        showAlert: false,
        alertType: 'info',
        alertDuration: 3000,
        otpDigits: Array(6).fill(''), // Array to store OTP digits
    };
  },
  mounted() {
        // Retrieve user and session token from localStorage when component mounts
        this.user = JSON.parse(localStorage.getItem('user'));
        this.sessionToken = localStorage.getItem('sessionToken');

        if (this.user) {
            console.log('User:', this.user);
        }

        if (this.sessionToken) {
            console.log('Session Token:', this.sessionToken);
        }
    },
  methods: {
    handleComplete(value) {
            this.form.otp = value; // Bind completed OTP to form
        },
      async submitForm() {
        try {
          const response = await axios.post('http://localhost:5000/api/users/login/phone', {
            phoneNumber: this.form.phoneNumber,
                     });
          console.log(response.status)
          console.log(response)
          if (response.data.success) {
            this.otpSent = true;
            this.triggerAlert('OTP sent successfully', 30000);
            this.alertType = 'success';
          } else {
            this.triggerAlert(response.data.error || 'Error occurred', 30000);
            this.alertType = 'error';
          }
        } catch (error) {
          this.triggerAlert('Network error occurred', 30000);
          this.alertType = 'error';
        }
      },
      triggerAlert(message, duration = 30000) {
        this.errorMessage = message;
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, duration);
      },
    
      async verifyOtp() {
      try {
        const response = await axios.post('http://localhost:5000/api/users/verify-otp', {
          phoneNumber: this.form.phoneNumber,
          otp: this.form.otp,
        },{ withCredentials: true });

        if (response.data.success) {
          // Assuming response contains user data and session token
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('sessionToken', response.data.token);
          this.$router.push('/dashboard'); // Redirect to dashboard
          // Optionally store user data and session information
     
        } else {
          this.triggerAlert(response.data.error || 'Invalid OTP', 30000);
          this.alertType = 'error';
        }
      } catch (error) {
        console.log(error)
        this.triggerAlert('Network error occurred', 30000);
        this.alertType = 'error';
      }
    }
  }
};
</script>


  
 <style scoped>

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
    margin-right: 15px;
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
      width: 70%; /* Adjust width for small screens */
    max-width: none; /* Remove max-width constraint */
      align-self: right;
    }

    .footer-links a {
      font-size: 10px;
    }

    .modal-content {
      margin: 15% auto;
      width: 70%;

    }
  
  }
</style>