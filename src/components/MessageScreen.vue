<template>
  <div class="chat-container">
    <div class="top-bar">
      <i class="fas fa-arrow-left back-button" @click="goBack"></i>
      <div class="user-info">
        <img :src="userAvatar" alt="User Avatar" class="user-avatar">
        <span class="user-name">{{ userName }}</span>
      </div>
    </div>

    <div class="chat-messages" ref="chatMessages">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="chat-message"
        :style="messageStyles(msg.type)"
        v-html="msg.content"
      ></div>
    </div>
   
    <div class="input-area">
      <div class="input-group">
        <button class="attach-icon" @click="showAttachmentOptions = !showAttachmentOptions">
          <i class="fas fa-paperclip"></i>
        </button>
        <input type="text" v-model="messageText" placeholder="Type your message here..." @input="handleInput">
        <button v-if="isRecording" class="record-icon" @click="stopRecording">
          <i class="fas fa-stop"></i>
        </button>
        <button v-if="messageText.trim() && !isRecording" class="send-icon" @click="sendMessage">
          <i class="fas fa-paper-plane"></i>
        </button>
        <button v-if="!isRecording && !messageText.trim()" class="record-icon" @click="startRecording">
          <i class="fas fa-microphone"></i>
        </button>
      </div>
      
      <!-- Attachment options modal -->
      <div v-if="showAttachmentOptions" class="attachment-options-modal" @click="hideAttachmentOptions">
        <div class="attachment-options-content" @click.stop>
          <ul class="attachment-options-list">
            <li @click="attachImage">
              <i class="fas fa-image"></i>
              <span>Image</span>
            </li>
            <li @click="attachLocation">
              <i class="fas fa-map-marker-alt"></i>
              <span>Location</span>
            </li>
            <li @click="attachFile">
              <i class="fas fa-file"></i>
              <span>File</span>
            </li>
            <li @click="attachVideo">
              <i class="fas fa-video"></i>
              <span>Video</span>
            </li>
            <li @click="startRecording">
              <i class="fas fa-microphone"></i>
              <span>Voice</span>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="showMap" class="map-modal">
        <div id="map" ref="mapContainer"></div>
        <button @click="shareCurrentLocation" class="button">Send Location</button>
      </div>

      <div v-if="isRecording" class="recording-ui">
        <span class="recording-time">{{ recordingTime }}</span>
        <button @click="cancelRecording">Cancel</button>
        <button @click="stopRecording">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import mapboxgl from 'mapbox-gl';
import { useStore } from 'vuex';
const userName = ref('');
const userAvatar = ref('');
const messageText = ref('');
const attachments = ref([]);
const messages = ref([]);
const showAttachmentOptions = ref(false);
const showMap = ref(false);
const isRecording = ref(false);
const recordingTime = ref('00:00');
let mediaRecorder = null;
let audioChunks = [];
let recordingInterval = null;
let map = null;
let marker = null;

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJpbmV0MTIzIiwiYSI6ImNrbWR3d3Y5NzJwbG8ycGp4bGU1bXBtaGsifQ.LIZpH0mev90pUGXewX6lww';

const chatMessages = ref(null);
const mapContainer = ref(null);
const store = useStore();

// Get user from Vuex store
const user = computed(() => store.getters.user);
const goBack = () => {
  window.history.back();
};

const messageStyles = computed(() => {
  return (type) => ({
    maxWidth: '70%',
    padding: '10px 15px',
    marginBottom: '15px',
    borderRadius: '20px',
    lineHeight: '1.4',
    alignSelf: type === 'sent' ? 'flex-end' : 'flex-start',
    color: 'var(--text-color)',
    backgroundColor: type === 'sent' ? 'var(--message-sent)' : 'var(--message-received)',
  });
});

const appendMessage = (text, type) => {
  messages.value.push({ content: text, type: type });
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
    }
  });
};

const handleInput = () => {
  if (messageText.value.trim() !== '') {
    document.querySelector('.send-icon').classList.add('active');
  } else {
    document.querySelector('.send-icon').classList.remove('active');
  }
};

const attachImage = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      attachments.value.push({ type: 'image', content: event.target.result });
      sendMessage();  // Directly send the image
    };
    reader.readAsDataURL(file);
  };
  input.click();
};

