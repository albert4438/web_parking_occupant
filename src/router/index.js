// import { createRouter, createWebHistory } from 'vue-router';
// import LoginComponent from '../components/LoginComponent.vue';
// import DashboardComponent from '../components/DashboardComponent.vue';
// import RegisterOccupant from '../components/RegisterOccupant.vue';
// import RegisterVehicle from '../components/RegisterVehicle.vue';
// import ParkingLogs from '../components/ParkingLogs.vue';

// const routes = [
//   {
//     path: '/',
//     name: 'Login',
//     component: LoginComponent,
//   },
//   {
//     path: '/dashboard',
//     name: 'Dashboard',
//     component: DashboardComponent,
//   },
//   {
//     path: '/register-occupant',
//     name: 'RegisterOccupant',
//     component: RegisterOccupant,
//   },
//   {
//     path: '/register-vehicle',
//     name: 'RegisterVehicle',
//     component: RegisterVehicle,
//   },
//   {
//     path: '/parking-logs',
//     name: 'ParkingLogs',
//     component: ParkingLogs,
//   },
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// export default router;

// import { createRouter, createWebHistory } from 'vue-router';
// import LoginComponent from '../components/LoginComponent.vue';
// import DashboardComponent from '../components/DashboardComponent.vue';
// import RegisterOccupant from '../components/RegisterOccupant.vue';
// import RegisterVehicle from '../components/RegisterVehicle.vue';
// import ParkingLogs from '../components/ParkingLogs.vue';

// const routes = [
//   {
//     path: '/',
//     name: 'Login',
//     component: LoginComponent,
//   },
//   {
//     path: '/dashboard',
//     name: 'Dashboard',
//     component: DashboardComponent,
//     children: [
//       {
//         path: 'register-occupant',
//         name: 'RegisterOccupant',
//         component: RegisterOccupant,
//       },
//       {
//         path: 'register-vehicle',
//         name: 'RegisterVehicle',
//         component: RegisterVehicle,
//       },
//       {
//         path: 'parking-logs',
//         name: 'ParkingLogs',
//         component: ParkingLogs,
//       },
//     ],
//   },
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// // Add navigation guards
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!localStorage.getItem('authToken');
  
//   if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
//     next({ name: 'Login' });
//   } else {
//     next();
//   }
// });

// export default router;


import { createRouter, createWebHistory } from 'vue-router';
import LoginComponent from '../components/LoginComponent.vue';
import DashboardComponent from '../components/DashboardComponent.vue';
import RegisterOccupant from '../components/RegisterOccupant.vue';
import RegisterVehicle from '../components/RegisterVehicle.vue';
import ParkingLogs from '../components/ParkingLogs.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginComponent,
  },
  {
    path: '/dashboard',
    component: DashboardComponent,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: RegisterOccupant, // Change this to your default dashboard component if needed
      },
      {
        path: 'register-occupant',
        name: 'RegisterOccupant',
        component: RegisterOccupant,
        meta: { requiresAuth: true },
      },
      {
        path: 'register-vehicle',
        name: 'RegisterVehicle',
        component: RegisterVehicle,
        meta: { requiresAuth: true },
      },
      {
        path: 'parking-logs',
        name: 'ParkingLogs',
        component: ParkingLogs,
        meta: { requiresAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
