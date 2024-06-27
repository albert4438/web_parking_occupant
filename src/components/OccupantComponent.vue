<template>
  <div>
    <v-text-field
      v-model="search"
      label="Search"
      solo
      hide-details
      class="mb-4"
    >
      <v-btn slot="append" icon @click="searchOccupants">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-text-field>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-center">Number</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="occupant in filteredOccupants" :key="occupant.id">
            <td>{{ occupant.Firstname }} {{ occupant.Lastname }}</td>
            <td class="text-center">{{ occupant.Phonenumber }}</td>
            <td class="text-center">
              <v-btn small color="primary" @click="viewOccupant(occupant)">
                <v-icon small>mdi-eye</v-icon>
                View
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<style>
 .v-simple-table {
    border: 1px solid #ddd;
  }
 .v-simple-table th,.v-simple-table td {
    border: 1px solid #ddd;
  }
</style>

<script>
import axios from 'axios';

export default {
  name: 'OccupantComponent',
  data() {
    return {
      search: '',
      occupants: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Phone Number', value: 'phonenumber' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      pagination: {
        rowsPerPage: 10
      }
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
          (occupant.Lastname && occupant.Lastname.toLowerCase().includes(this.search.toLowerCase())) ||
          (occupant.Phonenumber && occupant.Phonenumber.toLowerCase().includes(this.search.toLowerCase()))
        );
      });
    }
  },
  methods: {
    fetchOccupants() {
      axios
      .get('http://localhost:8080/parking_occupant/api/FetchOccupants.php')
      .then(response => {
          if (response.data.success) {
            this.occupants = response.data.occupants;
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
    viewOccupant(item) {
      // Implement view occupant logic here
      console.log(`Viewing occupant ${item.Firstname} ${item.Lastname}`);
      // Example: Navigate to a detailed view component
      // this.$router.push(`/occupant/${item.id}`);
    },
  },
};
</script>

<style scoped>
@import '~@fortawesome/fontawesome-free/css/all.css';
@import '~material-design-icons-iconfont/dist/material-design-icons.css';
</style>