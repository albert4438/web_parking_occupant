<template>
  <div>
    <v-btn color="primary" @click="$router.push({ name: 'occupant' })" style="margin-bottom: 14px;">Back</v-btn>

    <v-form>
      <v-container grid-  -md style="border: 1px solid #ccc; border-radius: 10px; padding: 10px;">
        <v-layout wrap>
          <v-flex xs12 md6>
  <v-card flat>
    <v-card-title></v-card-title>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12 md6>
          <v-text-field
            v-model="personnelRole"
            label="Role"
            :disabled="!(editMode && personnelRole)"
            solo
            flat
            outlined
            dense
          />
        </v-flex>
        <v-flex xs12 md6>
          <v-text-field
            v-model="personnelUsername"
            label="Username"
            :disabled="!(editMode && personnelUsername)"
            solo
            flat
            outlined
            dense
          />
        </v-flex>
        <v-flex xs12 md6>
          <v-text-field
            v-model="personnelPassword"
            label="Password"
            :disabled="!(editMode && personnelPassword)"
            type="password"
            solo
            flat
            outlined
            dense
          />
        </v-flex>
        <v-flex xs12 md6>
          <v-text-field
            v-model="personnelJobTitle"
            label="Job Title"
            :disabled="!(editMode && personnelJobTitle)"
            solo
            flat
            outlined
            dense
          />
        </v-flex>
        <v-flex xs12 md6>
          <v-text-field
            v-model="personnelStatus"
            label="Status"
            :disabled="!(editMode && personnelStatus)"
            solo
            flat
            outlined
            dense
          />
        </v-flex>

        <v-flex xs12 md6>
          <v-text-field
            v-model="personnelRole"
            label="Role"
            :disabled="!(editMode && personnelRole)"
            solo
            flat
            outlined
            dense
          />
        </v-flex>

      </v-layout>
    </v-card-text>
  </v-card>
</v-flex>
          <v-flex xs12 md6>
            <v-card flat>
              <v-card-title></v-card-title>
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs12 md6>
                    <v-text-field
                      v-model="profileFirstname"
                      label="First Name"
                      :disabled="!editMode"
                      solo
                      flat
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field
                      v-model="profileMiddlename"
                      label="Middle Name"
                      :disabled="!editMode"
                      solo
                      flat
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field
                      v-model="profileLastname"
                      label="Last Name"
                      :disabled="!editMode"
                      solo
                      flat
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field
                      v-model="profileBirthdate"
                      label="Birthdate"
                      :disabled="!editMode"
                      solo
                      flat
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field
                      v-model="profileAddress"
                      label="Address"
                      :disabled="!editMode"
                      solo
                      flat
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field
                      v-model="profilePhonenumber"
                      label="Phone Number"
                      :disabled="!editMode"
                      solo
                      flat
                      outlined
                      dense
                    />
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>

        <div style="margin-bottom: 5px;">
          <v-btn color="primary" @click="toggleEditMode" class="mr-2">
            {{ editMode ? 'Save' : 'Edit' }}
          </v-btn>
          <v-btn color="error" @click="cancelEdit" :disabled="!editMode">Cancel</v-btn>
        </div>
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
              <v-btn small color="warning" class="ml-2" @click="editVehicle(item)">Edit</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>

      <v-btn color="primary" @click="showAddVehicleForm = true">Add Vehicle</v-btn>
    </v-card-text>
  </v-card>
</v-flex>

          <v-dialog v-model="showAddVehicleForm" max-width="500px">
      <v-card>
        <v-card-title>Add Vehicle</v-card-title>
        <v-card-text>
          <v-form>
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="vehicleType"
                  label="Vehicle Type"
                  solo
                  flat
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="vehicleColor"
                  label="Vehicle Color"
                  solo
                  flat
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="vehiclePlateNumber"
                  label="Plate Number"
                  solo
                  flat
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="vehicleModel"
                  label="Vehicle Model"
                  solo
                  flat
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="vehicleBrand"
                  label="Vehicle Brand"
                  solo
                  flat
                  outlined
                  dense
                />
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addVehicle()">Add</v-btn>
          <v-btn color="error" @click="showAddVehicleForm = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="QRCODEModal" max-width="600px">
  <v-card>
    <v-card-title class="headline">QR Code</v-card-title>
    <v-card-text>
      <v-container>
        <v-layout wrap justify-center>
          <v-flex xs12>


            <div v-if="qrCodeUrl">
              <img :src="qrCodeUrl" alt="QR Code" />
            </div>
            <div v-else>
              <p>No QR code available. Please click the 'Generate' button below.</p>
              <v-btn color="primary" @click="generateQrCode">Generate</v-btn>
            </div>


          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="QRCODEModal = false">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>



  </div>
  
