<template>
  <div>
    <v-btn color="primary" @click="$router.push({ name: 'occupant' })" style="margin-bottom: 14px;">Back</v-btn>

    <v-form>
      <v-container grid-list-md class="profile-container">
        <v-layout row wrap align-center>
          <v-flex xs12 sm3 md3>
            <div class="profile-picture">
              <v-avatar size="200" class="blue-border">
                <img :src="profilePictureUrl" alt="Profile Picture">
              </v-avatar>
            </div>
          </v-flex>
          <v-flex xs12 sm9 md9>
            <div class="profile-info" style="text-align: left;">
              <h2>{{ profileFirstname }} {{ profileLastname }}
                <v-btn icon color="primary" class="edit-icon" v-if="canEditProfile" @click="editModal = true">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </h2>

              <div class="profile-detail">
                <v-icon small>mdi-cake</v-icon>
                Birthdate: {{ profileBirthdate }}
              </div>
              <div class="profile-detail">
                <v-icon small>mdi-map-marker</v-icon>
                Address: {{ profileAddress }}
              </div>
              <div class="profile-detail">
                <v-icon small>mdi-phone</v-icon>
                Phone Number: {{ profilePhonenumber }}
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>

    <v-flex xs12 md12>
      <v-card flat>
        <v-card-title>Occupant's Vehicles</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="searchVehicle"
            label="Search Vehicle"
            solo
            flat
            outlined
            dense
          />
          <v-data-table
            :headers="vehicleHeaders"
            :items="filteredVehicles"
            :loading="loadingVehicles"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.Vehicle_type }}</td>
                <td>{{ item.Vehicle_color }}</td>
                <td>{{ item.Vehicle_platenumber }}</td>
                <td>{{ item.Vehicle_model }}</td>
                <td>{{ item.Vehicle_brand }}</td>
                <td>
                  <v-btn small color="primary" class="ml-2" @click="showQRCodeModal(item)">QR Code</v-btn>
                  <!-- canEditVehicle -->
                  <v-btn small color="warning" class="ml-2" v-if="canEditVehicle" @click="editVehicle(item)">Edit</v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>

          <v-btn color="primary" v-if="canAddVehicle" @click="showAddVehicleForm = true">Add Vehicle</v-btn>

        </v-card-text>
      </v-card>
    </v-flex>

    <v-dialog v-model="showAddVehicleForm" max-width="500px">
  <v-card>
    <v-card-title>Add Vehicle</v-card-title>
    <v-card-text>
      <v-form>
        <v-layout wrap>
          <v-col cols="12" sm="6">
            <v-select
              v-model="selectedVehicleType"
              :items="vehicleTypeOptions"
              label="Vehicle Type"
              @change="updateVehicleBrands"
              required
              outlined
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="selectedVehicleBrand"
              :items="vehicleBrandOptions"
              label="Vehicle Brand"
              @change="updateVehicleModels"
              required
              outlined
              :disabled="!selectedVehicleType"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="vehicleModel"
              :items="vehicleModelOptions"
              label="Vehicle Model"
              required
              outlined
              :disabled="!selectedVehicleBrand"
              @change="handleModelChange"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-select
              v-model="vehicleColor"
              :items="colorOptions" 
              label="Vehicle Color"
              required
              outlined
              :disabled="!vehicleModel || !selectedVehicleType || !selectedVehicleBrand"

            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="vehiclePlateNumber"
              label="Plate Number"
              require
              outlined
              :disabled="!selectedVehicleType || !vehicleModel || !selectedVehicleBrand || !colorOptions"
            />
          </v-col>
          
        </v-layout>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" :disabled="!isFormValid" @click="addVehicle">Save</v-btn>
      <v-btn color="error" @click="resetForm(); showAddVehicleForm = false">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