const attachLocation = async () => {
  showMap.value = true;
  showAttachmentOptions.value = false;

  await nextTick();  // Wait until the DOM is updated

  if (!map && mapContainer.value) {
    map = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2
    });

    map.on('click', e => {
      setMarker(e.lngLat);
    });
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setTimeout(() => {
        map.flyTo({
          center: [lon, lat],
          zoom: 18,
          essential: true   
        });
        setMarker([lon, lat]);
      }, 1000);
    });
  }
};
onMounted(() => {
  if (!user.value) {
    store.dispatch('fetchUser');
  }
});

const setMarker = lngLat => {
  if (marker) {
    marker.remove();
  }
  marker = new mapboxgl.Marker().setLngLat(lngLat).addTo(map);
};

const captureMapImage = async () => {
  return new Promise((resolve) => {
    map.once('render', () => {
      const canvas = map.getCanvas();
      const imgData = canvas.toDataURL('image/png');
      
      cropImage(imgData, canvas.width, canvas.height).then(croppedImg => {
        resolve(croppedImg);
      });
    });
  });
};

const cropImage = (imgData, width, height) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imgData;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const cropWidth = 400;
      const cropHeight = 300;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const offsetX = (width - cropWidth) / 2;
      const offsetY = (height - cropHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      const croppedImgData = canvas.toDataURL('image/png');
      resolve(croppedImgData);
    };
  });
};

const shareCurrentLocation = async () => {
  if (marker) {
    const { lng, lat } = marker.getLngLat();

    const mapImage = await captureMapImage();

    attachments.value.push({ type: 'image', content: mapImage });
    attachments.value.push({ type: 'location', content: { lat, lon: lng } });

    sendMessage();
  } else {
    alert("Please select a location on the map.");
  }
};

const attachFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = e => {
    const file = e.target.files[0];
    attachments.value.push({ type: 'file', content: file.name });
    sendMessage();  // Directly send the file
  };
  input.click();
};

const attachVideo = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/*';
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      attachments.value.push({ type: 'video', content: event.target.result });
      sendMessage();  // Directly send the video
    };
    reader.readAsDataURL(file);
  };
  input.click();
};

const startRecording = () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      isRecording.value = true;
      showAttachmentOptions.value = false;
      messageText.value = '';

      let seconds = 0;
      recordingInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        recordingTime.value = 
          `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      }, 1000);
    });
};

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    clearInterval(recordingInterval);
    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      attachments.value.push({ type: 'audio', content: audioUrl });
      sendMessage();
      isRecording.value = false;
      recordingTime.value = '00:00';
    });
  }
};

const cancelRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
  isRecording.value = false;
  recordingTime.value = '00:00';
  clearInterval(recordingInterval);
};

const sendMessage = () => {
  if (messageText.value.trim() !== '' || attachments.value.length > 0) {
    let messageContent = messageText.value;

    attachments.value.forEach(attachment => {
      switch(attachment.type) {
        case 'image':
          messageContent += `<br><img src="${attachment.content}" alt="Image attachment" style="max-width: 200px; max-height: 200px;">`;
          break;
        case 'video':
          messageContent += `<br><video controls style="max-width: 200px; max-height: 200px;"><source src="${attachment.content}" type="video/mp4"></video>`;
          break;
        case 'file':
          messageContent += `<br><a href="#" class="file-link">${attachment.content}</a>`;
          break;
        case 'location':
          messageContent += `<br><a href="${attachments.value.find(att => att.type === 'image').content}" target="_blank">View Location</a>`;
          break;
        case 'audio':
          messageContent += `<br><audio controls><source src="${attachment.content}" type="audio/wav"></audio>`;
          break;
      }
    });

    appendMessage(messageContent, 'sent');

    messageText.value = '';
    attachments.value = [];
    showAttachmentOptions.value = false;
    showMap.value = false;
  }
};

const hideAttachmentOptions = () => {
  showAttachmentOptions.value = false;
  showMap.value = false;
};

onMounted(() => {
  // Initialization or additional setup if needed
});
</script>


<style scoped>

.map-modal {
  position: fixed;
  bottom: 60px;
  left: 0;
  width: 100%;
  max-width: 400px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 8px;
  z-index: 1000;
}

#map {
  width: 100%;
  height: 100%;
}

.recording-ui {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.recording-time {
  flex: 1;
}

.file-link {
  display: block;
  margin-top: 5px;
  color: #007bff;
  text-decoration: none;
}

.file-link:hover {
  text-decoration: underline;
}



</style>

  
  <style scoped>
      .input-group {
  display: flex;
  align-items: center;
}

.attach-icon,
.record-icon,
.send-icon {
  background: none;
  border: none;
  cursor: pointer;
}

.input-group input {
  flex: 1;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  padding: 5px;
  margin: 0 5px;
}



.input-group .send-icon {
  display: none; /* Hide send icon by default */
}

