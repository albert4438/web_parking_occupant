<template>
  <v-navigation-drawer permanent app color="#104a8e" dark>
    <v-list-item class="px-2 py-5">
      <v-list-item-avatar>
        <v-icon x-large>mdi-account-circle</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-capitalize">{{ username }}</v-list-item-title>
        <v-list-item-subtitle class="white--text">You're logged as {{ jobTitle }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>  
    
    <v-list>
      <v-list-item-group v-model="selectedItem" color="grey lighten-4">
        <v-list-item v-for="(item, i) in items" :key="i" @click="handleItemClick(i, item)">
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item> 
      </v-list-item-group>
    </v-list>

<!-- Logout button at the bottom -->
<div style="position: absolute; bottom: 0; width: 100%; padding: 10px;">
  <v-btn color="#ffbd2e" dark block tile @click="logout">LOGOUT</v-btn>
</div>

  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      selectedItem: 0,
      items: [
        { icon: 'mdi-account', text: 'OCCUPANT', route: '/dashboard/occupant' },
        { icon: 'mdi-pencil', text: 'REGISTER', route: '/dashboard/registration' },
        { icon: 'mdi-parking', text: 'PARKING LOGS', route: '/dashboard/parking-log' },
        { icon: 'mdi-account-group', text: 'ROLES', route: '/dashboard/role-register' },

        { icon: 'mdi-cogs', text: 'SETTINGS', route: '/dashboard/settings' },
        // { icon: 'mdi-logout', text: 'LOGOUT', route: '/logout' },
      ],
      username: '',
      jobTitle: ''
    };
  },
  created() {
    // Retrieve username and jobTitle from localStorage
    this.username = localStorage.getItem('username') || '';
    this.jobTitle = localStorage.getItem('jobTitle') || '';
  },
  watch: {
    $route(to) {
      switch (to.path) {
        case '/dashboard/occupant':
          this.selectedItem = 0;
          break;
        case '/dashboard/registration':
          this.selectedItem = 1;
          break;
        case '/dashboard/parking-log':
          this.selectedItem = 2;
          break;
        case 'dashboard/role-register':
          this.selectedItem = 3;
          break;
        case '/dashboard/settings':
          this.selectedItem = 4;
          break;
      }
    }
  },
  methods: {
  handleItemClick(index, item) {
    if (item.text === 'LOGOUT') {
      this.logout();
    } else {
      this.navigateTo(index, item.text, item.route);
    }
  },
  navigateTo(index, title, route) {
    this.selectedItem = index; // Update selectedItem when navigating
    this.$emit('update-title', title);
    if (this.$route.path !== route) {
      this.$router.push(route);
    }
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('jobTitle');
    this.$router.push('/');
  }
}

};
</script>

<style scoped>
.v-list-item {
  cursor: pointer;
}

.v-navigation-drawer {
  background-color: #104a8e;
}

.v-divider {
  border-color: white !important;
}

.v-list-item-title {
  color: white !important;
}

.v-list-item-subtitle {
  color: lightgray !important;
}

/* Styling for logout button */
.v-list-item[color="#ffbd2e"] .v-list-item-title,
.v-list-item[color="#ffbd2e"] .v-icon {
  color: #ffbd2e !important; /* Text and icon color */
}

/* Active item style */
.v-list-item--active .v-list-item-title,
.v-list-item--active .v-icon {
  color: #ffbd2e !important; /* Change text and icon color when active */
}
</style>
