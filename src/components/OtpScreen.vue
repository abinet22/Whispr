<template>
    <div class="otp-input">
      <label for="otp" class="sr-only">Enter OTP:</label>
      <input
        v-for="(digit, index) in digits"
        :key="index"
        v-model="digits[index]"
        :ref="el => { refs[index] = el }"
        type="text"
        inputmode="numeric"
        maxlength="1"
        :aria-label="`OTP Digit ${index + 1}`"
        @input="handleInput"
        @keydown="handleKeydown"
      >
    </div>
  </template>
  
  <script>
  export default {
    props: {
      numDigits: {
        type: Number,
        default: 4
      }
    },
    data() {
      return {
        digits: [],
        refs: []
      };
    },
    created() {
      this.digits = Array(this.numDigits).fill('');
    },
    methods: {
      handleInput(event) {
        const input = event.target;
        const index = this.refs.indexOf(input);
  
        if (input.value.length === 1) {
          this.focusNextInput(index);
        }
      },
      handleKeydown(event) {
        const input = event.target;
        const index = this.refs.indexOf(input);
  
        if (event.key === 'Backspace' && input.value.length === 0) {
          this.focusPrevInput(index);
        } else if (event.key === 'ArrowLeft') {
          this.focusPrevInput(index);
        } else if (event.key === 'ArrowRight') {
          this.focusNextInput(index); 
        } else if (!/^[0-9]$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        // Prevent non-numeric input
        event.preventDefault();
      }
      },
      focusNextInput(index) {
        if (index < this.digits.length - 1) {
          this.refs[index + 1].focus();
        } else {
          this.$emit('complete', this.digits.join(''));
        }
      },
      focusPrevInput(index) {
        if (index > 0) {
          this.refs[index - 1].focus();
        }  
      }
    }
  };
  </script>
  
  <style scoped>
  .sr-only {
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
  
  .otp-input {
    display: flex;
  }
  
  input {
    width: 4rem; 
    height: 4rem;
    text-align: center;
    background-color: var(--background-color);
    color: var(--text-color);
    font-size: 1.5rem;
    border: 2px solid #ccc;
    border-radius: 4px;
    margin-right: 0.5rem;
    margin-left: 5px;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }  
  }
  
  input:focus {
    outline: none;
    border-color: var(--primary-color);
    animation: pulse 0.3s ease-in-out;
  }
  </style>