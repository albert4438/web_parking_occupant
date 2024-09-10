<template>
  <div>
    <!-- Filter and Search Panel -->
    <v-card class="mb-4 pa-4">
      <v-row dense>
        <!-- Row 1: Keyword Search, Action Type, Date Range, Sort By -->
        <v-col cols="12" md="3">
          <v-text-field 
            v-model="search" 
            label="Search by keyword" 
            solo 
            clearable
            prepend-inner-icon="mdi-magnify"
            @keyup.enter="applyFilters"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="actionType"
            :items="['All', 'ENTRY', 'EXIT']"
            label="Filter by action"
            solo
            clearable
            prepend-inner-icon="mdi-filter"
            @change="applyFilters"
          ></v-select>
        </v-col>

        <v-col cols="12" md="3">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                label="Filter by date range"
                readonly
                v-bind="attrs"
                v-on="on"
                solo
                clearable
                prepend-inner-icon="mdi-calendar-range"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateRange"
              range
              scrollable
              @change="applyFilters"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="sortOption"
            :items="['Date: Latest First', 'Date: Oldest First']"
            label="Sort by"
            solo
            clearable
            prepend-inner-icon="mdi-sort"
            @change="applyFilters"
          ></v-select>
        </v-col>
      </v-row>

      <v-row dense>
        <!-- Row 2: Vehicle Type, Vehicle Brand, Vehicle Model -->
        <v-col cols="12" md="4">
          <v-select
            v-model="vehicleType"
            :items="vehicleTypes"
            label="Filter by vehicle type"
            solo
            clearable
            prepend-inner-icon="mdi-car"
            @change="onVehicleTypeChange"
          ></v-select>
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="vehicleBrand"
            :items="vehicleBrands"
            label="Filter by vehicle brand"
            solo
            clearable
            prepend-inner-icon="mdi-car"
            @change="onVehicleBrandChange"
            :disabled="!vehicleType"
          ></v-select>
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="vehicleModel"
            :items="vehicleModels"
            label="Filter by vehicle model"
            solo
            clearable
            prepend-inner-icon="mdi-car"
            @change="applyFilters"
            :disabled="!vehicleBrand"
          ></v-select>
        </v-col>
      </v-row>

      <v-btn color="primary" class="mt-3" @click="resetFilters">Reset Filters</v-btn>
    </v-card>

    <!-- Filter Chips -->
    <v-row class="mb-4" v-if="activeFilters.length > 0">
      <v-col cols="12">
        <v-chip-group active-class="primary--text">
          <v-chip
            v-for="(filter, index) in activeFilters"
            :key="index"
            close
            @click:close="removeFilter(index)"
          >
            {{ filter.label }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <!-- Log Table -->
    <v-card-text v-if="paginatedLogs.length > 0">
      <v-simple-table dense class="elevated">
        <thead>
          <tr>
            <th class="sticky-header text-left">Scanned by</th>
            <th class="sticky-header text-left">Vehicle</th>
            <th class="sticky-header text-left">Occupant</th>
            <th class="sticky-header text-left">Action</th>
            <th class="sticky-header text-left">Timestamp</th>
            <th class="sticky-header text-center" v-if="canDeleteLog">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in paginatedLogs" :key="log.log_id" class="hoverable-row">
            <td>{{ log.personnel_fullname }}</td>
            <td>{{ log.vehicle }}</td>
            <td>{{ log.occupant_fullname }}</td>

            <td>
              <v-chip :color="log.action_type === 'ENTRY' ? 'green' : 'red'" text-color="white" small>
                {{ log.action_type }}
              </v-chip>
            </td>

            <td>{{ new Date(log.timestamp).toLocaleString() }}</td>
            <td class="text-center">
              <v-btn icon v-if="canDeleteLog" @click="deleteLog(log.log_id)">
                <v-icon color="red" v-tooltip.bottom="`Delete this log`">mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <!-- Pagination and Rows Per Page -->
      <v-row justify="space-between" class="my-4">
        <v-col cols="12" md="4">
          <v-select
            v-model="perPage"
            :items="[7, 10, 20, 50]"
            label="Rows per page"
            dense
            solo
            @change="applyFilters"
          ></v-select>
        </v-col>
        <v-col cols="12" md="8" class="text-right">
          <v-pagination
            v-model="page"
            :length="pages"
            @input="changePage"
            color="blue"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- No Logs Message -->
    <v-card-text v-else>
      <v-alert type="info" dismissible>No logs found.</v-alert>
    </v-card-text>
  </div>
</template>


<script>
import vehicleInfos from '@/assets/vehicles.json';

export default {
  name: 'ParkingLogComponent',
  data() {
    return {
    parkingLogs: [],
    search: '',
    actionType: 'All',
    vehicleType: null,
    vehicleBrand: null,
    vehicleModel: null,
    vehicleTypes: Object.keys(vehicleInfos.vehicle_types),
    vehicleBrands: [],
    vehicleModels: [],
    dateRange: [],
    menu: false,
    dateRangeText: '',
    sortOption: 'Date: Latest First',
    page: 1,
    perPage: 7,
    activeFilters: [],
    };
  },
  computed: {
    filteredLogs() {
      let logs = this.parkingLogs.filter(log => {
        const matchesSearch = 
          log.vehicle.toLowerCase().includes(this.search.toLowerCase()) ||
          log.personnel_fullname.toLowerCase().includes(this.search.toLowerCase()) ||
          log.occupant_fullname.toLowerCase().includes(this.search.toLowerCase());

        const matchesActionType = 
          this.actionType === 'All' || log.action_type === this.actionType;

        const matchesVehicleType = !this.vehicleType || log.vehicle_type === this.vehicleType;
        const matchesVehicleBrand = !this.vehicleBrand || log.vehicle_brand === this.vehicleBrand;
        const matchesVehicleModel = !this.vehicleModel || log.vehicle_model === this.vehicleModel;

        const matchesDateRange = !this.dateRange.length ||
          (new Date(log.timestamp) >= new Date(this.dateRange[0]) &&
          new Date(log.timestamp) <= new Date(this.dateRange[1]));

        return matchesSearch && matchesActionType && matchesVehicleType && matchesVehicleBrand && matchesVehicleModel && matchesDateRange;
      });

      // Apply sorting based on the selected option
      if (this.sortOption === 'Date: Latest First') {
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      } else if (this.sortOption === 'Date: Oldest First') {
        logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      }

      return logs;
    },
    pages() {
      return Math.ceil(this.filteredLogs.length / this.perPage);
    },
    paginatedLogs() {
      const startIndex = (this.page - 1) * this.perPage;
      return this.filteredLogs.slice(startIndex, startIndex + this.perPage);
    },
    canDeleteLog() {
      //This code can also remove the Action in the Header
      return ['Admin', 'Manager', 'Supervisor', 'Coordinator'].includes(localStorage.getItem('jobTitle'));
    },
  },
  methods: {
    async fetchLogs() {
      const params = new URLSearchParams({
        actionType: this.actionType,
        vehicleType: this.vehicleType || '',
        vehicleBrand: this.vehicleBrand || '',
        vehicleModel: this.vehicleModel || '',
        startDate: this.dateRange[0] ? new Date(this.dateRange[0]).toISOString() : '',
        endDate: this.dateRange[1] ? new Date(this.dateRange[1]).toISOString() : ''
      });

      try {
        const response = await fetch(`http://localhost:8080/parking_occupant/api/fetchParkingLogs.php?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          this.parkingLogs = data.logs;
        } else {
          console.error('Error from server:', data.message);
        }
      } catch (error) {
        console.error('Error fetching parking logs:', error);
      }
    },

    resetFilters() {
      this.search = '';
      this.actionType = 'All';
      this.vehicleType = '';
      this.vehicleBrand = '';
      this.vehicleModel = '';
      this.dateRange = [];
      this.dateRangeText = '';
      this.sortOption = 'Date: Latest First';  // Reset to default sorting option
      this.applyFilters();
    },
    removeFilter(index) {
      const filter = this.activeFilters[index];
      if (filter.type === 'search') {
        this.search = '';
      } else if (filter.type === 'actionType') {
        this.actionType = 'All';
      } else if (filter.type === 'dateRange') {
        this.dateRange = [];
        this.dateRangeText = '';
      } else if (filter.type === 'sortOption') {
        this.sortOption = 'Date: Latest First';  // Reset to default sorting option
      }
      this.applyFilters();
    },
    deleteLog(logId) {
      this.$confirm({
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this log?',
        button: {
          yes: 'Yes',
          no: 'No'
        },
        callback: confirmed => {
          if (confirmed) {
            this.parkingLogs = this.parkingLogs.filter(log => log.log_id !== logId);
          }
        }
      });
    },
    changePage(page) {
      this.page = page;
    },

    onVehicleTypeChange() {
    this.vehicleBrand = null;
    this.vehicleModel = null;
    this.vehicleBrands = this.vehicleType ? Object.keys(vehicleInfos.vehicle_types[this.vehicleType]) : [];
    this.vehicleModels = [];
    this.applyFilters();
  },
  onVehicleBrandChange() {
    this.vehicleModel = null;
    this.vehicleModels = this.vehicleBrand ? vehicleInfos.vehicle_types[this.vehicleType][this.vehicleBrand].models : [];
    this.applyFilters();
  },
  applyFilters() {
    this.page = 1;
    this.dateRangeText = this.dateRange.length ? 
      `${new Date(this.dateRange[0]).toLocaleDateString()} - ${new Date(this.dateRange[1]).toLocaleDateString()}` : '';

    this.activeFilters = [];

    if (this.search) {
      this.activeFilters.push({ label: `Keyword: ${this.search}`, type: 'search' });
    }
    if (this.actionType !== 'All') {
      this.activeFilters.push({ label: `Action: ${this.actionType}`, type: 'actionType' });
    }
    if (this.vehicleType) {
      this.activeFilters.push({ label: `Vehicle Type: ${this.vehicleType}`, type: 'vehicleType' });
    }
    if (this.vehicleBrand) {
      this.activeFilters.push({ label: `Vehicle Brand: ${this.vehicleBrand}`, type: 'vehicleBrand' });
    }
    if (this.vehicleModel) {
      this.activeFilters.push({ label: `Vehicle Model: ${this.vehicleModel}`, type: 'vehicleModel' });
    }
    if (this.dateRangeText) {
      this.activeFilters.push({ label: `Date Range: ${this.dateRangeText}`, type: 'dateRange' });
    }
    if (this.sortOption) {
      this.activeFilters.push({ label: `Sort: ${this.sortOption}`, type: 'sortOption' });
    }
  },
    
  },
  mounted() {
    this.fetchLogs();
  },
};
</script>

<style scoped>
.v-simple-table th, .v-simple-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
}
.v-simple-table th {
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 1;
  font-weight: bold;
  text-transform: uppercase;
}
.v-simple-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
.hoverable-row:hover {
  background-color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s;
}
.v-simple-table .mdi-arrow-right {
  transition: transform 0.3s ease-in-out;
}
.v-simple-table .mdi-arrow-left {
  transition: transform 0.3s ease-in-out;
  transform: rotate(180deg);
}
</style>
