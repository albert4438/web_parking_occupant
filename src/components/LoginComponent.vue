<template>
  <div>
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="10">
          <v-card class="elevation-6 mt-15">
            <v-window v-model="step">
              <v-window-item :value="1">
                <v-row>
                  <!-- Left Column -->
                  <v-col cols="12" sm="6">
                    <v-card-text class="mt-12">
                      <h4 class="text-center">Parking Occupant Management System</h4>
                      <h6 class="text-center grey--text">
                        Simplify Parking, Maximize Time
                      </h6>

                      <v-text-field
                        label="Username"
                        outlined
                        dense
                        color="blue"
                        autocomplete="false"
                        class="mt-16"
                        v-model="username"
                      ></v-text-field>

                      <v-text-field
                        label="Password"
                        outlined
                        dense
                        color="blue"
                        autocomplete="false"
                        :type="showPassword ? 'text' : 'password'"
                        v-model="password"
                      >
                        <template v-slot:append>
                          <v-icon @click="togglePasswordVisibility">
                            {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                          </v-icon>
                        </template>
                      </v-text-field>

                        <v-btn color="blue" dark block tile @click="login">Login</v-btn>
                     
                    <!-- Error message container with fixed height -->
                    <div style="margin-top: 10px; height: 20px;">
                      <span v-if="error" class="error-message">
                        <i class="fas fa-exclamation-circle"></i> {{ error }}
                      </span>
                    </div>

                   

                    </v-card-text>
                  </v-col>

                  <!-- Right Column -->
                  <v-col cols="12" sm="6">
                    <v-img
                      src="@/assets/LoginPicture.jpg"
                      alt="Modern House"
                      cover
                      class="fill-height zoom-image"
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
        this.error = 'Please enter both username and password';
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
          // Store username and jobTitle in localStorage for use in other components
          localStorage.setItem('username', data[0].usr_username);
          localStorage.setItem('jobTitle', data[0].jobTitle);
          localStorage.setItem('token', 'some-token'); // Assuming you get a token in a real scenario
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
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