.input-group .attach-icon {
  margin-right: 5px;
}

.record-icon.active {
  display: inline-block;
}

.send-icon.active {
  display: inline-block;
}

/* Modal styles */
.attachment-options-modal {
  position: fixed;
  bottom: 60px; /* Adjust based on the height of your input group */
  left: 0;
  width: 200px; /* Adjust as needed */
  z-index: 1000;
  background:  #2c2f4a;
  display: flex;
  justify-content: flex-end;
}

.attachment-options-content {
  background:  #2c2f4a;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 250px;
}

.attachment-options-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.attachment-options-list li {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.attachment-options-list li:hover {
  background:#1e213a;
}

.attachment-options-list i {
  margin-right: 10px;
}

      .chat-container {
        display: flex;
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
    
      .top-bar .back-button {
        font-size: 24px;
        cursor: pointer;
        color: var(--text-color);
      }
    
      .top-bar .user-info {
        display: flex;
        align-items: center;
      }
    
      .top-bar .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
    
      .top-bar .user-name {
        font-size: 18px;
        font-weight: bold;
      }
    
      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
      }
    
      .message {
        max-width: 70%;
        margin-bottom: 15px;
        padding: 10px 15px;
        border-radius: 20px;
        word-wrap: break-word;
      }
    
      .message-sent {
        align-self: flex-end;
        background-color: var(--message-sent);
      }
    
      .message-received {
        align-self: flex-start;
        background-color: var(--message-received);
      }
    
      .message-time {
        font-size: 12px;
        color: var(--link-color);
        margin-top: 5px;
        text-align: right;
      }
    
      .input-area {
        display: flex;
        flex-direction: column;
        background-color: var(--secondary-background);
      }
    
      .input-group {
        display: flex;
        align-items: center;
        background-color: var(--post-background);
        border-radius: 25px;
        padding: 5px 15px;
        margin: 10px;
      }
    
      .input-group input {
        flex: 1;
        background: none;
        border: none;
        color: var(--text-color);
        padding: 10px;
        font-size: 16px;
      }
    
      .input-group input:focus {
        outline: none;
      }
    
      .input-group button {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 20px;
        cursor: pointer;
        padding: 5px;
      }
    
      .attachment-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 10px;
        padding: 10px;
        background-color: var(--post-background);
        border-radius: 10px;
      }
    
      .attachment-preview img, 
      .attachment-preview video {
        max-width: 100px;
        max-height: 100px;
        object-fit: cover;
        border-radius: 5px;
      }
    
      .attachment-preview audio {
        width: 100%;
      }
    
      .attachment-preview .location {
        background-color: var(--secondary-background);
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 14px;
      }
    
      #mapContainer {
        height: 300px;
        width: 100%;
        margin-top: 10px;
      }
    
      #map {
        height: 100%;
        width: 100%;
        border-radius: 10px;
      }
    
      #shareCurrentLocationBtn {
        width: calc(100% - 20px);
        padding: 10px;
        background-color: var(--primary-color);
        color: var(--text-color);
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin: 10px;
      }
    
      .attachment-options {
        display: flex;
        justify-content: space-around;
        padding: 10px;
        background-color: var(--secondary-background);
      }
    
    
    
      
    
      .recording-ui {
        display: none;
        align-items: center;
        justify-content: space-between;
        background-color: var(--post-background);
        border-radius: 25px;
        padding: 10px 15px;
        margin: 10px;
      }
    
      .recording-time {
        color: var(--primary-color);
        font-weight: bold;
      }
    
      .recording-ui button {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 16px;
        cursor: pointer;
        padding: 5px 10px;
      }
    
      @media (max-width: 768px) {
        .message {
          max-width: 85%;
        }
        
        .attachment-options {
          flex-wrap: wrap;
        }
        
        .attachment-option {
          width: 25%;
          margin-bottom: 10px;
        }
      }
    </style>
   