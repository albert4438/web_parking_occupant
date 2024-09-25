<template>
  <div>

    <!-- button back ra, nothing speciall -->
    <v-btn color="primary" @click="$router.push({ name: 'occupant' })" style="margin-bottom: 14px;">
      <v-icon left>mdi-arrow-left</v-icon>
        Back
    </v-btn>
    
    <!-- Occupant Information  Instagram Inspired-->
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
                <v-btn icon color="primary" class="edit-icon" v-if="canEditProfile" @click="openEditModal">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </h2>

              <div class="profile-detail">
                <v-icon small>mdi-cake</v-icon>
                Birthdate: {{ profileBirthdate }}
              </div>
              <div class="profile-detail">
                <v-icon small>mdi-home</v-icon>
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

    <!-- Occupant's vehicle list -->
    <v-flex xs12 md12>
      <v-card flat>
        <v-card-title>
          <div class="d-flex align-center">
            <span class="text-h6">Occupant's Vehicles</span>
            <v-icon class="mx-2" size="24">mdi-car</v-icon>
            <v-icon size="24">mdi-scooter</v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="searchVehicle"
            label="Search Vehicle"
            flat
            outlined
            prepend-inner-icon="mdi-magnify"
          />

          <v-btn color="primary" class="mb-4" v-if="canAddVehicle" @click="showAddVehicleForm = true">
            <v-icon left class="mr-2" style="color: white">mdi-plus</v-icon> Add Vehicle
          </v-btn>
          
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
                  <v-btn 
                    small 
                    color="primary" 
                    class="ml-2" 
                    @click="showQRCodeModal(item)">
                    <v-icon small class="mx-1">mdi-qrcode</v-icon>
                    QR Code
                  </v-btn>
                  <v-btn small icon color="warning" v-if="canEditVehicle" class="ml-4" @click="editVehicle(item)">
                    <v-icon size="18">mdi-pencil</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>

        </v-card-text>
      </v-card>
    </v-flex>

    <!-- adding vehicle dialog -->
    <v-dialog v-model="showAddVehicleForm" max-width="500px" persistent>
      <v-card>
        <v-card-title class="primary darken-1 white--text" style="margin-bottom: 20px;">
          <v-icon left class="mr-2" style="color: white">mdi-car</v-icon> Add Vehicle  
          <v-icon size="24" style="color: white; margin-left: 7px;">mdi-scooter</v-icon>
        </v-card-title>
        
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
          <v-btn color="primary" :disabled="!isFormValid" @click="addVehicle">
            <v-icon left>mdi-content-save</v-icon> Save
          </v-btn>
          <v-btn color="error" @click="resetForm(); showAddVehicleForm = false">
            <v-icon left>mdi-close-circle</v-icon> Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Show qr code dialog -->
    <v-dialog v-model="QRCODEModal" max-width="500px">
      <v-card>
        <v-card-title class="primary darken-1 white--text" style="margin-bottom: 20px;">
          <v-icon left class="mr-2" style="color: white">mdi-qrcode</v-icon> QR CODE
        </v-card-title>

        <!-- Occupant Name Display -->
        <v-card-subtitle class="py-2">
          <v-row>
            <v-col>
              <div class="d-flex flex-column">
                <span class="title font-weight-medium" align="center">
                  {{ profileFirstname }} {{ profileLastname }}
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card-subtitle>

        <!-- vehicle informations -->
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
           <!-- mao ni ang button kung straight vue ra -->
          <!-- <button>Click me!</button> -->

          <!-- then mao ni ang sa vuetify na button -->
          <!-- <v-btn>Click me!</v-btn> -->

          <!-- Print Button -->
          <v-btn color="secondary" @click="printQRCode">
            <v-icon left>mdi-printer</v-icon> Print QR Code
          </v-btn>
          <v-btn color="info" @click="QRCODEModal = false">
            <v-icon left>mdi-close</v-icon> Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- edit vehicle dialog -->
    <v-dialog v-model="editVehicleDialog" max-width="500px" persistent>
  <v-card>
    <v-card-title class="primary darken-1 white--text" style="margin-bottom: 10px;">
      <v-icon left class="mr-2" style="color: white">mdi-car</v-icon> Edit Vehicle  
      <v-icon size="24" style="color: white; margin-left: 7px;">mdi-scooter</v-icon>
    </v-card-title>

      <div style="margin-bottom: 15px;">
        <v-col cols="12" sm="15" v-if="editedVehicle">
            <v-card class="pa-3 elevation-1">
              <div class="d-flex align-center">
                <!-- <span>(Vehicle Type: {{ editedVehicle.Vehicle_type }}, 
                      Plate Number: {{ editedVehicle.Vehicle_platenumber }}, 
                      Vehicle Model: {{ editedVehicle.Vehicle_model }}, 
                      Vehicle Brand: {{ editedVehicle.Vehicle_brand }})</span> -->
                  <ul>
                  <li>Vehicle Type: {{ editedVehicle.Vehicle_type }}</li>
                  <li>Plate Number: {{ editedVehicle.Vehicle_platenumber }}</li>
                  <li>Vehicle Model: {{ editedVehicle.Vehicle_model }}</li>
                  <li>Vehicle Brand: {{ editedVehicle.Vehicle_brand }}</li>
                </ul>
              </div>
            </v-card>
          </v-col>
      </div>

    <v-card-text style="margin-bottom: -37px;">
      <v-form>
        <v-select
          v-model="editedVehicleColor"
          :items="colorOptions"
          label="Vehicle Color"
          required
          outlined
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" :disabled="!isVehicleColorChanged" @click="saveVehicleColor">
        <v-icon left>mdi-content-save</v-icon> Save
      </v-btn>
      <v-btn color="error" @click="editVehicleDialog = false">
        <v-icon left>mdi-close-circle</v-icon> Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

    <!-- Edit profile dialog -->
    <v-dialog v-model="editModal" max-width="850px" @address-updated="isFormChanged = true" persistent>
      <v-card>

        <!-- Title Section -->
        <v-card-title class="primary darken-1 white--text" style="margin-bottom: 20px;">
          <v-icon left class="mr-2" style="color: white">mdi-account-edit</v-icon> Edit Profile
        </v-card-title>

        <!-- Form Section -->
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>

              <!-- Dynamic Fields: Username, Password, Confirm Password, and Phone Number -->
              <v-row>
                <!-- Username Field -->
                <v-col v-if="personnelId" cols="12" sm="3">
                  <v-text-field
                    v-model="personnelUsername"
                    label="Username"
                    required 
                    :rules="[v => !!v || 'Username is required']"
                    outlined
                  ></v-text-field>
                </v-col>

                <!-- Password Field -->
                <v-col v-if="personnelId" cols="12" sm="3">
                  <v-text-field
                    v-model="personnelPassword"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    outlined
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-col>

                <!-- Confirm Password Field -->
                <v-col v-if="personnelId" cols="12" sm="3">
                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirm Password"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    outlined
                    :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showConfirmPassword = !showConfirmPassword"
                  ></v-text-field>
                </v-col>

                <!-- Phone Number Field -->
                <v-col :cols="(personnelId ? '12' : '12')" :sm="(personnelId ? '3' : '12')">
                  <v-text-field
                    v-model="profilePhonenumber"
                    label="Phone Number"
                    required
                    type="number"
                    :rules="[v => !!v || 'Phone Number is required', v => /^[0-9]+$/.test(v) || 'Phone Number must be an integer']"
                    outlined
                    @keydown="restrictKeydown"
                    @input="restrictInput"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Address Section with Clear Layout and Emphasis -->
              <v-divider class="my-4"></v-divider>
              <v-row>
                <v-col cols="12" sm="9">
                  <v-card class="pa-3 elevation-1">
                    <div class="d-flex align-center">
                      <v-icon class="mr-2" small>mdi-home</v-icon>
                      <span>Address: {{ profileAddress }}</span>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="3" class="text-right">
                  <v-btn color="primary" class="mt-3" @click="addressDialog = true">
                    <v-icon left>mdi-home</v-icon> Edit Address
                  </v-btn>
                </v-col>
              </v-row>

            </v-container>
          </v-form>
        </v-card-text>

        <!-- Action Buttons -->
        <v-card-actions>
          <v-btn color="primary" 
            @click="saveProfileChanges" 
            :disabled="!isFormChanged || (!personnelUsername && personnelId) || !profilePhonenumber">
              <v-icon left>mdi-content-save</v-icon> Save
          </v-btn>
          <v-btn color="error" @click="resetProfileData(); editModal = false">
            <v-icon left>mdi-close-circle</v-icon> Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Address edit dialog -->
    <v-dialog v-model="addressDialog" @address-updated="updateProfileAddress" max-width="600px" persistent>
      <v-card>

        <!-- Title Section -->
        <v-card-title class="primary darken-1 white--text" style="margin-bottom: 20px;">
          <v-icon left class="mr-2" style="color: white">mdi-home</v-icon> Edit Address
        </v-card-title>

        <!-- Form Section -->
        <v-card-text>
          <v-form>
            <v-container>

              <!-- Address Selection -->
              <v-row>
                <!-- Region Dropdown -->
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formData.region"
                    :items="regions"
                    item-value="region_slug"
                    item-text="region_name"
                    label="Region"
                    @change="loadProvinces"
                    required
                    outlined
                  ></v-select>
                </v-col>

                <!-- Province Dropdown -->
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formData.province"
                    :items="provinces"
                    item-value="province_slug"
                    item-text="province"
                    label="Province"
                    @change="loadMunicipalities"
                    required
                    outlined
                    :disabled="!formData.region"
                  ></v-select>
                </v-col>

                <!-- Municipality Dropdown -->
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formData.municipality"
                    :items="municipalities"
                    item-value="municipality_slug"
                    item-text="municipality"
                    label="Municipality"
                    @change="loadBarangays"
                    required
                    outlined
                    :disabled="!formData.province"
                  ></v-select>
                </v-col>

                <!-- Barangay Dropdown -->
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formData.barangay"
                    :items="barangays"
                    item-value="barangay_slug"
                    item-text="barangay"
                    label="Barangay"
                    required
                    outlined
                    :disabled="!formData.municipality"
                  ></v-select>
                </v-col>
              </v-row>

            </v-container>
          </v-form>
        </v-card-text>

        <!-- Action Buttons -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveAddress" :disabled="!isAddressChanged || !formData.region || !formData.province || !formData.municipality || !formData.barangay">
            <v-icon left>mdi-content-save</v-icon> Save
          </v-btn>
          <v-btn color="error" @click="resetAddressForm(); addressDialog = false">
            <v-icon left>mdi-close-circle</v-icon> Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog for Adding Vehicle -->
    <v-dialog v-model="addVehicleSuccessDialog" max-width="500" persistent>
      <v-card class="success-dialog">
            <v-card-title class="headline success-title">Success!</v-card-title>
            <v-card-text class="success-text">
              <v-icon large class="success-icon">mdi-check-circle</v-icon>
              <p>Vehicle added successfully!</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="closeAddVehicleSuccessDialog" class="success-button">Close</v-btn>
            </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog for Editing Profile -->
    <v-dialog v-model="editProfileSuccessDialog" max-width="500" persistent>
      <v-card class="success-dialog">
            <v-card-title class="headline success-title">Success!</v-card-title>
            <v-card-text class="success-text">
              <v-icon large class="success-icon">mdi-check-circle</v-icon>
              <p>Profile updated successfully!</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="closeEditProfileSuccessDialog" class="success-button">Close</v-btn>
            </v-card-actions>
          </v-card>
    </v-dialog>

    <!-- Success Dialog for Editing Vehicle -->
    <v-dialog v-model="editVehicleSuccessDialog" max-width="500" persistent>
      <v-card class="success-dialog">
            <v-card-title class="headline success-title">Success!</v-card-title>
            <v-card-text class="success-text">
              <v-icon large class="success-icon">mdi-check-circle</v-icon>
              <p>Vehicle updated successfully!</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="closeEditVehicleSuccessDialog" class="success-button">Close</v-btn>
            </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Error Passwords do not match Dialog Component -->
    <v-dialog v-model="errorDialog" max-width="500" persistent>
      <v-card class="error-dialog">
        <v-card-title class="headline error-title">Oops!</v-card-title>
        <v-card-text class="error-text">
          <v-icon large class="error-icon">mdi-alert-octagon</v-icon>
          <p>Passwords do not match. Please re-enter and confirm.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="errorDialog = false" class="error-button">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- No qr code, cant print  -->
    <v-dialog v-model="errorPrintDialog" max-width="500" persistent>
      <v-card class="error-dialog">
        <v-card-title class="headline error-title">Oops!</v-card-title>
        <v-card-text class="error-text">
          <v-icon large class="error-icon">mdi-qrcode</v-icon>
          <p>QR code not available. Generate QR code before proceeding to print.</p>   
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="errorPrintDialog = false" class="error-button">Close</v-btn>
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
import { encryptData } from '@/utils/encryption'; 
import addressData from '@/assets/philippine_provinces_cities_municipalities_and_barangays_2016.json';

