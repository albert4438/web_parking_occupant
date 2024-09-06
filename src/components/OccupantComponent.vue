<template>
  <div>
    <v-text-field v-model="search" label="Search" solo hide-details class="mb-4">
      <v-btn slot="append" icon @click="searchOccupants">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-text-field>
    
    <!-- Button to open modal -->
    <!-- <v-btn color="primary" class="mb-4" @click="addOccupant">ADD OCCUPANT</v-btn> -->
    <v-btn color="primary" class="mb-4" v-if="canAddOccupant" @click="addOccupant">ADD OCCUPANT</v-btn>

    
    <!-- Occupant list -->
    <v-list>
      <div v-for="occupant in filteredOccupants" :key="occupant.Occupant_ID" class="mb-2">
        <v-card outlined shaped>
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="getProfilePicture(occupant.ProfilePicture)" v-if="occupant.ProfilePicture"></v-img>
              <v-icon v-else>mdi-account</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ occupant.Firstname }} {{ occupant.Lastname }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn text color="primary" @click="viewOccupant(occupant.Occupant_ID)">
                <v-icon left>mdi-eye</v-icon>
                View
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </div>
    </v-list>
    
    <!-- Registration Modal -->
    <RegistrationComponent ref="registrationModal" @refreshList="fetchOccupants" />
  </div>
</template>

<script>
import axios from 'axios';
import RegistrationComponent from './RegistrationComponent.vue';

export default {
  components: { RegistrationComponent },
  name: 'OccupantComponent',
  data() {
    return {
      search: '',
      occupants: [],
      dialog: false, // Control modal visibility
    };
  },
  mounted() {
    // Fetch occupants data on component mount
    this.fetchOccupants();
  },
  computed: {
    filteredOccupants() {
      return this.occupants.filter(occupant => {
        return (
          (occupant.Firstname && occupant.Firstname.toLowerCase().includes(this.search.toLowerCase())) ||
          (occupant.Lastname && occupant.Lastname.toLowerCase().includes(this.search.toLowerCase())) 
        );
      });
    },
    canAddOccupant() {
    return ['Admin', 'Manager', 'Supervisor', 'Coordinator'].includes(localStorage.getItem('jobTitle'));
  }
  },
  methods: {
    fetchOccupants() {
      axios
        .get('http://localhost:8080/parking_occupant/api/fetchOccupants.php')
        .then(response => {
          if (response.data.success) {
            this.occupants = response.data.occupants;
            console.log('Occupants fetched:', this.occupants);
          } else {
            console.error('Error fetching occupants:', response.data.error);
          }
        })
        .catch(error => {
          console.error('Error fetching occupants:', error);
        });
    },
    searchOccupants() {
      // No need to implement anything here, the filteredOccupants computed property will take care of filtering the occupants array
    },
    viewOccupant(id) {
      this.$router.push({ name: 'view-action-occupant', params: { id } });
    },
    addOccupant() {
      this.$refs.registrationModal.dialog = true;
    },
    getProfilePicture(profilePicture) {
      return `data:image/jpeg;base64,${profilePicture}`;
    }
  }
};
</script>

<style scoped>
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
</style>
