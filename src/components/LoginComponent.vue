<template>
  <div class="login-container">
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-3 glass-card">
            <v-window v-model="step">
              <v-window-item :value="1">
                <v-row>
                  <!-- Left Column -->
                  <v-col cols="12" sm="6" class="form-column">
                    <v-card-text>
                      <div class="text-center mb-6">
                        <h3 class="system-title">Parking Occupant Management System</h3>
                        <p class="system-subtitle">Simplify Parking, Maximize Time</p>
                      </div>

                      <v-text-field
                        label="Username"
                        outlined
                        dense
                        color="blue"
                        v-model="username"
                        hide-details
                        class="custom-input"
                        @keyup.enter="login"
                      ></v-text-field>

                      <v-text-field
                        label="Password"
                        outlined
                        dense
                        color="blue"
                        :type="showPassword ? 'text' : 'password'"
                        v-model="password"
                        hide-details
                        class="custom-input"
                        @keyup.enter="login"
                      >
                        <template v-slot:append>
                          <v-icon @click="togglePasswordVisibility">
                            {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                          </v-icon>
                        </template>
                      </v-text-field>

                      <v-btn color="blue" dark block tile @click="login">Login</v-btn>

                      <!-- Error message container with fixed height -->
                      <div style="margin-top: 10px; height: 30px;">
                        <span v-if="error" class="error-message">
                          <i class="fas fa-exclamation-circle"></i> {{ error }}
                        </span>
                      </div>

                    </v-card-text>
                  </v-col>

                  <!-- Right Column -->
                  <v-col cols="12" sm="6" class="image-column">
                    <v-img
                      src="@/assets/LoginPicture.jpg"
                      alt="Modern House"
                      cover
                      class="login-image"
                    ></v-img>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    step: 1,
    username: '',
    password: '',
    showPassword: false,
    error: null,
  }),

  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    async login() {
      if (!this.username || !this.password) {
        this.error = 'Please enter username and password';
        return;
      }

      try {
        const response = await axios.post('http://localhost:8080/parking_occupant/api/loginPersonnel.php', {
          username: this.username,
          password: this.password,
        });

        console.log('API response:', response.data);

        const data = response.data;

        if (response.status === 200 && data.length > 0) {
          localStorage.setItem('firstname', data[0].Firstname);
          localStorage.setItem('profilePicture', data[0].ProfilePicture);
          localStorage.setItem('jobTitle', data[0].jobTitle);
          localStorage.setItem('role', data[0].role);  // Store the role
          localStorage.setItem('token', 'some-token');
          this.$router.push('/dashboard');
        } else {
          this.error = 'Invalid credentials';
        }
      } catch (error) {
        console.error('Error during API call:', error);
        this.error = 'Failed to communicate with API';
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  background-image: linear-gradient(to right, #104a8e, #EFC958);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
}

.system-title {
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.system-subtitle {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  color: #757575;
}

.custom-input {
  margin-bottom: 20px;
}

.login-button {
  background-color: #3a7bd5; /* Original blue color */
  color: white;
  font-weight: bold;
  text-transform: none;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #2a5ea5; /* Darker shade of blue */
}

.error-message {
  color: red;
  margin-top: 10px;
}

.image-column {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-image {
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.login-image:hover {
  transform: scale(1.05);
}
</style>
