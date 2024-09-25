<template>
  <div>
    <!-- Main Card for Logo and Institution Name -->
    <v-card class="pa-1">
      <v-card-text>
        <!-- Display Institutional Name and Logo together -->
        <v-row>
          <v-col cols="6">
            <!-- Institutional Name Field -->
            <v-text-field
              ref="institutionNameInput"
              v-model="institutionName"
              label="Institution Name"
              :rules="institutionNameRules"
              :disabled="!isConfirmed"
              required
              class="mb-4"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <!-- File Input for QR Logo Upload -->
            <v-file-input
              ref="fileInput"
              v-model="logoFile"
              label="Choose QR Logo"
              accept="image/jpeg, image/png, image/jpg"
              :error-messages="fileError"
              :disabled="!isConfirmed"
              @change="handleImageUpload"
              class="mb-4"
              outlined
            ></v-file-input>
          </v-col>
        </v-row>

        <!-- Dynamic Add/Edit Button -->
        <v-btn
          :disabled="!isConfirmed || (!changesMade && (!logoFile && institutionName === originalInstitutionName))"
          @click="addOrEdit"
          color="primary"
        >
        <v-icon left>mdi-content-save</v-icon> {{ buttonText }}
        </v-btn>

        <!-- cancel button only -->
        <v-btn
          :disabled="!isConfirmed"
          @click="cancelChanges"
          color="error"
          class="ml-2"
        >
        <v-icon left>mdi-close-circle</v-icon> Cancel
        </v-btn>

        <!-- Confirmation Dialog Button -->
        <v-btn @click="triggerConfirmationDialog" :disabled="confirmDisabled" color="secondary" class="ml-4">
          <v-icon left>mdi-check</v-icon> {{ confirmButtonText }}
        </v-btn>

      </v-card-text>
    </v-card>

    <!-- Display Current Logo and Institutional Name if they exist -->
    <v-card class="mt-4 pa-2">
      <v-card-title class="headline">Current Institution Name and Logo</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-alert v-if="!institutionNameExists && !logoUrl" type="info">No institution name and logo currently stored</v-alert>
            <v-alert v-else-if="!institutionNameExists" type="info">No institution name currently stored</v-alert>
            <v-alert v-else-if="!logoUrl" type="info">No logo currently stored</v-alert>
            <v-row v-else>
              <v-col cols="6">
                <v-alert type="info">Institution Name: {{ institutionName }}</v-alert>
              </v-col>
              <v-col cols="6">
                <img :src="logoUrl" alt="QR Logo" class="logo-preview">
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="showDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title class="headline">Confirm Changes</v-card-title>
        <v-card-text>
          Are you sure you want to {{ buttonText.toLowerCase() }} the QR Logo and Institutional Name?
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="confirmChanges">Confirm</v-btn>
          <v-btn @click="showDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="500" persistent>
      <v-card class="success-dialog">
            <v-card-title class="headline success-title">Success!</v-card-title>
            <v-card-text class="success-text">
              <v-icon large class="success-icon">mdi-check-circle</v-icon>
              <p>Saved successfully!</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="success-button" color="success" @click="showSuccessDialog(); successDialog = false">Close</v-btn>
            </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- error dialog for image too large  -->
    <v-dialog v-model="errorDialog" max-width="500" persistent>
      <v-card class="error-dialog">
        <v-card-title class="headline error-title">Oops!</v-card-title>
        <v-card-text class="error-text">
          <v-icon large class="error-icon">mdi-alert-octagon</v-icon>
          <p>The logo image is too large to be uploaded. Please upload a smaller image and try again.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="errorDialog = false" class="error-button">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      errorDialog: false,
      successDialog: false, 
      logoFile: null,
      logoUrl: '',
      institutionName: '',
      originalInstitutionName: '',
      isConfirmed: false,
      showDialog: false,
      confirmDisabled: false, // Control the confirmation button state
      disableFileInput: false, // Control the file input state
      institutionNameExists: false,
      logoExists: false,
      changesMade: false,
      fileError: '',
      institutionNameRules: [v => !!v || 'Institution Name is required'],
    };
  },

  computed: {
    buttonText() {
      if (!this.institutionNameExists && !this.logoExists) {
        return 'ADD';
      }
      return 'EDIT';
    },

    confirmButtonText() {
      if (!this.institutionNameExists && !this.logoExists) {
        return 'Confirm Add';
      } else {
        return 'Confirm Change';
      }
    },
  },

  async mounted() {
    // Fetch existing logo and institution name
    await this.fetchExistingLogo();
    await this.fetchInstitutionName();
    this.updateConfirmButtonState();
  },

  methods: {
    // Fetch the existing logo from the API
    async fetchExistingLogo() {
      try {
        const response = await axios.get('http://localhost:8080/parking_occupant/api/getLogo.php');
        if (response.data && response.data.logoData) {
          this.logoUrl = `data:image/png;base64,${response.data.logoData}`;
          this.logoExists = true;
        } else {
          this.logoUrl = '';
          this.logoExists = false;
        }
      } catch (error) {
        this.logoExists = false;
        console.error('Error fetching logo:', error.message);
      }
    },

    // Fetch the existing institution name from the API
    async fetchInstitutionName() {
      try {
        const response = await axios.get('http://localhost:8080/parking_occupant/api/institution_name.php?action=getInstitutionName');
        if (response.data && response.data.institution_name) {
          this.institutionName = response.data.institution_name;
          this.institutionNameExists = true;
        } else {
          this.institutionNameExists = false;
        }
      } catch (error) {
        console.error('Error fetching institution name:', error.message);
      }
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
        this.logoFile = file;
        this.changesMade = true;
      } else {
        this.fileError = 'Invalid file type. Select JPEG or PNG';
      }
    },

    triggerConfirmationDialog() {
      this.showDialog = true;
    },

    confirmChanges() {
      this.isConfirmed = true;
      this.showDialog = false;
      this.confirmDisabled = true;
    },

    // async addOrEdit() {
    //   // Check if either QR Logo or Institution Name is missing
    //   if (!this.logoFile && !this.logoExists) {
    //     this.errorMessage = 'QR Logo is required.';
    //     this.showErrorDialog(); // Trigger the error dialog
    //     return;
    //   }

    //   if (!this.institutionName) {
    //     this.errorMessage = 'Institutional Name is required.';
    //     this.showErrorDialog(); // Trigger the error dialog
    //     return;
    //   }

    //   // Continue with the existing add or edit logic if both fields are filled
    //   if (this.logoFile) {
    //     // Handle logo upload or change
    //     const formData = new FormData();
    //     formData.append('logo', this.logoFile);

    //     try {
    //       const url = this.logoExists
    //         ? 'http://localhost:8080/parking_occupant/api/changeLogo.php'
    //         : 'http://localhost:8080/parking_occupant/api/uploadLogo.php';
    //       const response = await axios.post(url, formData, {
    //         headers: { 'Content-Type': 'multipart/form-data' },
    //       });

    //       if (response.data.success) {
    //         await this.fetchExistingLogo();
    //         this.isChangingLogo = false;
    //       } else {
    //         console.log(response.data.error);
    //         this.showErrorDialog(`Error: ${response.data.error} -Buang 3 Please try again!`);
    //         this.uploadError = `Error uploading logo: ${response.data.error}`;
    //       }
    //     } catch (error) {
    //       console.log(error.message);
    //       this.uploadError = `Error uploading logo: ${error.message}`;
    //     }
    //   }

    //   if (this.institutionName) {
    //     // Handle institution name save or change
    //     const endpoint = this.institutionNameExists
    //       ? 'http://localhost:8080/parking_occupant/api/institution_name.php?action=updateInstitutionName'
    //       : 'http://localhost:8080/parking_occupant/api/institution_name.php?action=uploadInstitutionName';
    //     const payload = { institution_name: this.institutionName };

    //     try {
    //       const response = await axios.post(endpoint, payload, {
    //         headers: { 'Content-Type': 'application/json' },
    //       });

    //       if (response.data.success) {
    //         this.saveSuccess = true;
    //         this.institutionNameExists = true;
    //       } else {
    //         console.log(response.data.error);
    //         this.saveError = `Error: ${response.data.error}`;
    //       }
    //     } catch (error) {
    //       console.log(error.message);
    //       this.saveError = `Error saving institution name: ${error.message}`;
    //     }
    //   }

    //     // If changes are successful, disable the Add/Edit button and show success dialog
    //     this.changesMade = false;
    //     this.successDialog = true;  // Trigger a success dialog or alert
    //     this.disableFileInput = true; // Disable file input again
    // },

    async addOrEdit() {
      let logoUploadSuccess = true;  // Assume success for the logo by default
      let institutionNameSuccess = true;  // Assume success for the institution name by default

      // Check if either QR Logo or Institution Name is missing
      if (!this.logoFile && !this.logoExists) {
        this.errorMessage = 'QR Logo is required.';
        return;
      }

      if (!this.institutionName) {
        this.errorMessage = 'Institutional Name is required.';
        return;
      }

      // Continue with the existing add or edit logic if both fields are filled
      if (this.logoFile) {
        // Handle logo upload or change
        const formData = new FormData();
        formData.append('logo', this.logoFile);

        try {
          const url = this.logoExists
            ? 'http://localhost:8080/parking_occupant/api/changeLogo.php'
            : 'http://localhost:8080/parking_occupant/api/uploadLogo.php';
          const response = await axios.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          if (response.data.success) {
            await this.fetchExistingLogo();
            this.isChangingLogo = false;
          } else {
            console.log(response.data.error);
            //error messeage when the size of image/logo upload is super big
            this.showErrorDialog();
            this.uploadError = `Error uploading logo: ${response.data.error}`;
            logoUploadSuccess = false;  // Mark as failure if an error occurs
          }
        } catch (error) {
          console.log(error.message);
          this.uploadError = `Error uploading logo: ${error.message}`;
          logoUploadSuccess = false;  // Mark as failure in case of an exception
        }
      }

      if (this.institutionName) {
        // Handle institution name save or change
        const endpoint = this.institutionNameExists
          ? 'http://localhost:8080/parking_occupant/api/institution_name.php?action=updateInstitutionName'
          : 'http://localhost:8080/parking_occupant/api/institution_name.php?action=uploadInstitutionName';
        const payload = { institution_name: this.institutionName };

        try {
          const response = await axios.post(endpoint, payload, {
            headers: { 'Content-Type': 'application/json' },
          });

          if (response.data.success) {
            this.saveSuccess = true;
            this.institutionNameExists = true;
          } else {
            console.log(response.data.error);
            this.showErrorDialog(`Error: ${response.data.error} - Please try again!`);
            this.saveError = `Error: ${response.data.error}`;
            institutionNameSuccess = false;  // Mark as failure if an error occurs
          }
        } catch (error) {
          console.log(error.message);
          this.saveError = `Error saving institution name: ${error.message}`;
          institutionNameSuccess = false;  // Mark as failure in case of an exception
        }
      }

      // If both operations were successful, show success dialog
      if (logoUploadSuccess && institutionNameSuccess) {
        this.changesMade = false;
        this.successDialog = true;  // Trigger success dialog
        this.disableFileInput = true; // Disable file input again
      }
    },

    showErrorDialog() {
      this.errorDialog = true; // Assuming `errorDialog` is bound to v-dialog in your template
    },

    showSuccessDialog() {
      this.confirmDisabled = false;
      this.isConfirmed = false;
      //this.showSuccessDialog = false;
    },

    updateConfirmButtonState() {
      // Enable the button if the institution name or logo doesn't exist
      if (!this.institutionNameExists || !this.logoExists) {
        this.confirmDisabled = false;  // Enable the button
      } else {
        this.confirmDisabled = false;  // Keep it enabled for "Confirm Change"
      }
    },

    cancelChanges() {
      // Restore the original values of institution name and logo
      this.institutionName = this.originalInstitutionName;  // Restore the institution name
      this.logoFile = null;  // Reset the file input
      this.logoUrl = '';  // Reset the logo preview if necessary

      // Optionally re-fetch the original logo if it exists
      if (this.logoExists) {
        this.fetchExistingLogo();  // Re-fetch the logo from the database
      }

      // Reset other states
      this.isConfirmed = false;
      this.confirmDisabled = false;  // Re-enable the confirm button if needed
      this.fetchExistingLogo();
      this.fetchInstitutionName();
    },

  },
};
</script>

<style scoped>
/* .v-card {
  max-width: 800px;
  margin: auto;
} */

.logo-preview {
  max-width: 85px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error-dialog {
  border: 1px solid #d32f2f; /* Red border for emphasis */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
}

.error-title {
  color: #d32f2f; /* Red title to match the theme */
  font-weight: bold;
}

.error-text {
  display: flex;
  align-items: center;
  font-size: 16px; /* adjust the value to your desired font size */
}

.error-icon {
  color: #d32f2f; /* Matching icon color */
  margin-right: 16px; /* Spacing between icon and text */
}

.error-button {
  background-color: #d32f2f; /* Red background for the button */
  color: white;
}

.success-dialog {
  border: 1px solid #388e3c; /* Green border for success */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
}

.success-title {
  color: #388e3c; /* Green title to match the theme */
  font-weight: bold;
}

.success-text {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.success-icon {
  color: #388e3c; /* Matching icon color */
  margin-right: 16px; /* Spacing between icon and text */
}

.success-button {
  background-color: #388e3c; /* Green background for the button */
  color: white;
}

.success-button:hover {
  background-color: #2c6d2f; /* Darker shade on hover */
}
</style>
