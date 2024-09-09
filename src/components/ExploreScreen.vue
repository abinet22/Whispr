<template>
    <div class="dashboard">
      <div class="top-bar" ref="topBar">
        <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#ff5a5f" stroke-width="5" />
          <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="#ff5a5f" />
        </svg>
        <i class="fas fa-bars menu-toggle" @click="toggleSideNav"></i>
      </div>
  
      <div class="search-bar">
        <input type="text" class="search-input" placeholder="Search Whispr..." v-model="searchQuery">
      </div>
      <div class="tabs-container">
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
    </div>

  
      <div class="dashboard-content">
        <PostScreen :active-tab="activeTab" :search-query="searchQuery"  @open-modal="handleOpenModal" />
      </div>
  
      <div class="bottom-nav">
        <a href="/dashboard"><i class="fas fa-home"></i></a>
        <a href="/explore"><i class="fas fa-compass"></i></a>
        <a href="/anonymouschat"><i class="fas fa-user-secret"></i></a>
        <a href="/directmessage"><i class="fas fa-comments"></i></a>
      </div>
  
      <div class="add-whisper-btn" @click="openModal('addWhisper')">
        <i class="fas fa-plus"></i>
      </div>
  
      <div class="side-nav" ref="sideNav" :class="{ open: sideNavOpen }">
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
  
      <div id="whisperModal" class="modal" v-if="modals.addWhisper" ref="whisperModal">
        <div class="modal-content">
          <span class="close" @click="closeModal('addWhisper')">&times;</span>
          <textarea v-model="newWhisperContent" placeholder="What's on your mind?"></textarea>
          <button @click="addWhisper">Whisper</button>
          
          <div class="share-options">
            <div class="share-option"><i class="fas fa-image"></i></div>
            <div class="share-option"><i class="fas fa-video"></i></div>
            <div class="share-option"><i class="fas fa-map-marker-alt"></i></div>
          </div>
        </div>
      </div>
  
      <div id="commentModal" class="modal" v-if="modals.comment" ref="commentModal">
        <div class="modal-content">
          <span class="close" @click="closeModal('comment')">&times;</span>
          <p>Share Modal for index {{ currentWhisperIndex }}</p>
          <textarea v-model="newCommentContent" placeholder="Add a comment"></textarea>
          <button @click="addComment">Comment</button>
        </div>
      </div>
  
      <div id="shareModal" class="modal" v-if="modals.share" ref="shareModal">
        <div class="modal-content">
          <span class="close" @click="closeModal('share')">&times;</span>
          <p>Share this whisper:</p>
          <p>Share Modal for index {{ currentWhisperIndex }}</p>
          <button @click="shareWhisper('facebook')">Facebook</button>
          <button @click="shareWhisper('twitter')">Twitter</button>
          <button @click="shareWhisper('linkedin')">LinkedIn</button>
        </div>
      </div>
    </div>
  </template>


<script>
import PostScreen from './PostScreen.vue'; // Adjust the path as needed
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
export default {
    components: {
    PostScreen
  },
  data() {
    return {
      sideNavOpen: false,
      activeTab: 'For You', // default active tab
      currentWhisperIndex: -1,
      touchStartX: 0,
      touchEndX: 0,
      touchThreshold: 50,
      newWhisperContent: '',
      newCommentContent: '',
      modals: {
        addWhisper: false,
        comment: false,
        share: false
      },
      tabs: [
        'For You',
        'Following',
        'Trending',
        'News',
        'Sports',
        'Entertainment',
        'Technology',
        'Politics',
        'Science'
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
    logout() {
      console.log("Logging out");
      window.location.href = '/home';
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
    
      .tabs-container {
        overflow-x: auto;
        white-space: nowrap;
        background-color: var(--secondary-background);
        padding: 10px 0;
      }
    
      .tabs {
        display: inline-flex;
        padding: 0 20px;
      }
    
      .tab {
        padding: 10px 20px;
        cursor: pointer;
        color: var(--link-color);
        transition: color 0.3s, border-bottom 0.3s;
        text-align: center;
        border-bottom: 2px solid transparent;
      }
    
      .tab.active {
        color: var(--tab-active);
        border-bottom: 2px solid var(--tab-active);
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
    
        .tab {
          padding: 10px 15px;
        }
      }
    </style>
   