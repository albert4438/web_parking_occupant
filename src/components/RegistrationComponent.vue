<template>
  <v-dialog v-model="dialog" max-width="2000px">
    <v-card>
      <v-card-title class="headline primary--text">
        <v-icon left class="mr-2">mdi-account-plus</v-icon> Add Occupant
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row>
              <!-- First Row -->
              <v-col cols="12" sm="3">
                <v-select
                  v-model="formData.role"
                  :items="roles"
                  label="Role"
                  required
                  :rules="[v => !!v || 'Select Role']"
                  @change="handleRoleChange"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model="formData.firstName" label="First Name" required :rules="[v => !!v || 'First Name is required']" outlined></v-text-field>
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model="formData.middleName" label="Middle Name" outlined></v-text-field>
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model="formData.lastName" label="Last Name" required :rules="[v => !!v || 'Last Name is required']" outlined></v-text-field>
              </v-col>

              <!-- Second Row -->
              <v-col cols="12" sm="4">
                <v-text-field v-model="formData.birthdate" label="Birthdate" type="date" required :rules="[v => !!v || 'Required']" outlined></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="formData.phonenumber"
                  label="Phone Number"
                  required
                  type="number"
                  :rules="[
                    v => !!v || 'Phone Number is required',
                    v => /^[0-9]+$/.test(v) || 'Phone Number must be an integer'
                  ]"
                  outlined
                  @keydown="restrictKeydown"
                  @input="restrictInput"
                ></v-text-field>
              </v-col>



              <v-col cols="12" sm="4">
                <v-select
                  v-model="formData.region"
                  :items="regions"
                  item-value="region_slug"
                  item-text="region_name"
                  label="Region"
                  @change="loadProvinces"
                  required
                  :rules="[v => !!v || 'Required']"
                  outlined
                ></v-select>
              </v-col>

              <!-- Third Row -->
              <v-col cols="12" sm="4">
                <v-select
                  v-model="formData.province"
                  :items="provinces"
                  item-value="province_slug"
                  item-text="province"
                  label="Province"
                  @change="loadMunicipalities"
                  required
                  :rules="[v => !!v || 'Required']"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="formData.municipality"
                  :items="municipalities"
                  item-value="municipality_slug"
                  item-text="municipality"
                  label="Municipality"
                  @change="loadBarangays"
                  required
                  :rules="[v => !!v || 'Required']"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="formData.barangay"
                  :items="barangays"
                  item-value="barangay_slug"
                  item-text="barangay"
                  label="Barangay"
                  required
                  :rules="[v => !!v || 'Required']"
                  outlined
                ></v-select>
              </v-col>

              <!-- Last Row - Image Upload -->
              <v-row align="center">
                <v-col cols="12" sm="3">
                  <v-file-input
                    v-model="formData.image"
                    label="Upload Image"
                    accept="image/*"
                    @change="handleImageUpload"
                    required
                    :rules="[v => !!v || 'Required']"
                    outlined
                    :disabled="imagePreview !== null"
                  ></v-file-input>
                </v-col>

                <!-- Button for Taking Picture -->
                <v-col cols="12" sm="3" class="d-flex align-center">
                  <v-btn color="primary" @click="openCameraDialog" :disabled="formData.image !== null">
                  <v-icon left>mdi-camera</v-icon> Take Picture
                </v-btn>
                </v-col>

                <!-- Image Preview -->
                <v-col cols="12" sm="3" class="d-flex align-center">
                  <v-img
                    v-if="imagePreview"
                    :src="imagePreview"
                    alt="Captured Image"
                    max-width="150"
                    max-height="150"
                    class="image-preview"
                    aspect-ratio="1"
                  ></v-img>
                  <p v-else class="text-center">No image uploaded or captured</p>
                </v-col>

                <!-- Clear Image Button -->
                <v-col cols="12" sm="3" class="d-flex align-center">
                  <v-btn v-if="imagePreview" color="error" @click="clearImage">
                    <v-icon left>mdi-close-circle</v-icon> Clear Image
                  </v-btn>
                </v-col>
              </v-row>


              <!-- Additional Fields for Admin/Guard -->
              <v-row v-if="showAdditionalFields">
                <v-col cols="12" sm="3">
                  <v-text-field v-model="formData.username" label="Username" required :rules="[v => !!v || 'Username is required']" outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field v-model="formData.password" label="Password" type="password" required :rules="[v => !!v || 'Password is required']" outlined></v-text-field>
                </v-col>

                <!-- Job Title Select -->
                <v-col cols="12" sm="3">
                  <v-select 
                    v-model="formData.jobTitle" 
                    :items="jobTitles" 
                    label="Job Title" 
                    required 
                    :rules="[v => !!v || 'Job Title is Required']" 
                    outlined
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="3">
                  <v-select v-model="formData.status" :items="statuses" label="Status" required :rules="[v => !!v || 'Status is required']" outlined></v-select>
                </v-col>
              </v-row>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="handleSubmit" :disabled="!isValidForm">
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
import addressData from '@/assets/philippine_provinces_cities_municipalities_and_barangays_2016.json';


