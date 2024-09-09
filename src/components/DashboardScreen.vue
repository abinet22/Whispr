<template>
  <div id="dashboard" class="dashboard">
    <div class="top-bar" ref="topBar">
      <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#ff5a5f" stroke-width="5" />
        <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="#ff5a5f" />
      </svg>
      <i class="fas fa-bars menu-toggle" @click="toggleSideNav"></i>
    </div>
    
    <div class="side-nav" :class="{ open: sideNavOpen }" ref="sideNav"  @touchstart="handleTouchStart"
    @touchend="handleTouchEnd">
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
          <li><a href="/" @click="logout"><i class="fas fa-sign-out-alt"></i>Logout</a></li>
        </ul>
      </div>
    </div>
    <div class="search-bar">
        <input type="text" class="search-input" placeholder="Search Whispr..." v-model="searchQuery">
      </div>
    <div class="dashboard-content">
      <div class="tabs">
        <div
          class="tab"
          :class="{ active: activeTab === tab }"
          v-for="tab in tabs"
          :key="tab"
          @click="switchTab(tab)"
        >
          {{ tab }}
        </div>
      </div>
      <div id="whispr-posts">
        <PostScreen :active-tab="activeTab" :search-query="searchQuery"  @open-modal="handleOpenModal" />
      </div>
    </div>
    
    <div class="add-whisper-btn" @click="openModal('addWhisper')" ref="modalAddWhisper">
      <i class="fas fa-plus"></i>
    </div>

    <!-- Add Whisper Modal -->
    <div v-if="modals.addWhisper" class="modal" ref="modalAddWhisper">
      <div class="modal-content">
        <span class="close" @click="closeModal('addWhisper')">&times;</span>
        <h2>Add a new Whisper</h2>
        <textarea v-model="newWhisperContent" placeholder="What's on your mind?"></textarea>
        <button @click="addWhisper">Post Whisper</button>
      </div>
    </div>

    <!-- Comment Modal -->
    <div v-if="modals.comment" class="modal" ref="modalComment">
      <div class="modal-content">
        <span class="close" @click="closeModal('comment')">&times;</span>
        <h2>Add a comment</h2>
        <p> index {{ currentWhisperIndex }}</p>
        <textarea v-model="newCommentContent" placeholder="Write your comment..."></textarea>
        <button @click="addComment">Post Comment</button>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="modals.share" class="modal" ref="modalShare">
      <div class="modal-content">
        <span class="close" @click="closeModal('share')">&times;</span>
        <h2>Share this Whisper</h2>
        <p> index {{ currentWhisperIndex }}</p>
        <div class="share-options">
          <div class="share-option" @click="shareWhisper('facebook')">
            <i class="fab fa-facebook"></i> Facebook
          </div>
          <div class="share-option" @click="shareWhisper('twitter')">
            <i class="fab fa-twitter"></i> Twitter
          </div>
          <div class="share-option" @click="shareWhisper('whatsapp')">
            <i class="fab fa-whatsapp"></i> WhatsApp
          </div>
          <div class="share-option" @click="shareWhisper('copy')">
            <i class="fas fa-link"></i> Copy Link
          </div>
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
</template>

