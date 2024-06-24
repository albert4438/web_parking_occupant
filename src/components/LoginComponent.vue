<template>
  <div class="login-container">
    <v-form @submit.prevent="login" class="login-form">
      <h2>Login</h2>
      <v-text-field
        v-model="username"
        label="Username"
        outlined
        dense
        required
      />
      <v-text-field
        v-model="password"
        label="Password"
        outlined
        dense
        required
        type="password"
      />
      <v-btn type="submit" color="primary" block> Login </v-btn>
      <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
    };
  },
  methods: {
    login() {
      axios.post('http://localhost:8080/parking_occupant/api/loginPersonnel.php', {
        username: this.username,
        password: this.password,
      })
      .then(response => {
        if (response.data && response.data.length > 0) {
          console.log('Login successful!', response.data);
          // Store the authentication token
          localStorage.setItem('authToken', 'exampleAuthToken'); 
          this.$router.push({ name: 'Dashboard' }); // Navigate to Dashboard
        } else {
          this.error = 'Login failed. Please try again.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        this.error = 'An error occurred. Please try again.';
      });
    },
  },
};
</script>