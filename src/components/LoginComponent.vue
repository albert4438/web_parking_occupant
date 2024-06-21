<!-- <template>
  <div class="login-container">
    <form @submit.prevent="login" class="login-form">
      <h2>Login</h2>
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" class="form-control" />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
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

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

.form-control {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
}

.btn:hover {
  background-color: #0056b3;
}

.error-message {
  margin-top: 10px;
  color: #dc3545;
}
</style>  -->



<template>
  <div class="login-container">
    <form @submit.prevent="login" class="login-form">
      <h2>Login</h2>
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" class="form-control" />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
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

<style scoped>
/* Same CSS as before */
</style>
