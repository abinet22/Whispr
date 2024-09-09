<template>
  <div class="chat-wrapper">
    <div class="top-bar">
      <i class="fas fa-arrow-left back-button" @click="goBack"></i>
      <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#ff5a5f" stroke-width="5" />
        <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="#ff5a5f" />
      </svg>
      <button class="filter-button" @click="openFilterModal"><i class="fas fa-filter"></i></button>
    </div>
    
    <div class="chat-container" ref="chatContainer">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="chat-message"
        :style="messageStyles(msg.type)"
      >
        {{ msg.text }}
      </div>
    </div>
    <div class="connected-users">
      <h5>Online: <span class="user-count">{{ userCount }}</span></h5>
    
    </div>
    <div class="chat-input">
      <input type="text" v-model="message" @keypress.enter="sendMessage" placeholder="Type your message...">
      <button @click="sendMessage"><i class="fas fa-paper-plane"></i></button>
    </div>

    <div v-if="isFilterModalOpen" class="modal" @click="closeFilterModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeFilterModal">&times;</span>
        <h2>Filter Options</h2>
        <div class="filter-option">
          <label for="location">Location:</label>
          <input type="text" v-model="locationInput" @input="onLocationInput" placeholder="Enter location">
          <ul v-if="locationSuggestions.length" id="locationSuggestions">
            <li v-for="suggestion in locationSuggestions" :key="suggestion.id" @click="selectLocation(suggestion)">
              {{ suggestion.place_name }}
            </li>
          </ul>
        </div>
        <div class="filter-option">
          <label for="gender">Gender:</label>
          <select v-model="selectedGender">
            <option value="">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button class="apply-filter" @click="applyFilter">Apply Filter</button>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import io from 'socket.io-client';
import { useRouter } from 'vue-router';

import '@fortawesome/fontawesome-free/css/all.min.css';

const router = useRouter();
const socket = io('http://localhost:5000'); // Update with your server URL
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique ID
const accessToken = 'pk.eyJ1IjoiYWJpbmV0MTIzIiwiYSI6ImNrbWR3d3Y5NzJwbG8ycGp4bGU1bXBtaGsifQ.LIZpH0mev90pUGXewX6lww';
const messages = ref([]);
const chatContainer = ref(null);
const message = ref('');
const locationInput = ref('');
const locationSuggestions = ref([]);
const selectedLocation = ref('');
const selectedGender = ref('');
const isFilterModalOpen = ref(false);

const connected = ref(false);
const userid = uuidv4(); // Generate a unique user ID,
const user = ref({
  id: userid, // Generate a unique user ID,
  location: null,
  gender: ''
});
const userCount = ref(0);
socket.on('updateUserCount', (count) => {
  userCount.value = count;
});
// Setup socket event listeners
socket.on('message', (msg) => {
  console.log(`Received message: ${msg.text} of type: ${msg.type}`); // Debug log
  appendMessage(msg.text, msg.type, msg.id);
});
const messageStyles = computed(() => {
    return (type) => ({
      maxWidth: '70%',
      padding: '10px 15px',
      marginBottom: '15px',
      borderRadius: '20px',
      lineHeight: '1.4',
      alignSelf: type === 'sent' ? 'flex-end' : 'flex-start',
      color: 'var(--text-color)',
      backgroundColor: type === 'sent' ? 'var(--primary-color)' : 'var(--chat-background)',
    });
  });


function goBack() {
  router.push('/home');
}

function sendMessage() {
  const msg = message.value.trim();
  if (msg) {
    const messageData = {
      text: msg,
      type: 'sent',
      id: uuidv4(), // Unique ID for each message
      senderId: userid // Include sender ID to track the sender
    };
    appendMessage(msg, 'sent',messageData.id);
  
    console.log(`Sending message: ${msg}`); // Debug log
    socket.emit('sendMessage', messageData);
    message.value = '';
   
  }
}

