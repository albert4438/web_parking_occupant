import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginComponent from '../components/LoginComponent.vue';
import DashboardComponent from '../components/DashboardComponent.vue';
import OccupantComponent from '../components/OccupantComponent.vue';
import RegistrationComponent from '../components/RegistrationComponent.vue';
import ParkingLogComponent from '../components/ParkingLogComponent.vue';
//import SettingsComponent from '../components/SettingsComponent.vue';
import RoleRegisterComponent from '@/components/RoleRegisterComponent.vue';
import QRLogo from '@/components/QRLogo.vue';
import ParkingLotComponent from '@/components/ParkingLotComponent.vue';
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
        meta: { requiresAuth: true },
      },
      {
        path: 'occupant/view-action-occupant/:id',
        name: 'view-action-occupant',
        component: ViewActionOccupantComponent,
        meta: { requiresAuth: true },
        props: route => ({ occupantId: Number(route.params.id) })
      },
      {
        path: 'registration',
        name: 'registration',
        component: RegistrationComponent,
        meta: { requiresAuth: true },
      },
      {
        path: 'parking-log',
        name: 'parking-log',
        component: ParkingLogComponent,
        meta: { requiresAuth: true },
      },
      // {
      //   path: 'settings',
      //   name: 'settings',
      //   component: SettingsComponent,
      //   meta: { requiresAuth: true },
      // },
      {
        path: 'role-register',
        name: 'role-register',
        component: RoleRegisterComponent,
        meta: { requiresAuth: true },
      },
      {
        path: 'qr-logo',
        name: 'qr-logo',
        component: QRLogo,
        meta: { requiresAuth: true },
      },
      {
        path: 'parking-lot',
        name: 'parking-lot',
        component: ParkingLotComponent,
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

export default router;
