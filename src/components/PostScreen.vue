<template>
    <div class="posts-container">
      <div v-if="loading">Loading...</div>
      <div v-if="error">{{ error }}</div>
      <div class="whispr-post" v-for="(post, index) in filteredPosts" :key="index">
        <div class="whispr-post-header">
          <img :src="post.avatar" alt="User Avatar" class="whispr-post-avatar">
          <span class="whispr-post-username">{{ post.username }}</span>
        </div>
        <div class="whispr-post-content">
          {{ post.phoneNumber }}
          {{ post.verified }} <!-- Fixed property name from 'varified' to 'verified' -->
        </div>
        <div class="whispr-post-actions">
          <span class="whispr-post-action" @click="likePost(index)">
            <i class="far fa-heart"></i> {{ post.likes }}
          </span>
          <span class="whispr-post-action" @click="openModal('comment', index)">
            <i class="far fa-comment"></i> {{ post.comments }}
          </span>
          <span class="whispr-post-action" @click="reWhisper(index)">
            <i class="fas fa-retweet"></i> {{ post.rewhispers }}
          </span>
          <span class="whispr-post-action" @click="openModal('share', index)">
            <i class="far fa-share-square"></i>
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      activeTab: String,
      searchQuery: String
    },
    data() {
      return {
        posts: [], // Raw posts from API
        loading: false,
        error: null
      };
    },
    computed: {
      filteredPosts() {
      const query = this.searchQuery.toLowerCase();
      return this.posts.filter(post =>
        post.username.toLowerCase().includes(query)
      );
    }
    },
    watch: {
      activeTab: 'fetchPosts' // Re-fetch posts when activeTab changes
    },
    mounted() {
      this.fetchPosts();
    },
    methods: {
      async fetchPosts() {
        this.loading = true;
        this.error = null;
        this.posts = []; // Clear previous posts when switching tabs
  
        const endpoints = {
          
          'My Whisperers': 'http://localhost:5000/api/post/for-you-endpoint',
          'For You': 'http://localhost:5000/api/post/for-you-endpoint',
          'Following': 'http://localhost:5000/api/post/following-endpoint',
          'Trending': 'http://localhost:5000/api/post/trending-endpoint',
          'News': 'http://localhost:5000/api/post/news-endpoint',
          'Sports': 'http://localhost:5000/api/post/sports-endpoint',
          'Entertainment': 'http://localhost:5000/api/post/entertainment-endpoint',
          'Technology': 'http://localhost:5000/api/post/technology-endpoint',
          'Politics': 'http://localhost:5000/api/post/politics-endpoint',
          'Science': 'http://localhost:5000/api/post/science-endpoint'
        };
  
        const endpoint = endpoints[this.activeTab];
  
        if (!endpoint) {
          this.error = 'No endpoint defined for this tab.';
          this.loading = false;
          return;
        }
  
        try {
          const response = await fetch(endpoint);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          this.posts = data.posts; // Adjust according to your API response structure
        } catch (error) {
          console.error('Error fetching posts:', error);
          this.error = 'Error fetching posts: ' + error.message;
        } finally {
          this.loading = false;
        }
      },
      likePost(index) {
        this.$emit('like-post', index);
      },
      openModal(type, index) {
  console.log(`Emitting open-modal event for ${type} with index ${index}`);
  this.$emit('open-modal', type, index); // Emitting the event
},
      reWhisper(index) {
        this.$emit('rewhisper', index);
      }
    }
  };
  </script>
  
 
  
  <style scoped>
   
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

</style>

  