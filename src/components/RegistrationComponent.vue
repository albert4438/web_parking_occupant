<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-card-title class="headline primary--text">
        <v-icon left class="mr-2">mdi-account-plus</v-icon> Add Occupant
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row>
              <!-- Role dropdown -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.role"
                  :items="roles"
                  label="Role"
                  required
                  @change="handleRoleChange"
                  outlined
                ></v-select>
              </v-col>

              <!-- Basic Fields -->
              <v-col cols="12" sm="6">
                <v-text-field v-model="formData.firstName" label="First Name" required outlined></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formData.middleName" label="Middle Name" outlined></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formData.lastName" label="Last Name" required outlined></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formData.birthdate" label="Birthdate" type="date" required outlined></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formData.phonenumber" label="Phone Number" required outlined></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="formData.address" label="Address" required outlined></v-textarea>
              </v-col>

              <!-- Image Picker -->
              <v-col cols="12" sm="6">
                <v-file-input
                  v-model="formData.image"
                  label="Upload Image"
                  accept="image/*"
                  @change="handleImageUpload"
                  required
                  outlined
                  :disabled="imagePreview !== null"
                ></v-file-input>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn color="primary" @click="openCameraDialog" :disabled="formData.image !== null">
                  <v-icon left>mdi-camera</v-icon> Take Picture
                </v-btn>
              </v-col>

              <!-- Image Preview -->
              <v-col cols="12" class="d-flex justify-center">
                <v-img v-if="imagePreview" :src="imagePreview" alt="Captured Image" max-width="150" max-height="150" class="image-preview"></v-img>
                <p v-else class="text-center">No image uploaded or captured</p>
                <v-btn v-if="imagePreview" color="error" @click="clearImage">
                  <v-icon left>mdi-close-circle</v-icon> Clear Image
                </v-btn>
              </v-col>

              <!-- Additional Fields for Admin/Guard -->
              <v-col cols="12" sm="6" v-if="showAdditionalFields">
                <v-text-field v-model="formData.username" label="Username" required outlined></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" v-if="showAdditionalFields">
                <v-text-field v-model="formData.password" label="Password" type="password" required outlined></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" v-if="showAdditionalFields">
                <v-select v-model="formData.jobTitle" :items="jobTitles" label="Job Title" required outlined></v-select>
              </v-col>
              <v-col cols="12" sm="6" v-if="showAdditionalFields">
                <v-select v-model="formData.status" :items="statuses" label="Status" required outlined></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="handleSubmit" :disabled="!valid">
          <v-icon left>mdi-content-save</v-icon> Save
        </v-btn>
        <v-btn color="error" @click="handleCancel">
          <v-icon left>mdi-close-circle</v-icon> Cancel
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Camera Dialog -->
    <v-dialog v-model="cameraDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline primary--text">
          <v-icon left class="mr-2">mdi-camera</v-icon> Capture Image
        </v-card-title>
        <v-card-text>
          <video ref="video" width="100%" autoplay></video>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="captureImage" :disabled="formData.image !== null">
            <v-icon left>mdi-camera</v-icon> Capture
          </v-btn>
          <v-btn color="error" @click="closeCameraDialog">
            <v-icon left>mdi-close-circle</v-icon> Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddOccupantModal',
  data() {
    return {
      dialog: false,
      cameraDialog: false,
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
        image: null,
      },
      imagePreview: null,
      roles: [],
      jobTitles: ['Security Guard', 'Administrator'],
      statuses: ['Active', 'Inactive'],
      showAdditionalFields: false,
      videoStream: null,
    };
  },
  mounted() {
    this.fetchRoles();
  },
  beforeDestroy() {
    this.stopCamera();
  },
  methods: {
    async handleSubmit() {
    if (this.$refs.form.validate()) {
      this.isSubmitting = true;

      let base64Image = null;
      if (this.formData.image) {
        base64Image = await this.convertImageToBase64(this.formData.image);
      }

      const payload = { ...this.formData, image: base64Image };

      axios
        .post('http://localhost:8080/parking_occupant/api/registerOccupant.php', payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log('Registration successful:', response.data);
          alert('Registration successful');
          this.$emit('refreshList');
          this.dialog = false;
          this.resetFormData();
        })
        .catch((error) => {
          console.error('Registration failed:', error.response ? error.response.data : error.message);
          alert('Registration failed: ' + (error.response ? error.response.data.error : error.message));
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    }
  },

    handleRoleChange() {
      this.showAdditionalFields = this.formData.role === 'Administrator' || this.formData.role === 'Security Guard';
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

    resetFormData() {
      this.formData = {
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
        image: null,
      };
      this.imagePreview = null;
    },



    handleImageUpload(event) {
    const file = event.target.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file && validTypes.includes(file.type) && file.size <= maxSize) {
        const reader = new FileReader();
        reader.onloadend = () => {
            this.formData.image = reader.result.split(',')[1]; // Get base64 encoded string
            this.createImagePreview(file);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Invalid file type or size. Please select a JPEG, PNG, or JPG image under 5MB.');
    }
},


    createImagePreview(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    async convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result.split(',')[1]); // Only the base64 part
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  },

    openCameraDialog() {
      this.cameraDialog = true;
      this.initializeCamera();
    },

    closeCameraDialog() {
      this.cameraDialog = false;
      this.stopCamera();
    },

    initializeCamera() {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.videoStream = stream;
          this.$refs.video.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
          alert('Could not access camera. Please check your device settings.');
        });
    },

    stopCamera() {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach((track) => track.stop());
        this.videoStream = null;
      }
    },

    captureImage() {
      const video = this.$refs.video;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        this.formData.image = blob;
        this.createImagePreview(blob);
        this.cameraDialog = false;
        this.stopCamera();
      }, 'image/jpeg');
    },

    clearImage() {
      this.formData.image = null;
      this.imagePreview = null;
    },    

      handleCancel() {
        this.dialog = false;
        this.resetFormData();
      },
  },
};
</script>

<style scoped>
.image-preview {
  border-radius: 50%;
  margin-top: 10px;
}
</style>
