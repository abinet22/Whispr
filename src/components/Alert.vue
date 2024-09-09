<template>
  <div v-if="visible" class="alert-container">
    <div :class="['alert', alertTypeClass]">
      <svg class="alert-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path :d="iconPath"/>
      </svg>
      <div class="alert-message">
        <p>{{ internalMessage }}</p>
      </div>
    
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertMessage',
  props: {
    type: {
      type: String,
      default: 'info'
    },
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 30000
    }
  },
  data() {
    return {
      visible: false,
      internalMessage: '',
      iconPath: '',
    };
  },
  computed: {
    alertTypeClass() {
      return {
        'alert-success': this.type === 'success',
        'alert-error': this.type === 'error',
        'alert-warning': this.type === 'warning',
        'alert-info': this.type === 'info',
      };
    }
  },
  watch: {
    message(newMessage) {
      if (newMessage) {
        this.internalMessage = newMessage;
        this.visible = true;
        setTimeout(() => {
          this.visible = false;
        }, this.duration);
      }
    },
    type(newType) {
      this.setIconPath(newType);
    }
  },
  methods: {
    closeAlert() {
      this.visible = false;
    },
    setIconPath(type) {
      const iconPaths = {
        success: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM8.293 11.293a1 1 0 0 1 1.414 0L12 12.586l2.293-2.293a1 1 0 0 1 1.414 1.414L12 14.414 8.293 10.707a1 1 0 0 1 0-1.414z',
        error: 'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z',
        warning: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM9.293 6.293a1 1 0 0 1 1.414 0L12 7.586l2.293-2.293a1 1 0 0 1 1.414 1.414L13.414 9l2.293 2.293a1 1 0 0 1-1.414 1.414L12 10.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L10.586 9 8.293 6.707a1 1 0 0 1 0-1.414z',
        info: 'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z'
      };
      this.iconPath = iconPaths[type] || iconPaths.info;
    }
  },
  mounted() {
    this.setIconPath(this.type); 
    this.internalMessage = this.message; 
  }
};
</script>
<style scoped>
.alert-container {
  position: relative;

}

.alert {
  padding: 2px; /* Adjust padding for the 30px height */
  border-radius: 4px;
  margin-bottom: 15px;
  position: relative;
  background-color: #f8d7da; /* Default color */
  color: #721c24; /* Default text color */
  max-width: 600px; /* Limit width */
  height: auto; /* Allow height to grow with content */
  line-height: 1.2; /* Improve readability */
}

.alert-success {
  background-color: #dff0d8;
  color: #3c763d;
}

.alert-error {
  background-color: #f2dede;
  color: #a94442;
}

.alert-warning {
  background-color: #fcf8e3;
  color: #8a6d3b;
}

.alert-info {
  background-color: #d9edf7;
  color: #31708f;
}

.alert-icon {
  position: absolute;
  left: 10px; /* Adjust for smaller height */
  top: 50%;
  transform: translateY(-50%);
  width: 16px; /* Smaller icon size */
  height: 16px; /* Smaller icon size */
}

.alert-message {
 
  font-size: 14px; /* Text size for readability */
}


/* Responsive Design */
@media (max-width: 600px) {
  .alert {
    max-width: 100%; /* Allow full width on smaller screens */
    padding: 8px; /* Adjust padding for smaller screens */
  }

  .alert-icon {
    width: 14px; /* Smaller icon for smaller screens */
    height: 14px; /* Smaller icon for smaller screens */
  }

  .alert-message {
    font-size: 12px; /* Smaller text for smaller screens */
  }

 
}

</style>