<template>
    <div>
      <div class="dashboard">
        <div class="top-bar" ref="topBar">
          <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#ff5a5f" stroke-width="5" />
            <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="#ff5a5f" />
          </svg>
          <i class="fas fa-bars menu-toggle" @click="toggleSideNav"></i>
        </div>
  
        <div class="search-bar">
          <input type="text" class="search-input" placeholder="Search users..." v-model="searchQuery" @input="searchUsers">
        </div>
  
        <div class="chat-list" id="chatList">
          <div v-for="user in filteredUsers" :key="user.id" class="chat-item" @click="openChat(user.username)">
            <img :src="user.avatar" :alt="user.name" class="chat-avatar">
            <div class="chat-info">
              <div class="chat-name">{{ user.name }}</div>
              <div class="chat-username">@{{ user.username }}</div>
            </div>
          </div>
        </div>
  
        <div class="bottom-nav">
      <a href="/dashboard "><i class="fas fa-home"></i></a>
      <a href="/explore"><i class="fas fa-compass"></i></a>
      <a href="/anonymouschat"><i class="fas fa-user-secret"></i></a>
      <a href="/directmessage"><i class="fas fa-comments"></i></a>
    </div>
      </div>
  
      <div class="side-nav" :class="{ open: sideNavOpen }" ref="sideNav" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
        <div class="side-nav-content">
          <div class="side-nav-header">
            <img :src="user?.profileImage" alt="Profile" class="profile-image">
      <div class="user-info">
        <span class="username">{{ user?.username }}</span>
        <span class="whisper-count">{{ user?.whisperCount }} liked whispers</span>
      </div>
          </div>
          <ul class="side-nav-links">
            <li><a href="#profile"><i class="fas fa-user"></i>Profile</a></li>
            <li><a href="#whispers"><i class="fas fa-comment-alt"></i>My Whispers</a></li>
            <li><a href="#liked"><i class="fas fa-heart"></i>Liked Whispers</a></li>
            <li><a href="#bookmarks"><i class="fas fa-bookmark"></i>Bookmarks</a></li>
            <li><a href="#friends"><i class="fas fa-users"></i>Friends</a></li>
            <li><a href="#groups"><i class="fas fa-user-friends"></i>Groups</a></li>
            <li><a href="#settings"><i class="fas fa-cog"></i>Settings</a></li>
            <li><a href="#help"><i class="fas fa-question-circle"></i>Help & Support</a></li>
            <li><a href="#logout" @click="logout"><i class="fas fa-sign-out-alt"></i>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  // Define reactive state variables
  const users = ref([]);
  const sideNavOpen = ref(false);
  const searchQuery = ref('');
  const router = useRouter();
  const store = useStore();

