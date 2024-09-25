<template>
  <div class="parking-lot-container">
    <!-- Search Bar -->
    <v-text-field
      v-model="searchQuery"
      label="Search Parking Lot"
      class="mb-4"
      outlined
      prepend-inner-icon="mdi-magnify"
    ></v-text-field>

    <!-- Add Parking Lot Button -->
    <v-btn class="mb-4" color="primary" @click="showAddLotDialog = true">
      <v-icon left>mdi-plus</v-icon> ADD PARKING LOT
    </v-btn>

    <!-- List of Parking Lots -->
    <v-list>
      <div v-for="lot in filteredParkingLots" :key="lot.Parking_lot_ID" class="mb-2">
        <v-card outlined shaped>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ lot.Parking_Lot_Name }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn text color="primary" @click="editParkingLot(lot)">
                <v-icon left>mdi-pencil</v-icon>
                Edit
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </div>
    </v-list>

    <!-- success dialog for add -->
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

    <!-- Add/Edit Parking Lot Dialog -->
    <v-dialog v-model="showAddLotDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="primary darken-1 white--text" style="margin-bottom: 20px;">
          <v-icon left class="mr-2" style="color: white">mdi-directions </v-icon> {{ isEditing ? 'Edit Parking Lot' : 'Add Parking Lot' }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Parking Lot Name"
            v-model="newLot.Parking_Lot_Name"
            :rules="[v => !!v || 'Parking Lot Name is required']"
            @input="trackChanges"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="!hasChanges || !isFormValid"
            color="primary"
            @click="saveParkingLot"
          >
          <v-icon left>{{ isEditing ? 'mdi-pencil' : 'mdi-content-save' }}</v-icon>
            {{ isEditing ? 'Save Changes' : 'Add' }}
          </v-btn>
          <v-btn color="error" @click="clearForm">
            <v-icon left>mdi-close-circle</v-icon> Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parkingLots: [],
      newLot: { Parking_Lot_Name: '' },
      originalLot: null,
      showAddLotDialog: false,
      isEditing: false,
      searchQuery: '',
      successDialog: false,
      successMessage: '',
      hasChanges: false,
    };
  },
  computed: {
    filteredParkingLots() {
      return this.parkingLots.filter(lot =>
        lot.Parking_Lot_Name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    isFormValid() {
      return this.newLot.Parking_Lot_Name;
    }
  },
  created() {
    this.fetchParkingLots();
  },
  methods: {
    fetchParkingLots() {
      fetch('http://localhost:8080/parking_occupant/api/parking_lot.php?action=getLots')
        .then(response => response.json())
        .then(data => {
          this.parkingLots = data;
        })
        .catch(error => console.error('Fetch error:', error));
    },

    editParkingLot(lot) {
      this.originalLot = { ...lot }; // Keep a copy of the original values
      this.newLot = { ...lot, id: lot.Parking_lot_ID };
      this.isEditing = true;
      this.showAddLotDialog = true;
      this.hasChanges = false; // Reset change tracking
    },

    trackChanges() {
      // Check if current values are different from the original values
      this.hasChanges = JSON.stringify(this.newLot) !== JSON.stringify(this.originalLot);
    },
    
    saveParkingLot() {
      if (!this.isFormValid || !this.hasChanges) return;

      const endpoint = this.isEditing
        ? 'http://localhost:8080/parking_occupant/api/parking_lot.php?action=updateLot'
        : 'http://localhost:8080/parking_occupant/api/parking_lot.php?action=addLot';

      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.newLot)
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error('Server error:', data.error);
          } else {
            this.fetchParkingLots();
            this.successMessage = this.isEditing
              ? 'Edit success! Your changes have been saved.'
              : 'Add success! A new parking lot has been added.';
            this.clearForm();
            this.successDialog = true;
          }
        })
        .catch(error => console.error('Fetch error:', error));
    },

    clearForm() {
      this.newLot = { Parking_Lot_Name: '' };
      this.showAddLotDialog = false;
      this.isEditing = false;
      this.originalLot = null;
    },

    closeSuccessDialog() {
      this.successDialog = false;
    },
  }
};
</script>


<style scoped>

.v-card {
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

    .parking-lot-container {
    padding: 20px;
    }

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
    .v-btn {
    text-transform: none;
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


  
