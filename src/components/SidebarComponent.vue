<template>
  <v-navigation-drawer permanent app color="#104a8e" dark>
    <!-- User Information Section -->
    <v-list-item class="user-info">
      <v-list-item-avatar>
        <v-icon x-large>mdi-account-circle</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-capitalize">{{ username }}</v-list-item-title>
        <v-list-item-subtitle class="subtitle">You're logged in as {{ jobTitle }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <!-- Main Navigation Items -->
    <v-list>
      <v-list-item-group v-model="selectedItem" color="grey lighten-4">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          @click="handleItemClick(i, item)"
          :class="{ 'active-item': i === selectedItem }">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon v-if="item.text === 'SETTINGS'">
            <v-icon>{{ isSettingsSelected && showSubItems ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-list-item-icon>
        </v-list-item>

        <!-- Submenu under SETTINGS -->
        <template v-if="isSettingsSelected && showSubItems">
          <v-list-item-group v-model="selectedSubItem">
            <v-list-item
              v-for="(subItem, j) in settingsSubItems"
              :key="j"
              @click="handleSubItemClick(subItem)"
              class="ml-4 my-2"
              :class="{ 'active-item': subItem.route === selectedSubItem }">
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
      settingsIndex: 2,
      showSubItems: false,
      items: [
        { icon: 'mdi-account', text: 'OCCUPANT', route: '/dashboard/occupant' },
        { icon: 'mdi-parking', text: 'PARKING LOGS', route: '/dashboard/parking-log' },
        { icon: 'mdi-cogs', text: 'SETTINGS', route: '/dashboard/settings' },
      ],
      settingsSubItems: [
        { icon: 'mdi-account-group', text: 'ROLES', route: '/dashboard/role-register' },
        { icon: 'mdi-qrcode', text: 'QR Logo', route: '/dashboard/qr-logo' },
      ],
      username: '',
      jobTitle: ''
    };
  },

  created() {
    this.username = localStorage.getItem('username') || 'Guest';
    this.jobTitle = localStorage.getItem('jobTitle') || 'No Title';
  },

  computed: {
    isSettingsSelected() {
      return this.selectedItem === this.settingsIndex;
    }
  },

  watch: {
    $route(to) {
      this.updateSelectedItem(to.path);
    }
  },

  methods: {
    handleItemClick(index, item) {
      if (item.text === 'SETTINGS') {
        this.showSubItems = !this.showSubItems; // Toggle submenu visibility
        this.selectedSubItem = null;
      } else if (item.text === 'LOGOUT') {
        this.logout();
      } else {
        this.navigateTo(index, item.route);
      }
    },
    handleSubItemClick(subItem) {
      this.selectedSubItem = subItem.route;
      this.navigateTo(this.settingsIndex, subItem.route);
      this.$emit('update-title', `${this.items[this.settingsIndex].text} / ${subItem.text}`);
    },
    navigateTo(index, route) {
      this.selectedItem = index;
      if (this.$route.path !== route) {
        this.$router.push(route);
      }
      if (index !== this.settingsIndex) {
        this.$emit('update-title', this.items[index].text); // Emit main title for non-settings items
      }
    },
    updateSelectedItem(path) {
      const itemIndex = this.items.findIndex(item => item.route === path);
      if (itemIndex !== -1) {
        this.selectedItem = itemIndex;
        this.selectedSubItem = null;
        this.showSubItems = itemIndex === this.settingsIndex; // Preserve submenu state if settings item
        this.$emit('update-title', this.items[itemIndex].text); // Emit main title
      } else {
        const subItem = this.settingsSubItems.find(sub => sub.route === path);
        if (subItem) {
          this.selectedItem = this.settingsIndex;
          this.selectedSubItem = subItem.route;
          this.$emit('update-title', `${this.items[this.settingsIndex].text} / ${subItem.text}`); // Emit detailed title
        } else {
          this.selectedItem = 0;
          this.selectedSubItem = null;
          this.showSubItems = false;
          this.$emit('update-title', this.items[0].text); // Emit default title
        }
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
.user-info {
  padding: 10px 16px;
}

.subtitle {
  color: lightgray;
}

.logout-btn {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
}

.active-item .v-list-item-title,
.active-item .v-icon {
  color: #ffbd2e !important;
}

.v-navigation-drawer {
  background-color: #104a8e;
}

.v-list-item {
  cursor: pointer;
}
</style>
