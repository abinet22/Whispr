<template>
  <div class="splash-container">
    <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:#ff5a5f;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ff8082;stop-opacity:1" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#grad)" />
      <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="#ffffff">
        <animate attributeName="d" 
                 values="M30 50 Q50 30 70 50 Q50 70 30 50;
                         M30 50 Q50 40 70 50 Q50 60 30 50;
                         M30 50 Q50 30 70 50 Q50 70 30 50" 
                 dur="3s" 
                 repeatCount="indefinite" />
      </path>
    </svg>
    <h1>Whispr</h1>
    <p>Connect quietly, speak freely</p>
    <div class="progress-bar">
      <div class="progress"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SplashScreen',
  mounted() {
    const progress = this.$el.querySelector('.progress');
    
    // Start the progress animation
    setTimeout(() => {
      progress.style.width = '100%';
    }, 100);

    // Redirect after 4 seconds
    setTimeout(() => {
      this.$router.push({ path: '/home' });
    }, 4000);
  }
}
</script>


<style scoped>

  .splash-container {
    text-align: center;
    color: #ffffff;
    margin: 0;
    padding: 0;
    height: 100%;
    margin-top: 100px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #1e213a;
   
  }
  .logo {
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
  }
  h1 {
    font-size: 48px;
    margin: 0;
    color: #ff5a5f;
  }
  p {
    font-size: 18px;
    margin: 10px 0 30px;
    opacity: 0.8;
  }
  .progress-bar {
    width: 200px;
    height: 4px;
    background-color: #2c2f4a;
    border-radius: 2px;
    overflow: hidden;
    margin: 20px auto;
  }
  .progress {
    width: 0%;
    height: 100%;
    background-color: #ff5a5f;
    transition: width 4s linear;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  .splash-container > * {
    animation: fadeIn 1.5s ease-out;
  }
  .logo {
    animation: float 3s ease-in-out infinite;
  }
</style>
