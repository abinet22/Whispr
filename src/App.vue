<template>
  <div id="app">
    <router-view></router-view> <!-- Renders the matched component based on the route -->
  </div>
</template>

<script>

import io from 'socket.io-client';

export default {
  name: 'App',
  setup() {
    const socket = io('http://localhost:5000'); // Update with your server URL

    // Example of handling connection and events globally
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Handle global socket events or emit messages here
  }
};
</script>



<style>
:root {
    --primary-color: #ff5a5f;
    --background-color: #1e213a;
    --secondary-background: #2c2f4a;
    --text-color: #ffffff;
    --link-color: #a0a0a0;
    --modal-background: rgba(30, 33, 58, 0.95);
    --nav-height: 60px;
     --chat-background: #3a3d5a;

          --post-background: #3a3d5a;
          --tab-active: #ff5a5f;
          --message-sent: #4caf50;
          --message-received: #2196f3;
  }

  body {
    background-color: var(--background-color);
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    flex-direction: column;
    height: 100vh; /* Full viewport height */
  
    color: var(--text-color);
  }

</style>
