<template>
  <div>
    <!-- Search bar -->
    <v-text-field v-model="search" label="Search" solo hide-details class="mb-4">
      <v-btn slot="append" icon @click="searchLogs">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-text-field>

    <!-- Log List with Filter and Pagination -->
    <v-card-text>
      <v-list dense>
        <v-list-item v-for="log in paginatedLogs" :key="log.id">
          <v-list-item-avatar>
            <v-icon color="blue">mdi-car</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ log.vehicle }}</v-list-item-title>
            <v-list-item-subtitle>{{ log.entryTime }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="deleteLog(log.id)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <!-- Pagination -->
      <v-pagination
        v-model="page"
        :length="pages"
        @input="changePage"
        color="blue"
      ></v-pagination>
    </v-card-text>
  </div>
</template>

<script>
export default {
  name: 'ParkingLogComponent',
  data() {
    return {
      parkingLogs: [
        { id: 1, vehicle: 'ABC 123', entryTime: '2024-07-16 10:30 AM' },
        { id: 2, vehicle: 'XYZ 456', entryTime: '2024-07-16 11:15 AM' },
        // Add more log entries as needed
      ],
      search: '',
      page: 1,
      perPage: 5, // Number of items per page
    };
  },
  computed: {
    filteredLogs() {
      // Filter based on search term
      return this.parkingLogs.filter(log =>
        log.vehicle.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    pages() {
      // Calculate number of pages based on filtered logs and perPage
      return Math.ceil(this.filteredLogs.length / this.perPage);
    },
    paginatedLogs() {
      // Paginate the filtered logs based on current page and perPage
      const startIndex = (this.page - 1) * this.perPage;
      return this.filteredLogs.slice(startIndex, startIndex + this.perPage);
    },
  },
  methods: {
    deleteLog(logId) {
      // Implement your delete logic here
      console.log('Deleting log with id:', logId);
    },
    changePage(page) {
      // Change current page
      this.page = page;
    },
    searchLogs() {
      // Implement your search logic here
      console.log('Searching for:', this.search);
    },
  },
};
</script>

<style scoped>
/* Add custom styles as needed */
</style>
