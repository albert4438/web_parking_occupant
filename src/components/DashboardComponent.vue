<template>
  <v-app>

    <SidebarComponent @update-title="updateTitle" />

    <v-app-bar app color="primary" dark>
      <v-toolbar-title>{{ toolbarTitle }}</v-toolbar-title>
    </v-app-bar>

    <v-container fluid>
      <router-view></router-view>
    </v-container>

  </v-app>
</template>

<script>
import SidebarComponent from './SidebarComponent.vue';

export default {
  name: 'DashboardComponent',
  components: {
    SidebarComponent,
  },
  data() {
    return {
      toolbarTitle: 'Occupant'
    };
  },
  created() {
    if (!localStorage.getItem('token')) {
      this.$router.push('/'); // Redirect to login if token is not present
    } else if (this.$route.path!== '/dashboard/occupant') {
      this.$router.push('/dashboard/occupant').catch(err => {
        if (err.name!== 'NavigationDuplicated') {
          throw err;
        }
      });
    }
  },
  methods: {
    updateTitle(title) {
      this.toolbarTitle = title;
    }
  }
};
</script>

<script>
import SidebarComponent from './SidebarComponent.vue';

export default {
  name: 'DashboardComponent',
  components: {
    SidebarComponent,
  },
  data() {
    return {
      toolbarTitle: 'Occupant'
    };
  },
  created() {
    if (!localStorage.getItem('token')) {
      this.$router.push('/'); // Redirect to login if token is not present
    } else if (this.$route.path !== '/dashboard/occupant') {
      this.$router.push('/dashboard/occupant').catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    }
  },
  methods: {
    updateTitle(title) {
      this.toolbarTitle = title;
    }
  }
};
</script>
