<template>
  <div>
    <!-- Main Card for Logo Upload/Change -->
    <v-card class="pa-4">
      <!-- <v-card-title class="headline">Upload or Change School Logo</v-card-title> -->
      <v-card-text>
        <!-- File Input for Logo Selection -->
        <v-file-input
          ref="fileInput"
          v-model="logoFile"
          label="Choose a logo"
          accept="image/jpeg, image/png, image/jpg"
          :error-messages="fileError"
          :disabled="logoExists && !isChangingLogo"
          @change="handleImageUpload"
          class="mb-4"
        ></v-file-input>

        <!-- Upload/Change Button -->
        <v-btn
          :disabled="!logoFile || isUploading || (logoExists && !isChangingLogo)"
          @click="showConfirmationDialog"
          color="primary"
        >
          {{ isChangingLogo ? 'Change Logo' : 'Upload Logo' }}
        </v-btn>

        <!-- Button to Change Existing Logo -->
        <v-btn
          v-if="logoExists && !isChangingLogo"
          @click="confirmChangeLogo"
          color="secondary"
        >
          Change Existing Logo
        </v-btn>

        <!-- Upload Progress and Error Messages -->
        <v-progress-linear
          v-if="isUploading"
          indeterminate
          color="blue"
          class="mt-3 mb-3"
        ></v-progress-linear>
        <v-alert v-if="uploadError" type="error">{{ uploadError }}</v-alert>
      </v-card-text>
    </v-card>

    <!-- Display the Current Logo or Message -->
    <v-card v-if="logoUrl || noLogoMessage" class="mt-4 pa-4">
      <v-card-title class="headline">Uploaded Logo</v-card-title>
      <v-card-text>
        <img v-if="logoUrl" :src="logoUrl" alt="School Logo" class="logo-preview">
        <v-alert v-else type="info">{{ noLogoMessage }}</v-alert>
      </v-card-text>
    </v-card>

    <!-- Confirmation Dialog for Uploading or Changing Logo -->
    <v-dialog v-model="showDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">{{ isChangingLogo ? 'Confirm Change Logo' : 'Confirm Upload Logo' }}</v-card-title>
        <v-card-text>
          <p v-if="isChangingLogo">
            Are you sure you want to change the existing logo? This action will replace the current logo.
          </p>
          <p v-else>
            Are you sure you want to upload this logo? 
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="uploadLogo">Confirm</v-btn>
          <v-btn @click="showDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog for Changing Existing Logo -->
    <v-dialog v-model="showChangeDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Change Existing Logo</v-card-title>
        <v-card-text>
          <p>Are you sure you want to change the existing logo? This action will replace the current logo.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="startChangingLogo">Confirm</v-btn>
          <v-btn @click="showChangeDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'QRLogo',
  data() {
    return {
      logoFile: null,
      logoUrl: '',
      isUploading: false,
      uploadError: '',
      fileError: '',
      showDialog: false,
      showChangeDialog: false,
      noLogoMessage: 'No logo is currently stored in the database.',
      logoExists: false,
      isChangingLogo: false,
    };
  },
  async mounted() {
    this.fetchExistingLogo();
  },
  methods: {

    async fetchExistingLogo() {
      try {
        const response = await axios.get('http://localhost:8080/parking_occupant/api/getLogo.php');
        console.log('API Response:', response.data);

        if (response.data && response.data.logoData) {
          this.logoUrl = `data:image/png;base64,${response.data.logoData}`;
          this.noLogoMessage = '';
          this.logoExists = true;
        } else {
          this.logoUrl = '';
          this.noLogoMessage = 'No logo is currently stored in the database.';
          this.logoExists = false;
        }
      } catch (error) {
        this.uploadError = `Error fetching logo: ${error.message}`;
        this.logoUrl = '';
        this.noLogoMessage = 'No logo is currently stored in the database.';
        this.logoExists = false;
        console.log('Fetch error:', error.message);
      }
    },

    resetError() {
      this.uploadError = '';
      this.fileError = '';
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      this.resetError();

      if (file && validTypes.includes(file.type) && file.size <= maxSize) {
        this.logoFile = file;
      } else {
        this.fileError = 'Invalid file type or size. Please select a JPEG, PNG, or JPG image under 5MB.';
        this.logoFile = null;
      }
    },

    showConfirmationDialog() {
      if (this.logoFile) {
        this.showDialog = true;
      } else {
        this.fileError = 'Please select a valid file.';
      }
    },

    confirmChangeLogo() {
      this.showChangeDialog = true;
    },

    async uploadLogo() {
      this.isUploading = true;
      this.uploadError = '';
      this.showDialog = false;

      const formData = new FormData();
      formData.append('logo', this.logoFile);

      try {
        const url = this.isChangingLogo
          ? 'http://localhost:8080/parking_occupant/api/changeLogo.php'
          : 'http://localhost:8080/parking_occupant/api/uploadLogo.php';
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          this.fetchExistingLogo();
          this.isChangingLogo = false;
        } else {
          this.uploadError = `Error uploading logo: ${response.data.error}`;
        }
      } catch (error) {
        this.uploadError = `Error uploading logo: ${error.message}`;
      } finally {
        this.isUploading = false;
      }
    },

    startChangingLogo() {
      this.isChangingLogo = true;
      this.showChangeDialog = false;
      this.$refs.fileInput.click(); // Trigger the file input click to select a new file
    },
  },
};
</script>

<style scoped>
.v-card {
  max-width: 1100px;
  margin: auto;
}

.v-file-input {
  max-width: 400px;
}

.v-btn {
  margin-right: 8px;
}

.logo-preview {
  width: 100%;
  max-width: 150px; /* Adjusted size */
  height: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  object-fit: cover; /* Maintain aspect ratio */
}
</style>
