<template>
  <v-container>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- Role dropdown -->
        <v-select
          v-model="formData.role"
          :items="roles"
          label="Role"
          required
          @change="handleRoleChange"
        ></v-select>
        
        <!-- Basic Fields -->
        <v-text-field v-model="formData.firstName" label="First Name" required></v-text-field>
        <v-text-field v-model="formData.middleName" label="Middle Name"></v-text-field>
        <v-text-field v-model="formData.lastName" label="Last Name" required></v-text-field>
        <v-text-field v-model="formData.birthdate" label="Birthdate" type="date" required></v-text-field>
        <v-textarea v-model="formData.address" label="Address" required></v-textarea>
        <v-text-field v-model="formData.phonenumber" label="Phone Number" required></v-text-field>
        
        <!-- Additional Fields for Admin/Guard -->
        <v-text-field v-model="formData.username" v-if="showAdditionalFields" label="Username" required></v-text-field>
        <v-text-field v-model="formData.password" v-if="showAdditionalFields" label="Password" type="password" required></v-text-field>
        <v-select v-model="formData.jobTitle" v-if="showAdditionalFields" :items="jobTitles" label="Job Title" required></v-select>
        <v-select v-model="formData.status" v-if="showAdditionalFields" :items="statuses" label="Status" required></v-select>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="handleSubmit">Save</v-btn>
      <v-btn color="error">Cancel</v-btn>
    </v-card-actions>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegistrationComponent',
  data() {
    return {
      valid: true,
      formData: {
        role: '',
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        password: '',
        birthdate: '',
        address: '',
        phonenumber: '',
        jobTitle: '',
        status: '',
      },
      roles: [], // Array to hold roles fetched from API
      jobTitles: ['Security Guard', 'Administrator'],
      statuses: ['Active', 'Inactive'],
      showAdditionalFields: false, // Initially hide additional fields

      // Add new property to control visibility of basic fields
      showBasicFields: true,
    };
  },
  mounted() {
    // Fetch roles on component mount
    this.fetchRoles();
  },
  methods: {
    handleSubmit() {
      if (this.$refs.form.validate()) {
        axios
          .post('http://localhost:8080/parking_occupant/api/registerOccupant.php', this.formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            console.log('Registration successful:', response.data);
            alert('Registration successful');
            this.resetForm();
          })
          .catch((error) => {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            alert('Registration failed: ' + (error.response ? error.response.data.error : error.message));
          });
      }
    },
    resetForm() {
      this.$refs.form.reset();
    },
    handleRoleChange() {
      // Toggle visibility of additional fields based on selected role
      this.showAdditionalFields = this.formData.role === 'Admin' || this.formData.role === 'Guard';
    },
    fetchRoles() {
      axios
        .get('http://localhost:8080/parking_occupant/api/FetchRoles.php')
        .then((response) => {
          if (response.data.success) {
            this.roles = response.data.roles; // Update roles array with fetched roles
          } else {
            console.error('Error fetching roles:', response.data.error);
          }
        })
        .catch((error) => {
          console.error('Error fetching roles:', error);
        });
    },
  },
};
</script>

<style scoped>
.v-card {
  margin: auto;
  max-width: 1000px;
  padding: 20px;
}
.v-btn {
  margin-right: 10px;
}
</style>
