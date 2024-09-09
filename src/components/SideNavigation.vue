<template>
  
    <div class="side-nav" :class="{ open: sideNavOpen }" ref="sideNav">
      <div class="side-nav-content">
        <div class="side-nav-header">
          <img src="https://whispr.chat/images/default-profile.jpg" alt="Profile" class="profile-image">
          <div class="user-info">
            <span class="username">JohnDoe</span>
            <span class="whisper-count">42 liked whispers</span>
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
  </template>
  
  <script>
  export default {
    props: ['sideNavOpen'],
    methods: {
      logout() {
        console.log("Logging out");
        window.location.href = '/home';
      }
    }
  };
  </script>
  
  <style scoped>
  /* Include the styles from the original component */
  </style>
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