<script>
import PostScreen from './PostScreen.vue'; // Adjust the path as needed
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();
export default {
  components: {
    PostScreen
  },
  data() {
    return {
      sideNavOpen: false,
     
      touchStartX: 0,
    touchEndX: 0,
    touchThreshold: 50, 
      newWhisperContent: '',
      newCommentContent: '',
      activeTab: 'For You', // default active tab
      currentWhisperIndex: -1,
      modals: {
        addWhisper: false,
        comment: false,
        share: false
      },
      tabs: [
        'For You',
        'My Whisperers',
       
      ],
      searchQuery: ''
    };
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.getters.user);

    onMounted(() => {
      if (!user.value) {
        store.dispatch('fetchUser');
      }
    });

    return { user };
  },
  methods: {
    toggleSideNav() {
      this.sideNavOpen = !this.sideNavOpen;
    },

    switchTab(tabName) {
      this.activeTab = tabName;
    },
   
    handleOpenModal(type, index) {
      console.log(`Handling open modal: ${type} for index ${index}`);
      this.currentWhisperIndex = index;
      if (type in this.modals) {
        this.modals[type] = true;
      } else {
        console.error(`Modal type '${type}' does not exist.`);
      }
    },
    closeModal(type) {
      console.log(`Closing ${type} modal`);
      if (type in this.modals) {
        this.modals[type] = false;
      } else {
        console.error(`Modal type '${type}' does not exist.`);
      }
    },
     openModal(type) {

     this.modals[type] = true;
   },

    addWhisper() {
      if (this.newWhisperContent.trim() !== "") {
        const newWhisper = {
          username: "JohnDoe",
          avatar: "https://whispr.chat/images/default-profile.jpg",
          content: this.newWhisperContent,
          likes: 0,
          comments: 0,
          shares: 0,
          rewhispers: 0
        };
        this.newWhisprPosts.unshift(newWhisper);
        this.newWhisperContent = '';
        this.closeModal('addWhisper');
      }
    },
       async logout()  {
  try {
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('sessionToken');

    // Clear Vuex store
    store.dispatch('clearUser');

    // Invalidate server-side session (make a request to your server)
    await fetch('http://localhost:5000/api/users/logout', {
      method: 'POST',
      credentials: 'include', // Include credentials (cookies) in the request
    });

    // Redirect to home or login page
    router.push('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
   },
    likeWhisper(index) {
      this.displayedPosts[index].likes++;
    },
    addComment() {
      if (this.newCommentContent.trim() !== "") {
        // Logic to add comment
        this.closeModal('comment');
      }
    },
    shareWhisper(platform) {
      console.log({platform});
      this.closeModal('share');
    },
    reWhisper(index) {
      this.displayedPosts[index].rewhispers++;
    },
    handleClickOutside(event) {
    const sideNav = this.$refs.sideNav;

    const topBar = this.$refs.topBar;

    if (this.sideNavOpen && !sideNav.contains(event.target) && !topBar.contains(event.target)) {
      this.sideNavOpen = false;
    }

   
  },
  handleTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
  },
  handleTouchEnd(event) {
    this.touchEndX = event.changedTouches[0].clientX;

    const touchDistance = this.touchEndX - this.touchStartX;
    
    // Check if swipe distance exceeds the threshold to close side nav
    if (this.sideNavOpen && touchDistance > this.touchThreshold) {
      this.sideNavOpen = false;
    }
  }
  },
  
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    document.addEventListener('touchstart', this.handleTouchStart);
    document.addEventListener('touchend', this.handleTouchEnd);
  
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchend', this.handleTouchEnd);
  }
};
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
  
    .whispr-post {
      background-color: var(--post-background);
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 20px;
    }
  
    .whispr-post-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  
    .whispr-post-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
  
    .whispr-post-username {
      font-weight: bold;
    }
  
    .whispr-post-content {
      margin-bottom: 15px;
    }
  
    .whispr-post-actions {
      display: flex;
      justify-content: space-between;
    }
  
    .whispr-post-action {
      color: var(--link-color);
      cursor: pointer;
    }
  
    .whispr-post-action:hover {
      color: var(--primary-color);
    }
  
    .tabs {
      display: flex;
      justify-content: center;
      border-bottom: 1px solid var(--link-color);
      margin-bottom: 20px;
      overflow-x: auto;
      white-space: nowrap;
    }
  
    .tab {
      flex: 1;
      padding: 10px 20px;
      cursor: pointer;
      color: var(--link-color);
      transition: color 0.3s, border-bottom 0.3s;
      text-align: center;
    }
  
    .tab.active {
      color: var(--tab-active);
      border-bottom: 2px solid var(--tab-active);
    }
  
    .add-whisper-btn {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: var(--primary-color);
      color: var(--text-color);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, opacity 0.3s;
      z-index: 100;
    }
  
    .add-whisper-btn.hidden {
      transform: scale(0);
      opacity: 0;
    }
  
    .modal {
      
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
    }
  
    .close:hover,
    .close:focus {
      color: #fff;
      text-decoration: none;
      cursor: pointer;
    }
  
    .modal textarea {
      width: 100%;
      height: 100px;
      margin-bottom: 10px;
      background-color: var(--post-background);
      border: none;
      color: var(--text-color);
      padding: 10px;
      border-radius: 5px;
    }
  
    .modal button {
      background-color: var(--primary-color);
      color: var(--text-color);
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
    }
  
    .share-options {
      display: flex;
      justify-content: space-around;
      margin-top: 10px;
    }
  
    .share-option {
      cursor: pointer;
      padding: 10px;
      border-radius: 5px;
      transition: background-color 0.3s;
    }
  
    .share-option:hover {
      background-color: var(--post-background);
    }
  
    @media (max-width: 768px) {
      .dashboard-content {
        padding: 10px;
      }
  
      .side-nav {
        width: 100%;
        right: -100%;
       
      }
      .side-nav.open {
  transform: translateX(0); /* Show when open */
}
      .tabs {
        justify-content: space-between;
      }
  
      .tab {
        padding: 10px;
      }
    }
  </style> 