function appendMessage(message, type,id) {
  const isDuplicate = messages.value.some(msg => msg.text === message && msg.type === type && msg.id === id);
  if (isDuplicate) {
    console.log(`Duplicate message detected: ${message}`); // Debug log
    return;
  }
  console.log(`Appending message: ${message} with type: ${type}`); // Debug log
  messages.value.push({ text: message, type: type ,id:id});
  console.log('Current messages:', messages.value); // Log the entire messages array

  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

function openFilterModal() {
  isFilterModalOpen.value = true;
}

function closeFilterModal() {
  isFilterModalOpen.value = false;
}

function applyFilter() {
  const locationToSend = selectedLocation.value || user.value.location;
  // Update user object with filter data
  socket.emit('join', {
    id: userid,// Replace with dynamic user ID
    gender: selectedGender.value,
    location: locationToSend,
  });
  closeFilterModal();
}

function onLocationInput() {
  if (locationInput.value) {
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationInput.value)}.json?access_token=${accessToken}`)
      .then(response => response.json())
      .then(data => {
        locationSuggestions.value = data.features.map(feature => ({
          id: feature.id,
          place_name: feature.place_name,
          value: `${feature.center[1]},${feature.center[0]}` // lat,lon
        }));
      })
      .catch(error => {
        console.error('Error fetching location suggestions:', error);
      });
  } else {
    locationSuggestions.value = [];
  }
}

function selectLocation(suggestion) {
  locationInput.value = suggestion.place_name;
  selectedLocation.value = suggestion.value; // Set selectedLocation to the value (lat,lon)
  locationSuggestions.value = []; // Clear suggestions
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      user.value.location = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };
      socket.emit('join', user.value); // Send initial user data to server
    }, (error) => {
      console.error('Error getting location:', error);
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}

onMounted(() => {
  nextTick(() => {
    appendMessage("Welcome to the anonymous chat! Feel free to share your thoughts freely.", 'received');
    appendMessage("Remember, while this chat is anonymous, please be respectful and kind to others.", 'received');
    appendMessage("You can use the filter button in the top right to find chat partners based on location and gender.", 'received');
    socket.on('connect', () => {
    connected.value = true;
    console.log('Connected to server');
  });
  
    getCurrentLocation();
  });

});
</script>

<style scoped>
/* General styles for layout and appearance */
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

.back-button {
  font-size: 24px;
  cursor: pointer;
  color: var(--text-color);
}
.connected-users {
  margin-bottom: -22px;
}

.user-count {
  color: green;
  font-weight: bold;
}

.filter-button {
  font-size: 20px;
  cursor: pointer;
  color: var(--text-color);
  background: none;
  border: none;
  padding: 5px 10px;
}

.chat-wrapper {
  display: flex;
  flex-direction: column;
  
  height: 100vh; /* Full viewport height */
}

.chat-container {
  flex: 1; /* Fills remaining space above the input */
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;

}

.chat-input {
  display: flex;
  padding: 10px;
  background-color: var(--secondary-background);
}
#geocoder {
      z-index: 1;
      margin: 20px;
  }
  .mapboxgl-ctrl-geocoder {
      min-width: 100%;
  }
.chat-input input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 20px;
  background-color: var(--chat-background);
  color: var(--text-color);
}

.chat-input button {
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}






.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: var(--secondary-background);
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  border-radius: 10px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #fff;
  text-decoration: none;
}

.filter-option {
  margin-bottom: 20px;
}

.filter-option label {
  display: block;
  margin-bottom: 5px;
}

.filter-option select,
.filter-option input[type="text"] {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 5px;
  background-color: var(--chat-background);
  color: var(--text-color);
}

.apply-filter {
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}
select {
width: 100%;
padding: 8px;
border: none;
border-radius: 5px;
background-color: var(--chat-background);
color: var(--text-color);
}
#locationSuggestions {
  list-style-type: none;
  padding: 0;
  margin: 0;
  background-color: var(--chat-background);
  border-radius: 0 0 5px 5px;
}

#locationSuggestions li {
  padding: 10px;
  cursor: pointer;
}

#locationSuggestions li:hover {
  background-color: var(--secondary-background);
}

@media (max-width: 768px) {
  .chat-message {
    max-width: 85%;
  }
}
</style>


