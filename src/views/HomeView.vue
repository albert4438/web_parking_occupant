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
                            {{ showPassword ? 'di-eye' : 'di-eye-off' }}
                          </v-icon>
                        </template>
                      </v-text-field>

                      <v-btn color="blue" dark block tile @click="login">Login</v-btn>
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
  }),

  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    async login() {
      if (!this.username || !this.password) {
        console.error('Please enter both username and password');
        return;
      }

      try {
        const response = await axios.post('http://localhost:8080/parking_occupant/api/loginPersonnel.php', {
          username: this.username,
          password: this.password,
        });

        const data = response.data;

        if (response.status === 200) {
          localStorage.setItem('token', data.token);
          this.$router.push('/dashboard'); // Redirect to the dashboard
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('An error occurred during login', error);
      }
    },
  },
};
</script>

<style scoped>
  .v-application.rounded-bl-xl {
    border-bottom-left-radius: 300pw!important;
  }

  .v-application.rounded-bl-xl {
    border-bottom-right-radius: 300px!important;
  }
</style>