export default {
  props: {
    //Id sa gi select na occupant
    occupantId: {
      type: Number,
      required: true
    }
  },
  
  data() {
    return {
      errorPrintDialog: false,
      errorDialog: false,
      formChanged: false, // Add a flag to track form changes
      initialData: null,
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
      personnelId:'',
      profileId: '',
      personnelUsername: '',
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
      addressDialog: false,
      formData: {
        region: null,
        province: null,
        municipality: null,
        barangay: null,
      },
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
      colorOptions: [], // Initialize an empty array for color options   
      profileRegion: null,
      profileProvince: null,
      profileMunicipality: null,
      profileBarangay: null,
      regions: [],
      provinces: [],
      municipalities: [],
      barangays: [],
      showPassword: false,
      showConfirmPassword: false,
      originalVehicleColor: '',
      addVehicleSuccessDialog: false,
      editProfileSuccessDialog: false,
      editVehicleSuccessDialog: false,
      successMessage: 'Profile updated successfully!',
      passwordFieldType: 'password',
      confirmPasswordFieldType: 'password',
      editVehicleDialog: false,
      editedVehicle: null,
      editedVehicleColor: '',
      initialRegion: null,
      initialProvince: null,
      initialMunicipality: null,
      initialBarangay: null,
      initialUsername: '',
      initialPassword: '',
      initialConfirmPassword: '',
      personnelPassword: '',
      confirmPassword: '',
      
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
      //only authorize is allowed to generate qr
      return ['Admin', 'Manager', 'Supervisor', 'Coordinator'].includes(localStorage.getItem('jobTitle'));
    },

    canEditVehicle() {
      return ['Admin', 'Manager', 'Supervisor', 'Coordinator'].includes(localStorage.getItem('jobTitle'));
    },

    canEditProfile() {
      return ['Admin', 'Manager', 'Supervisor', 'Coordinator'].includes(localStorage.getItem('jobTitle'));
    },

    isFormValid() {
      return this.selectedVehicleType && 
      this.selectedVehicleBrand && 
      this.vehicleModel && 
      this.vehicleColor && 
      this.vehiclePlateNumber

    },

    fullAddress() {
      return `${this.formData.region}, ${this.formData.province}, ${this.formData.municipality}, ${this.formData.barangay}`;
    },

    isFormChanged() {
      return (
        this.personnelUsername !== this.initialData.personnelUsername ||
        this.personnelPassword !== this.initialData.personnelPassword ||
        this.confirmPassword !== this.initialData.confirmPassword ||
        this.profilePhonenumber !== this.initialData.profilePhonenumber ||
        this.profileAddress !== this.initialData.profileAddress
      );

    //   return (
    //   this.personnelUsername &&
    //   this.profilePhonenumber &&
    //   (
    //     this.personnelUsername !== this.initialData.personnelUsername ||
    //     this.personnelPassword !== this.initialData.personnelPassword ||
    //     this.confirmPassword !== this.initialData.confirmPassword ||
    //     this.profilePhonenumber !== this.initialData.profilePhonenumber ||
    //     this.profileAddress !== this.initialData.profileAddress
    //   )
    // );
    },

    isAddressChanged() {
      return (
        this.formData.region !== this.initialRegion ||
        this.formData.province !== this.initialProvince ||
        this.formData.municipality !== this.initialMunicipality ||
        this.formData.barangay !== this.initialBarangay
      );
    },

    isVehicleColorChanged() {
      return this.editedVehicleColor !== this.originalVehicleColor;
    },

    isAddressComplete() {
      return this.formData.region && this.formData.province && this.formData.municipality && this.formData.barangay;
    }
  },

  mounted() {
    this.loadRegions();
    this.fetchOccupantDetails();
    this.fetchOccupantVehicles();
    this.loadVehicleData();
    this.loadColorOptions();
    this.initialRegion = this.formData.region;
    this.initialProvince = this.formData.province;
    this.initialMunicipality = this.formData.municipality;
    this.initialBarangay = this.formData.barangay;
    this.initialData = {
      personnelUsername: this.personnelUsername,
      personnelPassword: this.personnelPassword,
      confirmPassword: this.confirmPassword,
      profilePhonenumber: this.profilePhonenumber,
      profileAddress: this.profileAddress
    };
  },

  methods: {

    openEditModal() {
      this.initialData = {
        personnelUsername: this.personnelUsername || '',
        personnelPassword: this.personnelPassword || '',
        confirmPassword: this.confirmPassword || '',
        profilePhonenumber: this.profilePhonenumber || '',
        profileAddress: this.profileAddress || '',
        profileId: this.initialData.profileId, 
        personnelId: this.initialData.personnelId
      };
      this.editModal = true;
      this.isFormChanged = false; 
    },

    closeAddVehicleSuccessDialog() {
      this.addVehicleSuccessDialog = false;
    },

    closeEditProfileSuccessDialog() {
      this.editProfileSuccessDialog = false;
    },

    closeEditVehicleSuccessDialog() {
      this.editVehicleSuccessDialog = false;
    },

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
              console.log('API Response:', response.data); 
                if (response.data && response.data.personnel && response.data.profile) {
                    const { personnel, profile } = response.data;
                    this.personnelId = personnel.Personnel_ID || null;
                    this.profileId = profile.Profile_ID || null;
                    this.personnelUsername = response.data.personnel.usr_username || '';
                    //this.personnelPassword = personnel.usr_password || '';
                    this.personnelJobTitle = personnel.jobTitle || '';
                    this.personnelStatus = personnel.Status || '';
                    this.profileFirstname = response.data.profile.Firstname || '';
                    this.profileMiddlename = profile.Middlename || '';
                    this.profileLastname = profile.Lastname || '';
                    this.profileBirthdate = profile.Birthdate || '';
                    this.profileAddress = profile.Address || '';
                    this.profilePhonenumber = profile.Phonenumber || '';
                    this.profilePictureUrl = profile.ProfilePicture || '';

                    // Set address components
                    this.profileRegion = profile.Region || null;
                    this.profileProvince = profile.Province || null;
                    this.profileMunicipality = profile.Municipality || null;
                    this.profileBarangay = profile.Barangay || null;

                    // Initialize dropdowns
                    this.loadProvinces();
                    this.loadMunicipalities();
                    this.loadBarangays();

                    // Set initialData for comparison
                    this.initialData = {
                        profileId: profile.Profile_ID || '',  // Make sure profileId is set here
                        personnelUsername: this.personnelUsername,
                        personnelPassword: this.personnelPassword,
                        profilePhonenumber: this.profilePhonenumber,
                        profileAddress: this.profileAddress,
                        personnelId: personnel.Personnel_ID ||'' // Store the Personnel_ID
                    };
                } else {
                    console.error('Invalid response structure:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching occupant details:', error);
            });
    },

    saveProfileChanges() {
      // Fetch region name and convert to uppercase
      const selectedRegion = this.regions.find(r => r.region_slug === this.formData.region);
      const regionName = selectedRegion ? selectedRegion.region_name.toUpperCase() : ''; // Convert region name to uppercase

      // Create the full address and format it if any part of the address has changed
      let formattedAddress = this.profileAddress; // Default to existing address
      if (this.formData.region || this.formData.province || this.formData.municipality || this.formData.barangay) {
        const fullAddress = `${regionName}, ${this.formData.province}, ${this.formData.municipality}, ${this.formData.barangay}`;
        formattedAddress = this.formatAddress(fullAddress); // Update address only if parts are changed
      }

      // Prepare the payload object
      const payload = {
        occupantId: this.occupantId,
        profileId: this.initialData.profileId,
        profile: {
          phone: this.profilePhonenumber,
          address: formattedAddress  // Only update address if necessary
        }
      };

      console.log('Payload being sent to API:', payload);

      // Include personnelId if it exists
      if (this.initialData.personnelId) {
        payload.personnelId = this.initialData.personnelId;
      }

      // Include username if it's not empty or null and has been changed
      if (this.personnelUsername && this.personnelUsername !== this.initialUsername) {
        payload.profile.username = this.personnelUsername;
      }

      // Validate and include password only if both fields are filled and match
      if (this.personnelPassword || this.confirmPassword) {
        if (this.personnelPassword !== this.confirmPassword) {
          this.errorDialog = true; // Trigger the error dialog
          //alert('Passwords do not match!');
          return;
        }
        payload.profile.password = this.personnelPassword;  // Include password if provided
      }

      // Send the request to update the profile
      axios.post('http://localhost:8080/parking_occupant/api/UpdateOccupantDetails.php', JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Response:', response.data); // Log the API response
        if (response.data.success) {
          this.editProfileSuccessDialog = true;
        } else {
          console.error('Error updating occupant details:', response.data.error || 'Unknown error');
          alert('Failed to update occupant details: ' + (response.data.error || 'Unknown error'));
        }
      })
      .catch(error => {
        console.error('Error updating occupant details:', error);
        alert('An error occurred while updating occupant details.');
      });

      this.editModal = false;
    },

    restrictInput(event) {
      const input = event.target.value;
      if (input.length > 11) {
        event.target.value = input.slice(0, 11);
        this.profilePhonenumber = input.slice(0, 11);
      }
    },

    restrictKeydown(event) {
      const input = this.profilePhonenumber || '';
      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
      if (input.length >= 11 && !allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
      this.passwordFieldType = this.showPassword ? 'text' : 'password';
    },

    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
      this.confirmPasswordFieldType = this.showConfirmPassword ? 'text' : 'password';
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
            this.addVehicleSuccessDialog = true;
            this.fetchOccupantVehicles();
            this.showAddVehicleForm = false;
            this.resetForm();
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

        // Print the qrCodeData to the console
        console.log('qrCodeData:', qrCodeData);
      
      //Calling the encryptData class and set a value to encrypt
      const encryptedData = encryptData(qrCodeData);

      //Use the initialized variable (encryptedData) that holds the encrypted data
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
        this.errorPrintDialog = true;
        //console.error("No QR code to print.");
      }
    },

    resetForm() {
      this.selectedVehicleType = '';
      this.selectedVehicleBrand = '';
      this.vehicleModel = '';
      this.vehicleColor = '';
      this.vehiclePlateNumber = '';
      this.personnelUsername = '';
      this.personnelPassword = '';
      this.profilePhonenumber = '';
    },

    loadRegions() {
      this.regions = Object.keys(addressData).map(regionKey => ({
        region_slug: regionKey.toLowerCase().replace(/ /g, '-'),
        region_name: addressData[regionKey].region_name,
      }));
    },
    
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

    updateAddress(newAddress) {
      this.profileAddress = newAddress;  // Update address
    },

    editVehicle(item) {
      this.editedVehicle = item;
      this.editedVehicleColor = item.Vehicle_color;  // Set the initial color
      this.originalVehicleColor = item.Vehicle_color;  // Store original color for comparison
      this.editVehicleDialog = true;
    },

    saveVehicleColor() {
      const updatedVehicle = {
        vehicleId: this.editedVehicle.Vehicle_ID,
        vehicleColor: this.editedVehicleColor
      };

      axios.post('http://localhost:8080/parking_occupant/api/UpdateVehicleColor.php', updatedVehicle)
        .then(response => {
          if (response.data.success) {
            this.editVehicleSuccessDialog = true; // Show success dialog
            this.fetchOccupantVehicles();  // Refresh vehicle list
            this.editVehicleDialog = false;  // Close edit dialog
          } else {
            console.error('Error updating vehicle color:', response.data.error);
          }
        })
        .catch(error => {
          console.error('Error updating vehicle color:', error);
        });
    },

    updateProfileAddress(newAddress) {
      this.profileAddress = newAddress; // Update address in the profile modal
    },

    saveAddress() {
      console.log('formData:', this.formData);
      console.log('Initial Values:', this.initialRegion, this.initialProvince, this.initialMunicipality, this.initialBarangay);
      
      if (!this.isAddressChanged) {
        console.error('No changes detected');
        return;
      }

      // Find the real region name based on the region slug (ID)
      const selectedRegion = this.regions.find(r => r.region_slug === this.formData.region);
      const regionName = selectedRegion ? selectedRegion.region_name : this.formData.region;

      // Create the full address using the real region name
      const fullAddress = `${regionName}, ${this.formData.province}, ${this.formData.municipality}, ${this.formData.barangay}`;

      // Format the address using the formatAddress function
      this.profileAddress = this.formatAddress(fullAddress);
      
      // Emit the updated address and close the dialog
      this.$emit('address-updated', this.profileAddress);
      this.addressDialog = false;
    },

    formatAddress(address) {
      // Split address into parts before and after the first comma
      const [firstPart, ...restParts] = address.split(',');

      // Capitalize all letters of the words before the first comma
      const formattedFirstPart = firstPart
        .replace(/-/g, ' ') // Replace hyphens with spaces
        .trim() // Remove leading and trailing whitespace
        .split(/\s+/) // Split by any whitespace
        .map(word => word.toUpperCase()) // Capitalize all letters
        .join(' '); // Join words with a space

      // Format the rest of the address
      const formattedRestParts = restParts.map(part => {
        // Remove hyphens, capitalize each word, and join them with a space
        part = part
          .replace(/-/g, ' ') // Replace hyphens with spaces
          .trim(); // Remove leading and trailing whitespace

        // Capitalize each word in the part
        part = part
          .split(/\s+/) // Split by any whitespace
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' '); // Join words with a space

        // Handle parentheses separately
        return part.replace(/\(([^)]+)\)/, (match, p1) => `(${p1.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')})`);
      });

      // Combine the formatted parts
      return [formattedFirstPart, ...formattedRestParts].join(', ');
    },

    resetAddressForm() {
      this.formData.region = this.initialRegion;
      this.formData.province = this.initialProvince;
      this.formData.municipality = this.initialMunicipality;
      this.formData.barangay = this.initialBarangay;
    },

    resetProfileData() {
      // Restore original data from initialData
      this.personnelUsername = this.initialData.personnelUsername || '';
      this.personnelPassword = '';
      this.confirmPassword = '';
      this.profilePhonenumber = this.initialData.profilePhonenumber;
      this.profileAddress = this.initialData.profileAddress;
   },

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

  },
};
</script>

<style scoped>
.v-card {
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

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
</style>  