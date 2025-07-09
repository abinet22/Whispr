import { createRouter, createWebHistory } from 'vue-router';
import IndexScreen from '@/components/IndexScreen.vue';
import SplashScreen from '@/components/SplashScreen.vue';
import AnonymousChatScreen from '@/components/AnonymousChatScreen.vue';
import DashboardScreen from '@/components/DashboardScreen.vue';
import ExploreScreen from '@/components/ExploreScreen.vue';
import DirectMessage from '@/components/DirectMessage.vue';
import MessageScreen from '@/components/MessageScreen.vue';

function isAuthenticated() {
  // Check if the user is authenticated by checking local storage
  console.log(localStorage.getItem('sessionToken'));
  return !!localStorage.getItem('sessionToken');

}

const routes = [
  {
    path: '/',
    name: 'SplashScreen',
    component: SplashScreen,
  },
  {
    path: '/home',
    name: 'IndexScreen',
    component: IndexScreen,
  },
  {
    path: '/anonymouschat',
    name: 'AnonymousChatScreen',
    component: AnonymousChatScreen,
  },
  {
    path: '/dashboard',
    name: 'DashboardScreen',
    component: DashboardScreen,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next('/'); // Redirect to splash screen or login
      }
    }
  },
  {
    path: '/explore',
    name: 'ExploreScreen',
    component: ExploreScreen,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next('/'); // Redirect to splash screen or login
      }
    }
  },
  {
    path: '/directmessage',
    name: 'DirectMessage',
    component: DirectMessage,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next('/'); // Redirect to splash screen or login
      }
    }
  },
  {
    path: '/MessageScreen/:userId',
    name: 'MessageScreen',
    component: MessageScreen,
    props: true,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next('/'); // Redirect to splash screen or login
      }
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/components/DashboardScreen.vue'), // Temporary redirect to dashboard
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next('/dashboard');
      } else {
        next('/');
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
