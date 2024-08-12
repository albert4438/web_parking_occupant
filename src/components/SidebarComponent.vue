<template>
  <v-navigation-drawer permanent app color="#104a8e" dark>
    <!-- User Information Section -->
    <v-list-item class="px-2 py-5">
      <v-list-item-avatar>
        <v-icon x-large>mdi-account-circle</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-capitalize">{{ username }}</v-list-item-title>
        <v-list-item-subtitle class="white--text">You're logged as {{ jobTitle }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    
    <!-- Main Navigation Items -->
    <v-list>
      <v-list-item-group v-model="selectedItem" color="grey lighten-4">
        <v-list-item v-for="(item, i) in items" :key="i" @click="handleItemClick(i, item)">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
        <!-- Submenu under SETTINGS -->
        <template v-if="selectedItem === settingsIndex">
          <v-list-item-group v-model="selectedSubItem">
            <v-list-item v-for="(subItem, j) in settingsSubItems" :key="j" @click="handleSubItemClick(subItem)">
              <v-list-item-icon>
                <v-icon>{{ subItem.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ subItem.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </template>
      </v-list-item-group>
    </v-list>

    <!-- Logout Button at the Bottom -->
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
      selectedSubItem: null,
      settingsIndex: 2, // Assuming SETTINGS is the third item
      items: [
        { icon: 'mdi-account', text: 'OCCUPANT', route: '/dashboard/occupant' },
        { icon: 'mdi-parking', text: 'PARKING LOGS', route: '/dashboard/parking-log' },
        { icon: 'mdi-cogs', text: 'SETTINGS', route: '/dashboard/settings' },
      ],
      settingsSubItems: [
        { icon: 'mdi-account-group', text: 'ROLES', route: '/dashboard/role-register' },
        // Add more submenu items here as needed
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
      this.updateSelectedItem(to.path);
    }
  },
  methods: {
    handleItemClick(index, item) {
      if (item.text === 'LOGOUT') {
        this.logout();
      } else {
        this.selectedSubItem = null; // Reset subitem selection when main item is clicked
        this.navigateTo(index, item.text, item.route);
      }
    },
    handleSubItemClick(subItem) {
      this.selectedItem = this.settingsIndex; // Ensure SETTINGS remains selected
      this.selectedSubItem = subItem.route;
      this.navigateTo(this.settingsIndex, subItem.text, subItem.route);
    },
    navigateTo(index, title, route) {
      this.selectedItem = index;
      this.$emit('update-title', title);
      if (this.$route.path !== route) {
        this.$router.push(route);
      }
    },
    updateSelectedItem(path) {
      switch (path) {
        case '/dashboard/occupant':
          this.selectedItem = 0;
          break;
        case '/dashboard/parking-log':
          this.selectedItem = 1;
          break;
        case '/dashboard/settings':
          this.selectedItem = this.settingsIndex;
          break;
        case '/dashboard/role-register':
          this.selectedItem = this.settingsIndex;
          this.selectedSubItem = path; // Ensure subitem is selected
          break;
        default:
          this.selectedItem = 0;
          this.selectedSubItem = null;
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

.v-list-item-title,
.v-list-item-subtitle {
  color: white !important;
}

.v-list-item-subtitle {
  color: lightgray !important;
}

.v-btn {
  background-color: #ffbd2e !important;
}

.v-list-item--active .v-list-item-title,
.v-list-item--active .v-icon {
  color: #ffbd2e !important;
}
</style>
