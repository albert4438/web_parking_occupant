<template>
    <header class="header">
      <h1>Parking Management System</h1>
      <button @click="logout" class="logout-button">Log Out</button>
    </header>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        // Clear the authentication token or any other stored user info
        localStorage.removeItem('authToken');
        // Redirect to the login page
        this.$router.push({ name: 'Login' });
      }
    }
  }
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #343a40;
    color: white;
  }
  
  .logout-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .logout-button:hover {
    background-color: #c82333;
  }
  </style>
  