import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginComponent from '../components/LoginComponent.vue';
import DashboardComponent from '../components/DashboardComponent.vue';
import OccupantComponent from '../components/OccupantComponent.vue';
import RegistrationComponent from '../components/RegistrationComponent.vue';
import ParkingLogComponent from '../components/ParkingLogComponent.vue';
import SettingsComponent from '../components/SettingsComponent.vue';
import RoleRegisterComponent from '@/components/RoleRegisterComponent.vue';
import QRLogo from '@/components/QRLogo.vue'; // Import the QRLogo component
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
      {
        path: 'qr-logo',
        name: 'qr-logo',
        component: QRLogo,
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

// // Navigation guard to check authentication status and job title restrictions
// router.beforeEach((to, from, next) => {
//   if (typeof localStorage !== 'undefined') {
//     const isAuthenticated = localStorage.getItem('token'); // Ensure localStorage is defined
//     const jobTitle = localStorage.getItem('jobTitle');

//     // Authentication and job title checks
//     if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
//       next({ path: '/' });
//     } else if (
//       ['Security Officer', 'Guard', 'Watchman'].includes(jobTitle) &&
//       ['/dashboard/settings', '/dashboard/registration', '/dashboard/qr-logo', '/dashboard/role-register'].includes(to.path)
//     ) {
//       next('/dashboard');
//     } else {
//       next();
//     }
//   } else {
//     next(); // Proceed if localStorage is not available (in non-browser environments)
//   }
// });


export default router;
