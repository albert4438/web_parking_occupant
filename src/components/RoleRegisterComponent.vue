<template>
    <v-container>
      <!-- Add Role Button -->
      <v-btn color="primary" @click="showModal = true" class="mb-4">
        <v-icon left>mdi-plus</v-icon>
        Add Role
      </v-btn>
  
      <!-- Modal for Role Registration -->
      <v-dialog v-model="showModal" max-width="500">
        <v-card>
          <v-card-title class="primary darken-1 white--text">
            {{ editingIndex === null ? 'Add New Role' : 'Edit Role' }}
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <!-- Role field -->
              <v-text-field
                v-model="formData.role"
                label="Role"
                required
                :rules="[v => !!v || 'Role is required']"
                prepend-inner-icon="mdi-account-key"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="primary" @click="handleSubmit" :loading="loading">
              <v-icon left>{{ editingIndex === null ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
              {{ editingIndex === null ? 'Save' : 'Update' }}
            </v-btn>
            <v-btn color="error" @click="closeModal">
              <v-icon left>mdi-close</v-icon>
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Table for Existing Roles -->
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Role Name</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(role, index) in roles" :key="index">
              <td>{{ role }}</td>
              <td>
                <v-icon small @click="editRole(index)">mdi-pencil</v-icon>
                <v-icon small @click="deleteRole(role.Role_ID)">mdi-delete</v-icon> <!-- Corrected here -->
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'RoleRegisterComponent',
    data() {
      return {
        valid: true,
        loading: false,
        formData: {
          role: '',
        },
        roles: [],
        showModal: false,
        editingIndex: null,
      };
    },
    mounted() {
      this.fetchRoles();
    },
    methods: {
      handleSubmit() {
        if (this.$refs.form.validate()) {
          this.loading = true;
          if (this.editingIndex === null) {
            // Add new role
            axios
              .post('http://localhost:8080/parking_occupant/api/AddRole.php', this.formData, {
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              .then((response) => {
                console.log('Registration successful:', response.data);
                alert('Role added successfully');
                this.resetForm();
                this.loading = false;
                this.closeModal();
                this.fetchRoles();
              })
              .catch((error) => {
                console.error('Registration failed:', error.response ? error.response.data : error.message);
                alert('Role addition failed: ' + (error.response ? error.response.data.error : error.message));
                this.loading = false;
              });
          } else {
            // Update existing role
            const Role_ID = this.roles[this.editingIndex].Role_ID; // Corrected to Role_ID
            axios
              .put(`http://localhost:8080/parking_occupant/api/UpdateRole.php?id=${Role_ID}`, this.formData, {
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              .then((response) => {
                console.log('Update successful:', response.data);
                alert('Role updated successfully');
                this.resetForm();
                this.loading = false;
                this.closeModal();
                this.fetchRoles();
              })
              .catch((error) => {
                console.error('Update failed:', error.response ? error.response.data : error.message);
                alert('Role update failed: ' + (error.response ? error.response.data.error : error.message));
                this.loading = false;
              });
          }
        }
      },
      resetForm() {
        this.$refs.form.reset();
        this.editingIndex = null;
      },
      closeModal() {
        this.showModal = false;
        this.resetForm();
      },
      fetchRoles() {
        axios
          .get('http://localhost:8080/parking_occupant/api/FetchRoles.php')
          .then((response) => {
            if (response.data.success) {
              this.roles = response.data.roles;
            } else {
              console.error('Error fetching roles:', response.data.error);
            }
          })
          .catch((error) => {
            console.error('Error fetching roles:', error);
          });
      },
      editRole(index) {
        this.editingIndex = index;
        this.formData.role = this.roles[index].Role; // Adjust to use actual role data
        this.showModal = true;
      },

      deleteRole(Role_ID) {
            console.log('Deleting role with ID:', Role_ID);
            axios
                .delete(`http://localhost:8080/parking_occupant/api/DeleteRole.php?id=${Role_ID}`)
                .then((response) => {
                    console.log(response.data);
                    if (response.data.success) {
                        alert(response.data.message); // Show success message
                        this.fetchRoles(); // Refresh roles list after deletion
                    } else {
                        alert('Delete failed: ' + response.data.error); // Show error message
                    }
                })
                .catch((error) => {
                    console.error('Delete failed:', error);
                    alert('Delete failed: ' + error.message);
                });
        },

    },
  };
  </script>
  
  <style scoped>
  .v-card {
    margin: auto;
    margin-top: 20px;
    padding: 20px;
  }
  
  .primary.darken-1 {
    background-color: #1976d2 !important;
  }
  
  .white--text {
    color: #ffffff !important;
  }
  </style>
  

  