export default {
  name: 'AddOccupantModal',

  data() {
    return {
      dialog: false,
      cameraDialog: false,
      valid: true,
      formData: {
        role: 'Student',
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        password: '',
        birthdate: '',
        region: null,
        province: null,
        municipality: null,
        barangay: null,
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
      regions: [],
      provinces: [],
      municipalities: [],
      barangays: [],
    };
  },  

  computed: {
    isValidForm() {
      return (
        this.formData.role &&
        this.formData.firstName &&
        this.formData.lastName &&
        this.formData.birthdate &&
        this.formData.region &&
        this.formData.province &&
        this.formData.municipality &&
        this.formData.barangay &&
        this.formData.phonenumber &&
        (this.formData.role === 'Administrator' || this.formData.role === 'Security Guard'
          ? this.formData.username && this.formData.password && this.formData.jobTitle && this.formData.status
          : true) &&
        this.formData.image
      );
    },
  },

  mounted() {
    this.loadRegions();
    this.fetchRoles();
  },

  beforeDestroy() {
    this.stopCamera();
  },

  methods: {
    loadProvinces() {
      const selectedRegion = this.regions.find(r => r.region_slug === this.formData.region);
      if (!selectedRegion) return;

      const regionKey = Object.keys(addressData).find(
        key => addressData[key].region_name === selectedRegion.region_name
      );

      if (!regionKey) return;

      const region = addressData[regionKey];
      this.provinces = Object.keys(region.province_list).map(provinceName => ({
        province_slug: provinceName.toLowerCase().replace(/ /g, '-'),
        province: provinceName,
      }));

      // Reset dependent fields
      this.formData.province = null;
      this.formData.municipality = null;
      this.formData.barangay = null;
      this.municipalities = [];
      this.barangays = [];
    },

    loadMunicipalities() {
      const selectedProvince = this.provinces.find(p => p.province_slug === this.formData.province);
      if (!selectedProvince) return;

      const selectedRegion = this.regions.find(r => r.region_slug === this.formData.region);
      if (!selectedRegion) return;

      const regionKey = Object.keys(addressData).find(
        key => addressData[key].region_name === selectedRegion.region_name
      );

      if (!regionKey) return;

      const region = addressData[regionKey];
      const province = region.province_list[selectedProvince.province];

      if (!province) return;

      this.municipalities = province.municipality_list.map(municipality => {
        const municipalityName = Object.keys(municipality)[0];
        return {
          municipality_slug: municipalityName.toLowerCase().replace(/ /g, '-'),
          municipality: municipalityName,
        };
      });

      // Reset dependent fields
      this.formData.municipality = null;
      this.formData.barangay = null;
      this.barangays = [];
    },

    loadBarangays() {
      const selectedMunicipality = this.municipalities.find(m => m.municipality_slug === this.formData.municipality);
      if (!selectedMunicipality) return;

      const selectedProvince = this.provinces.find(p => p.province_slug === this.formData.province);
      const selectedRegion = this.regions.find(r => r.region_slug === this.formData.region);

      if (!selectedProvince || !selectedRegion) return;

      const regionKey = Object.keys(addressData).find(
        key => addressData[key].region_name === selectedRegion.region_name
      );

      if (!regionKey) return;

      const region = addressData[regionKey];
      const province = region.province_list[selectedProvince.province];
      const municipalityData = province.municipality_list.find(
        m => Object.keys(m)[0] === selectedMunicipality.municipality
      );

      if (!municipalityData) return;

      this.barangays = municipalityData[selectedMunicipality.municipality].barangay_list.map(barangay => ({
        barangay_slug: barangay.toLowerCase().replace(/ /g, '-'),
        barangay,
      }));

      this.formData.barangay = null;
    },

    formatAddress(address) {
      return address.split(',').map(part => {
        return part.trim().split('-').map(word => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }).join('-');
      }).join(', ');
    },

    async handleSubmit() {
      if (this.$refs.form.validate()) {
        this.isSubmitting = true;

        let base64Image = null;
        if (this.formData.image) {
          base64Image = await this.convertImageToBase64(this.formData.image);
        }

        // Fetch region name and convert to uppercase
        const selectedRegion = this.regions.find(r => r.region_slug === this.formData.region);
        const regionName = selectedRegion ? selectedRegion.region_name.toUpperCase() : ''; // Convert region name to uppercase

        // Create the full address and format it
        const fullAddress = `${regionName}, ${this.formData.province}, ${this.formData.municipality}, ${this.formData.barangay}`;
        const formattedAddress = this.formatAddress(fullAddress);

        const payload = {
          ...this.formData,
          region_name: regionName, // Send uppercase region name
          address: formattedAddress,
          image: base64Image
        };

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
      if (this.formData.role === 'Administrator') {
        this.jobTitles = ['Admin', 'Manager', 'Supervisor', 'Coordinator'];
      } else if (this.formData.role === 'Security Guard') {
        this.jobTitles = ['Security Officer', 'Guard', 'Watchman'];
      } else {
        this.jobTitles = [];
      }
      this.formData.jobTitle = ''; // Clear the selected job title
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
        role: 'Student',
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        password: '',
        birthdate: '',
        region: null,
        province: null,
        municipality: null,
        barangay: null,
        phonenumber: '',
        jobTitle: '',
        status: '',
        image: null,
      };
      this.imagePreview = null;
      this.municipalities = [];
      this.barangays = [];
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
      this.formData.role = 'Student';
      this.showAdditionalFields = false;
    },

    validateInteger(event) {
      const value = event.target.value;
      // Remove non-numeric characters
      if (value !== '' && !/^[0-9]+$/.test(value)) {
        event.target.value = value.replace(/[^\d]/g, '');
        this.formData.phonenumber = event.target.value;
      }
    },
    
    restrictInput(event) {
      const input = event.target.value;
      // Check if input length is greater than 11
      if (input.length > 11) {
        event.target.value = input.slice(0, 11);  // Restrict to first 11 digits
        this.formData.phonenumber = input.slice(0, 11);  // Update v-model
      }
    },
    
    restrictKeydown(event) {
      const input = this.formData.phonenumber || '';
      
      // Allow navigation keys (arrows, backspace, delete)
      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
      
      if (input.length >= 11 && !allowedKeys.includes(event.key)) {
        event.preventDefault();  // Block any further input if length is 11
      }
    },

    loadRegions() {
      this.regions = Object.keys(addressData).map(regionKey => ({
        region_slug: regionKey.toLowerCase().replace(/ /g, '-'),
        region_name: addressData[regionKey].region_name,
      }));
    },

  },
};
</script>

<style scoped>
.image-preview {
  border-radius: 0;
  margin-top: 10px;
}
</style>