<v-dialog v-model="QRCODEModal" max-width="500px">
  <v-card>
    <v-card-title class="headline">QR Code</v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-row align="center">
          <!-- QR Code Column -->
          <v-col cols="12" md="6" class="d-flex justify-center">
            <div v-if="qrCodeUrl">
              <img :src="qrCodeUrl" alt="QR Code" id="qrcode-to-print" />
            </div>
            <div v-else class="text-center">
              <p>No QR code available. Please click the 'Generate' button below.</p>
              <v-btn color="primary" v-if="canGenerateQRCode" @click="generateQrCode">Generate</v-btn>
            </div>
          </v-col>

          <!-- Vehicle Information Column -->
          <v-col cols="12" md="6" v-if="selectedVehicle">
            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title><strong>Vehicle Type:</strong></v-list-item-title>
                  <v-list-item-subtitle>{{ selectedVehicle.Vehicle_type }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title><strong>Vehicle Color:</strong></v-list-item-title>
                  <v-list-item-subtitle>{{ selectedVehicle.Vehicle_color }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title><strong>Plate Number:</strong></v-list-item-title>
                  <v-list-item-subtitle>{{ selectedVehicle.Vehicle_platenumber }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title><strong>Vehicle Model:</strong></v-list-item-title>
                  <v-list-item-subtitle>{{ selectedVehicle.Vehicle_model }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title><strong>Vehicle Brand:</strong></v-list-item-title>
                  <v-list-item-subtitle>{{ selectedVehicle.Vehicle_brand }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- Print Button -->
      <v-btn color="secondary" @click="printQRCode">
        <v-icon left>mdi-printer</v-icon> Print QR Code
      </v-btn>
      <v-btn color="blue darken-1" text @click="QRCODEModal = false">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>



    <v-dialog v-model="editModal" max-width="700px">
      <v-card>
        <v-card-title class="headline primary--text">
          <v-icon left class="mr-2">mdi-account-edit</v-icon> Edit Profile
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="personnelUsername"
                    label="Username"
                    required
                    outlined
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="personnelPassword"
                    label="Password"
                    required
                    outlined
                    type="password"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="profilePhonenumber"
                    label="Phone Number"
                    required
                    outlined
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-textarea
                    v-model="profileAddress"
                    label="Address"
                    required
                    outlined
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveProfileChanges">
            <v-icon left>mdi-content-save</v-icon> Save
          </v-btn>
          <v-btn color="error" @click="editModal = false">
            <v-icon left>mdi-close-circle</v-icon> Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import vehiclesData from '@/assets/vehicles.json';
import vehiclesColor from '@/assets/vehicle_color.json';
import axios from 'axios';
import QRCode from 'qrcode';
import { encryptData } from '@/utils/encryption'; // Import encryption function

export default {
  props: {
    occupantId: {
      type: Number,
      required: true
    }
  },
  
  data() {
    return {
      editModal: false,
      searchVehicle: '',
      QRCODEModal: false,
      selectedOccupantId: null,
      selectedVehicleId: null,
      editMode: false,
      showAddVehicleForm: false,
      showVehicleDetails: false,
      occupantName: '',
      personnelRole: '',
      personnelUsername: '',
      personnelPassword: '',
      personnelJobTitle: '',
      personnelStatus: '',
      profileFirstname: '',
      profileMiddlename: '',
      profileLastname: '',
      profileBirthdate: '',
      profileAddress: '',
      profilePhonenumber: '',
      vehicleType: '',
      vehiclePlateNumber: '',
      vehicleModel: '',
      vehicleBrand: '',
      occupantVehicles: [],
      vehicleHeaders: [
        { text: 'Vehicle Type', value: 'vehicle_type' },
        { text: 'Vehicle Color', value: 'vehicle_color' },
        { text: 'Plate Number', value: 'vehicle_platenumber' },
        { text: 'Vehicle Model', value: 'vehicle_model' },
        { text: 'Vehicle Brand', value: 'vehicle_brand' },
        { text: 'Action', value: 'action' },
      ],
      loadingVehicles: false,
      qrCodeUrl: '',
      vehicleTypes: {},
      vehicleBrands: {},
      vehicleModels: {},
      selectedVehicleType: '',
      selectedVehicleBrand: '',
      vehicleColor: '',
      vehicleTypeOptions: [],
      vehicleBrandOptions: [],
      vehicleModelOptions: [],
      colorOptions: [] // Initialize an empty array for color options
    };
  },
  computed: {
    filteredVehicles() {
      return this.occupantVehicles.filter(vehicle => {
        if (!vehicle) return false;
        return (
          (vehicle.Vehicle_type && vehicle.Vehicle_type.toLowerCase().includes(this.searchVehicle.toLowerCase())) ||
          (vehicle.Vehicle_color && vehicle.Vehicle_color.toLowerCase().includes(this.searchVehicle.toLowerCase())) ||
          (vehicle.Vehicle_platenumber && vehicle.Vehicle_platenumber.toLowerCase().includes(this.searchVehicle.toLowerCase())) ||
          (vehicle.Vehicle_model && vehicle.Vehicle_model.toLowerCase().includes(this.searchVehicle.toLowerCase())) ||
          (vehicle.Vehicle_brand && vehicle.Vehicle_brand.toLowerCase().includes(this.searchVehicle.toLowerCase()))
        );
      });
    },
    isEmptyPersonnel() {
      return !this.personnelRole && !this.personnelUsername && !this.personnelPassword && !this.personnelJobTitle && !this.personnelStatus;
    },
    canAddVehicle() {
      return ['Admin', 'Manager', 'Supervisor', 'Coordinator'].includes(localStorage.getItem('jobTitle'));
    },
    canGenerateQRCode() {
      return ['Admin', 'Manager', 'Supervisor', 'Coordinator'].includes(localStorage.getItem('jobTitle'));
    },
    canEditVehicle() {
      return ['Admin', 'Manager', 'Supervisor', 'Coordinator'].includes(localStorage.getItem('jobTitle'));
    },
    canEditProfile() {
      return ['Admin', 'Manager', 'Supervisor', 'Coordinator'].includes(localStorage.getItem('jobTitle'));
    },
    isFormValid() {
      return this.selectedVehicleType && this.selectedVehicleBrand && this.vehicleModel && this.vehicleColor && this.vehiclePlateNumber;
    }
    
  },
  mounted() {
    this.fetchOccupantDetails();
    this.fetchOccupantVehicles();
    this.loadVehicleData();
    this.loadColorOptions();
  },
  methods: {
    loadColorOptions() {
    // Load colors from the JSON file
    this.colorOptions = vehiclesColor.colors;
  },
    loadVehicleData() {
      try {
        this.vehicleTypes = vehiclesData.vehicle_types;
        this.vehicleTypeOptions = Object.keys(this.vehicleTypes);
      } catch (error) {
        console.error('Error loading vehicle data:', error);
      }
  },
    updateVehicleBrands() {
      this.vehicleBrandOptions = this.selectedVehicleType ? Object.keys(this.vehicleTypes[this.selectedVehicleType]) : [];
      this.selectedVehicleBrand = '';
      this.vehicleModels = {};
      this.vehicleModelOptions = [];
      this.vehicleColor = '';
      // this.colorOptions =[];
    },
    updateVehicleModels() {
      this.vehicleModelOptions = this.selectedVehicleBrand ? this.vehicleTypes[this.selectedVehicleType][this.selectedVehicleBrand].models : [];
      this.vehicleModel = '';
      this.vehicleColor = '';
      // this.colorOptions =[];
    },
    handleModelChange() {
      // Reset vehicle color when the vehicle model changes
      this.vehicleColor = '';
    },

    goBack() {
      this.$emit('back');
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
      if (this.editMode) {
        this.editModal = true;
      } else {
        this.saveProfileChanges();
      }
    },
    cancelEdit() {
      this.editMode = false;
    },
    
    fetchOccupantDetails() {
      console.log(`Fetching details for occupant ID: ${this.occupantId}`);
      axios.get(`http://localhost:8080/parking_occupant/api/FetchOccupantDetails.php?id=${this.occupantId}`)
        .then(response => {
          if (response.data && response.data.personnel && response.data.profile) {
            const { personnel, profile } = response.data;
            this.personnelRole = personnel.Role_ID || '';
            this.personnelUsername = personnel.usr_username || '';
            this.personnelPassword = personnel.usr_password || '';
            this.personnelJobTitle = personnel.jobTitle || '';
            this.personnelStatus = personnel.Status || '';
            this.profileFirstname = profile.Firstname || '';
            this.profileMiddlename = profile.Middlename || '';
            this.profileLastname = profile.Lastname || '';
            this.profileBirthdate = profile.Birthdate || '';
            this.profileAddress = profile.Address || '';
            this.profilePhonenumber = profile.Phonenumber || '';
            this.profilePictureUrl = profile.ProfilePicture || '';
          } else {
            console.error('Invalid response structure:', response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching occupant details:', error);
        });
    },

    saveProfileChanges() {
      axios.post(`http://localhost:8080/parking_occupant/api/UpdateOccupantDetails.php`, {
        occupantId: this.occupantId,
        profile: {
          Firstname: this.profileFirstname,
          Middlename: this.profileMiddlename,
          Lastname: this.profileLastname,
          Birthdate: this.profileBirthdate,
          Address: this.profileAddress,
          Phonenumber: this.profilePhonenumber
        }
      })
      .then(response => {
        if (!response.data.success) {
          console.error('Error updating occupant details:', response.data.error);
        }
      })
      .catch(error => {
        console.error('Error updating occupant details:', error);
      });
      this.editModal = false;
    },

    addVehicle() {
    const vehicleData = {
      occupantId: this.occupantId,
      vehicleType: this.selectedVehicleType,  // Change to selectedVehicleType
      vehicleColor: this.vehicleColor,
      vehiclePlateNumber: this.vehiclePlateNumber,
      vehicleModel: this.vehicleModel,
      vehicleBrand: this.selectedVehicleBrand  // Change to selectedVehicleBrand
    };

      axios.post('http://localhost:8080/parking_occupant/api/AddVehicle.php',
        JSON.stringify(vehicleData),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then(response => {
        if (response && response.data) {
          if (response.data.success) {
            console.log('Vehicle added successfully!', response.data);
            alert('Vehicle added successfully');
            this.resetForm();
            this.showAddVehicleForm = false;
            this.fetchOccupantVehicles();
          } else {
            console.error('Error adding vehicle:', response.data.error);
          }
        } else {
          console.error('Error adding vehicle: undefined response');
        }
      })
      .catch(error => {
        console.error('Error adding vehicle:', error);
      });
    },
    async fetchOccupantVehicles() {
      try {
        this.loadingVehicles = true;
        const response = await axios.get(`http://localhost:8080/parking_occupant/api/FetchOccupantVehicles.php?id=${this.occupantId}`);
        if (response.data && response.data.vehicles && Array.isArray(response.data.vehicles)) {
          this.occupantVehicles = response.data.vehicles;
        } else {
          console.error('Invalid response structure:', response.data);
          this.occupantVehicles = [];
        }
        this.loadingVehicles = false;
      } catch (error) {
        console.error('Error fetching occupant vehicles:', error);
        this.loadingVehicles = false;
      }
    },

    
    generateQrCode() {
      const qrCodeData = {
        vehicleId: this.selectedVehicleId,
        occupantId: this.selectedOccupantId
      };

      const encryptedData = encryptData(qrCodeData);

      if (encryptedData) {
        // Generate QR code as a canvas element
        QRCode.toCanvas(encryptedData, { width: 200 }, async (err, canvas) => {
          if (err) {
            console.error('Error generating QR code:', err);
            return;
          }

          // Fetch the logo from the server
          const logoResponse = await axios.get('http://localhost:8080/parking_occupant/api/getLogo.php');
          if (logoResponse.data && logoResponse.data.logoData) {
            const logoDataUrl = `data:image/png;base64,${logoResponse.data.logoData}`;
            const logoImg = new Image();

            logoImg.onload = () => {
              const ctx = canvas.getContext('2d');
              const logoSize = canvas.width * 0.2; // 20% of QR code size
              const logoX = (canvas.width - logoSize) / 2;
              const logoY = (canvas.height - logoSize) / 2;

              // Draw the logo at the center of the QR code
              ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

              // Convert the canvas to a data URL and set it as the QR code URL
              this.qrCodeUrl = canvas.toDataURL('image/png');

              // Save the QR code to the server
              axios.post('http://localhost:8080/parking_occupant/api/SaveVehicleQrCode.php', {
                occupantId: this.selectedOccupantId,
                vehicleId: this.selectedVehicleId,
                qrCode: this.qrCodeUrl.split(',')[1] // Remove the data URL prefix
              })
              .then(response => {
                if (response.data.success) {
                  console.log('QR code saved successfully!');
                } else {
                  console.error('Error saving QR code:', response.data.error);
                }
              })
              .catch(error => {
                console.error('Error saving QR code:', error);
              });
            };

            // Set the logo image source to the fetched data URL
            logoImg.src = logoDataUrl;
          } else {
            console.error('Failed to fetch logo data');
          }
        });
      } else {
        console.error('Failed to encrypt data for QR code');
      }
    },


    showQRCodeModal(item) {
      this.selectedVehicleId = item.Vehicle_ID;
      this.selectedOccupantId = this.occupantId;
      this.selectedVehicle = item; // Set the selected vehicle

      axios.get(`http://localhost:8080/parking_occupant/api/FetchVehicleQrCode.php?occupantId=${this.selectedOccupantId}&vehicleId=${this.selectedVehicleId}`)
        .then(response => {
          if (response.data.qrCode) {
            this.qrCodeUrl = `data:image/png;base64,${response.data.qrCode}`;
          } else {
            this.qrCodeUrl = '';
          }
          this.QRCODEModal = true;
        })
        .catch(error => {
          console.error('Error fetching QR code:', error);
          this.QRCODEModal = true;
        });
    },

    printQRCode() {
      const qrCodeElement = document.getElementById('qrcode-to-print');
      
      if (qrCodeElement) {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow || iframe.contentDocument;
        const iframeDocument = doc.document || doc;
        
        iframeDocument.write('<html><head><title>Print QR Code</title></head><body>');
        iframeDocument.write('<div style="text-align: center;">');
        iframeDocument.write(qrCodeElement.outerHTML);  // Clone the QR code element
        iframeDocument.write('</div>');
        iframeDocument.write('</body></html>');
        iframeDocument.close();

        // Print the iframe content
        doc.focus();
        doc.print();

        // Remove the iframe after printing
        document.body.removeChild(iframe);
      } else {
        console.error("No QR code to print.");
      }
    },

    resetForm() {
      this.selectedVehicleType = '';
      this.selectedVehicleBrand = '';
      this.vehicleModel = '';
      this.vehicleColor = '';
      this.vehiclePlateNumber = '';
    },


  },
};
</script>

<style scoped>
.QRCode-modal {
  text-align: center;
  width: 300px;
  margin: 0 auto;
}

.profile-container {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
}

.profile-info {
  flex: 1;
  margin-left: 20px;
  text-align: left;
}

.blue-border {
  border: 3px solid #217BD4;
}
.profile-picture {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
  .profile-detail {
    margin-top: 5px;
  }
</style>
