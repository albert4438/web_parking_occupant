  <template>
    <div class="dashboard-layout">
      <HeaderComponent />
      <div class="content-wrapper">
        <SidebarMenu />
        <div class="main-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </template>

  <script>
  import HeaderComponent from './HeaderComponent.vue';
  import SidebarMenu from './SidebarMenu.vue';

  export default {
    components: {
      HeaderComponent,
      SidebarMenu
    }
  }
  </script>

  <style scoped>
  .dashboard-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .content-wrapper {
    display: flex;
    flex: 1;
  }

  .main-content {
    flex: 1;
    padding: 20px;
    background-color: #f8f9fa;
    overflow-y: auto;
  }
  </style>
