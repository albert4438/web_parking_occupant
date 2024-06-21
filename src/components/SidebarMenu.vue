<!-- <template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>Menu</h2>
    </div>
    <ul class="sidebar-menu">
      <li @click="navigate('RegisterOccupant')">Register Occupant</li>
      <li @click="navigate('RegisterVehicle')">Register Vehicle</li>
      <li @click="navigate('ParkingLogs')">Parking Logs</li>
    </ul>
    <button class="logout-button" @click="logout">Log Out</button>
  </div>
</template>

<script>
export default {
  methods: {
    navigate(route) {
      this.$router.push({ name: route });
    },
    logout() {
      // Implement your logout logic here
      console.log('Logout');
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: #ecf0f1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
}

.sidebar-header {
  text-align: center;
  margin-bottom: 20px;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
}

.sidebar-menu li {
  margin: 10px 0;
  cursor: pointer;
  padding: 10px;
  background-color: #34495e;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.sidebar-menu li:hover {
  background-color: #1abc9c;
}

.logout-button {
  padding: 10px;
  background-color: #e74c3c;
  color: #ecf0f1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #c0392b;
}
</style> -->


<template>
  <div class="sidebar">
    <h2>Dashboard</h2>
    <ul>
      <li @click="navigate('RegisterOccupant')">Register Occupant</li>
      <li @click="navigate('RegisterVehicle')">Register Vehicle</li>
      <li @click="navigate('ParkingLogs')">Parking Logs</li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    navigate(route) {
      this.$router.push({ name: route });
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #343a40;
  color: white;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.sidebar h2 {
  margin: 0;
  padding: 10px 0;
  font-size: 24px;
  border-bottom: 1px solid #495057;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
  flex-grow: 1;
}

.sidebar li {
  margin: 15px 0;
  cursor: pointer;
  padding: 10px;
  background-color: #495057;
  border-radius: 5px;
  text-align: center;
}

.sidebar li:hover {
  background-color: #6c757d;
}
</style>