// Get user from Vuex store
const user = computed(() => store.getters.user);

  // Computed property for filtering users
  const filteredUsers = computed(() => {
    return users.value.filter(user =>
      (user.username || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  // Function to toggle side navigation
  const toggleSideNav = () => {
    sideNavOpen.value = !sideNavOpen.value;
  };
  
  // Function to search users (uses the computed property)
  const searchUsers = () => {
    // Computed property `filteredUsers` handles the search
  };
  
  // Function to handle opening a chat with a user
  const openChat = (userId) => {
    router.push({ name: 'MessageScreen', params: { userId } });
  };
  
  // Handling touch events for swipe detection
  let touchStartX = 0;
  const touchThreshold = 50;
  
  const handleTouchStart = (event) => {
    touchStartX = event.touches[0].clientX;
  };
  
  const handleTouchEnd = (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchDistance = touchEndX - touchStartX;
  
    // Check if swipe distance exceeds the threshold to close side nav
    if (sideNavOpen.value && touchDistance > touchThreshold) {
      sideNavOpen.value = false;
    }
  };
  
  // Handling clicks outside of the side nav to close it
  const handleClickOutside = (event) => {
    const sideNav = document.querySelector('.side-nav');
    const topBar = document.querySelector('.top-bar');
  
    if (sideNavOpen.value && !sideNav.contains(event.target) && !topBar.contains(event.target)) {
      sideNavOpen.value = false;
    }
  };
  
  // Set up and clean up event listeners
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
  onMounted(() => {
  if (!user.value) {
    store.dispatch('fetchUser');
  }
});

  // Fetch users from API on component mount
  onMounted(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/post/for-you-endpoint');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      users.value = data.posts || []; // Adjust according to your API response structure
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  });
  </script>
  

       <style scoped>
      
      
        .dashboard {
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
      
        .top-bar .logo {
          width: 40px;
          height: 40px;
        }
      
        .menu-toggle {
          font-size: 24px;
          cursor: pointer;
          color: var(--text-color);
        }
      
        .search-bar {
          display: flex;
          justify-content: center;
          padding: 10px 20px;
          background-color: var(--secondary-background);
        }
      
        .search-input {
          width: 100%;
          max-width: 600px;
          padding: 10px 15px;
          border: none;
          border-radius: 25px;
          background-color: var(--post-background);
          color: var(--text-color);
          font-size: 16px;
        }
      
        .search-input::placeholder {
          color: var(--link-color);
        }
      
        .chat-list {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }
      
        .chat-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid var(--secondary-background);
          cursor: pointer;
          transition: background-color 0.3s;
        }
      
        .chat-item:hover {
          background-color: var(--secondary-background);
        }
      
        .chat-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 15px;
        }
      
        .chat-info {
          flex: 1;
        }
      
        .chat-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
      
        .chat-preview {
          color: var(--link-color);
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      
        .chat-time {
          font-size: 12px;
          color: var(--link-color);
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
      
        .side-nav {
          position: fixed;
          top: 0;
          right: -300px;
          width: 300px;
          height: 100%;
          background-color: var(--secondary-background);
          transition: right 0.3s ease-in-out;
          z-index: 1000;
          overflow-y: auto;
        }
      
        .side-nav.open {
          right: 0;
        }
      
        .side-nav-content {
          padding: 20px;
        }
      
        .side-nav-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
      
        .profile-image {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-right: 15px;
          object-fit: cover;
        }
      
        .user-info {
          display: flex;
          flex-direction: column;
        }
      
        .username {
          font-size: 18px;
          font-weight: bold;
        }
      
        .whisper-count {
          font-size: 14px;
          color: var(--link-color);
        }
      
        .side-nav-links {
          list-style-type: none;
          padding: 0;
        }
      
        .side-nav-links li {
          margin-bottom: 15px;
        }
      
        .side-nav-links a {
          display: flex;
          align-items: center;
          color: var(--text-color);
          text-decoration: none;
          font-size: 16px;
        }
      
        .side-nav-links i {
          margin-right: 10px;
          width: 20px;
          text-align: center;
        }
      
        .modal {
          display: none;
          position: fixed;
          z-index: 1001;
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
      
        .modal-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
      
        .modal-header img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 15px;
        }
      
        .input-group {
          display: flex;
          align-items: center;
          background-color: var(--post-background);
          border-radius: 25px;
          padding: 5px 15px;
          margin-top: 10px;
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
      
        .attachment-tabs {
          display: none;
          overflow-x: auto;
          white-space: nowrap;
          margin-top: 10px;
          padding-bottom: 10px;
        }
      
        .attachment-tab {
          display: inline-block;
          padding: 10px 20px;
          background-color: var(--post-background);
          color: var(--text-color);
          border-radius: 20px;
          margin-right: 10px;
          cursor: pointer;
        }
      
        .attachment-tab.active {
          background-color: var(--primary-color);
        }
      
        .recording-ui {
          display: none;
          align-items: center;
          justify-content: space-between;
          background-color: var(--post-background);
          border-radius: 25px;
          padding: 10px 15px;
          margin-top: 10px;
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
      
        .attachment-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
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
          background-color: var(--post-background);
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 14px;
        }
      
        #mapContainer {
          display: none;
          height: 300px;
          width: 100%;
          margin-top: 10px;
        }
      
        #mapContainer .map {
          height: 100%;
          width: 100%;
          border-radius: 10px;
        }
      
        #shareCurrentLocationBtn {
          display: none;
          width: 100%;
          padding: 10px;
          background-color: var(--primary-color);
          color: var(--text-color);
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 10px;
        }
      
        @media (max-width: 768px) {
          .chat-list {
            padding: 10px;
          }
      
          .side-nav {
            width: 100%;
            right: -100%;
          }
      
          .modal-content {
            width: 90%;
          }
        }
      </style>
     