</template>

<script>
import axios from 'axios';
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js'; // Import crypto-js library

export default {
  props: {
    occupantId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // encryptionKey: process.env.VUE_APP_AES_KEY, // Define your secret encryption key
      encryptionKey: CryptoJS.enc.Hex.parse(process.env.VUE_APP_AES_KEY), // Use hex-encoded key
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
      vehicleColor: '',
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

    };
  },
  computed: {
    filteredVehicles() {
      return this.occupantVehicles.filter(vehicle => {
        if (!vehicle) return false; // Add this check
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
    
  },
  mounted() {
    this.fetchOccupantDetails();
    this.fetchOccupantVehicles();
  },
  methods: {
    goBack() {
      this.$emit('back');
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
      if (!this.editMode) {
        // Save changes
        this.saveOccupantDetails();
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
          } else {
            console.error('Invalid response structure:', response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching occupant details:', error);
        });
    },
    saveOccupantDetails() {
      axios.post(`http://localhost:8080/parking_occupant/api/UpdateOccupantDetails.php`, {
        occupantId: this.occupantId,
        personnel: {
          Role_ID: this.personnelRole,
          usr_username: this.personnelUsername,
          usr_password: this.personnelPassword,
          jobTitle: this.personnelJobTitle,
          Status: this.personnelStatus
        },
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
    },

    addVehicle() {
  const vehicleData = {
    occupantId: this.occupantId,
    vehicleType: this.vehicleType,
    vehicleColor: this.vehicleColor,
    vehiclePlateNumber: this.vehiclePlateNumber,
    vehicleModel: this.vehicleModel,
    vehicleBrand: this.vehicleBrand
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
        // Clear form fields
        this.vehicleType = '';
        this.vehicleColor = '';
        this.vehiclePlateNumber = '';
        this.vehicleModel = '';
        this.vehicleBrand = '';
        // Close the dialog
        this.showAddVehicleForm = false;
        // Update the occupantVehicles array with fresh data from the server
        this.fetchOccupantVehicles(); // Call the fetchOccupantVehicles method to update the array
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

    encryptData(data) {
      try {
        const iv = CryptoJS.lib.WordArray.random(16);
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
        const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
        const encryptedBase64 = encrypted.toString();
        return `${ivBase64}:${encryptedBase64}`;
      } catch (error) {
        console.error('Encryption error:', error);
        return null;
      }
    },

    generateQrCode() {
      const qrCodeData = {
        vehicleId: this.selectedVehicleId,
        occupantId: this.selectedOccupantId
      };

      const encryptedData = this.encryptData(qrCodeData);

      if (encryptedData) {
        QRCode.toDataURL(encryptedData)
          .then(url => {
            this.qrCodeUrl = url;
            axios.post('http://localhost:8080/parking_occupant/api/SaveVehicleQrCode.php', {
              occupantId: this.selectedOccupantId,
              vehicleId: this.selectedVehicleId,
              qrCode: url.split(',')[1]
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
          })
          .catch(err => {
            console.error('Error generating QR code:', err);
          });
      } else {
        console.error('Failed to encrypt data for QR code');
      }
    },

    showQRCodeModal(item) {
    this.selectedVehicleId = item.Vehicle_ID;
    this.selectedOccupantId = this.occupantId;

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
  }



  },
};
</script>

<style scoped>
.QRCode-modal {
  text-align: center;
  width: 300px;
  margin: 0 auto;
}
</style>
