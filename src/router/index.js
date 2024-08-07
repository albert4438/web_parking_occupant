import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginComponent from '../components/LoginComponent.vue';
import DashboardComponent from '../components/DashboardComponent.vue';
import OccupantComponent from '../components/OccupantComponent.vue';
import RegistrationComponent from '../components/RegistrationComponent.vue';
import ParkingLogComponent from '../components/ParkingLogComponent.vue';
import SettingsComponent from '../components/SettingsComponent.vue';
import RoleRegisterComponent from '@/components/RoleRegisterComponent.vue';
import ViewActionOccupantComponent from '@/components/ViewActionOccupantComponent.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginComponent,
  },
  {
    path: '/dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '', // Default child path, redirect to /dashboard/occupant
        redirect: 'occupant',
      },
      {
        path: 'occupant',
        name: 'occupant',
        component: OccupantComponent,
        meta: { requiresAuth: true }, // Require authentication to access
      },
      {
        path: 'occupant/view-action-occupant/:id',
        name: 'view-action-occupant',
        component: ViewActionOccupantComponent,
        //component: () => import('../components/ViewActionOccupantComponent.vue'),
        meta: { requiresAuth: true }, // Require authentication to access
        props: route => ({ occupantId: Number(route.params.id) })
      },
      {
        path: 'registration',
        name: 'registration',
        component: RegistrationComponent,
        meta: { requiresAuth: true }, // Require authentication to access
      },
      {
        path: 'parking-log',
        name: 'parking-log',
        component: ParkingLogComponent,
        meta: { requiresAuth: true }, // Require authentication to access
      },
      {
        path: 'settings',
        name: 'settings',
        component: SettingsComponent,
        meta: { requiresAuth: true }, // Require authentication to access
      },
      {
        path: 'role-register',
        name: 'role-register',
        component: RoleRegisterComponent,
        meta: { requiresAuth: true }, // Require authentication to access
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// Navigation guard to check authentication status
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); // Assuming token is stored in localStorage

  // Check if the route requires authentication and user is not authenticated
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ path: '/' }); // Redirect to login page if not authenticated
  } else {
    next(); // Proceed to the next route
  }
});

export default router;
