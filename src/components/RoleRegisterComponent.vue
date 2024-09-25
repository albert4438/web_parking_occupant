<template>
  <v-container>
    <!-- Search Bar -->
    <v-text-field
      v-model="searchQuery"
      label="Search Role"
      class="mb-4"
      outlined
      prepend-inner-icon="mdi-magnify"
    ></v-text-field>

    <!-- Add Role Button -->
    <v-btn color="primary" @click="showModal = true" class="mb-4">
      <v-icon left>mdi-plus</v-icon>
      Add Role
    </v-btn>

    <!-- List of Roles -->
    <v-list>
      <div v-for="(role, index) in filteredRoles" :key="index" class="mb-2">
        <v-card outlined shaped>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ role }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <!-- <v-btn text color="primary" @click="editRole(index)">
                <v-icon left>mdi-pencil</v-icon>
                Edit
              </v-btn> -->
              <!-- <v-btn text color="error" @click="deleteRole(role)">
                <v-icon left>mdi-delete</v-icon>
                Delete
              </v-btn> -->
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </div>
    </v-list>

    <!-- Modal for Role Registration -->
    <v-dialog v-model="showModal" max-width="500" persistent>
      <v-card>
        <v-card-title class="primary darken-1 white--text" style="margin-bottom: 25px;">
          <v-icon left class="mr-4" style="color: white">mdi-account-group</v-icon>
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
              outlined
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            color="primary"
            @click="handleSubmit"
            :loading="loading"
            :disabled="!isFormValid"
          >
            <v-icon left>{{ editingIndex === null ? 'mdi-content-save' : 'mdi-pencil' }}</v-icon>
            {{ editingIndex === null ? 'Save' : 'Update' }}
          </v-btn>
          <v-btn color="error" @click="closeModal">
            <v-icon left>mdi-close-circle</v-icon>
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="500" persistent>
      <v-card class="success-dialog">
        <v-card-title class="headline success-title">Success!</v-card-title>
        <v-card-text class="success-text">
          <v-icon large class="success-icon">mdi-check-circle</v-icon>
          <p>{{ successMessage }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="closeSuccessDialog" class="success-button">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RoleRegisterComponent',
  data() {
    return {
      showModal: false,
      successDialog: false,
      successMessage: '',
      searchQuery: '',
      formData: {
        role: '',
      },
      valid: false,
      loading: false,
      editingIndex: null,
      roles: [], // Array of role names
    };
  },
  mounted() {
    this.fetchRoles();
  },
  computed: {
    filteredRoles() {
      return this.roles.filter(role =>
        role.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    isFormValid() {
      // Check if the form is valid based on role input
      return !!this.formData.role;
    },
  },
  methods: {
    handleSubmit() {
      if (this.isFormValid) {
        this.loading = true;
        if (this.editingIndex === null) {
          // Add new role
          axios.post('http://localhost:8080/parking_occupant/api/AddRole.php', this.formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            console.log('Registration successful:', response.data);
            this.successMessage = 'Role added successfully!';
            this.successDialog = true;
            this.fetchRoles();
            this.showModal = false;
            this.resetForm();
          })
          .catch((error) => {
            console.error('Registration failed:', error);
            alert('Role addition failed: ' + (error.response ? error.response.data.error : error.message));
          })
          .finally(() => {
            this.loading = false;
          });
        } else {
          // Update existing role
          const roleToUpdate = this.roles[this.editingIndex];
          axios.put(`http://localhost:8080/parking_occupant/api/UpdateRole.php?id=${roleToUpdate}`, this.formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            console.log('Update successful:', response.data);
            this.successMessage = 'Role updated successfully!';
            this.successDialog = true;
            this.resetForm();
            this.fetchRoles();
          })
          .catch((error) => {
            console.error('Update failed:', error);
            alert('Role update failed: ' + (error.response ? error.response.data.error : error.message));
          })
          .finally(() => {
            this.loading = false;
          });
        }
      }
    },
    resetForm() {
      this.$refs.form.reset();
      this.formData.role = '';
      this.editingIndex = null;
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    closeSuccessDialog() {
      this.successDialog = false;
    },
    fetchRoles() {
      axios.get('http://localhost:8080/parking_occupant/api/FetchRoles.php')
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
      this.formData.role = this.roles[index];
      this.showModal = true;
    },
    deleteRole(role) {
      axios.delete(`http://localhost:8080/parking_occupant/api/DeleteRole.php?role=${encodeURIComponent(role)}`)
        .then((response) => {
          if (response.data.success) {
            this.successMessage = 'Role deleted successfully!';
            this.successDialog = true;
            this.fetchRoles();
          } else {
            alert('Delete failed: ' + response.data.error);
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
.v-btn {
  text-transform: none;
}

.v-card {
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.v-list-item {
  border-bottom: none;
}

.success-dialog {
  border: 1px solid #388e3c;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.success-title {
  color: #388e3c;
  font-weight: bold;
}

.success-text {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.success-icon {
  color: #388e3c;
  margin-right: 16px;
}

.success-button {
  background-color: #388e3c;
  color: white;
}

.success-button:hover {
  background-color: #2c6d2f;
}
</style>
