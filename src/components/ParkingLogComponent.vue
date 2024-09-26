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
            outlined
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
            outlined
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
                outlined
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
            outlined
            clearable
            prepend-inner-icon="mdi-sort"
            @change="applyFilters"
          ></v-select>
        </v-col>
      </v-row>

      <v-row dense>
            <!-- Row 2: Vehicle Type, Vehicle Brand, Vehicle Model, Parking Lot -->
            <v-col cols="12" md="3">
              <v-select
                v-model="vehicleType"
                :items="vehicleTypes"
                label="Filter by vehicle type"
                outlined
                clearable
                prepend-inner-icon="mdi-car"
                @change="onVehicleTypeChange"
              ></v-select>
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                v-model="vehicleBrand"
                :items="vehicleBrands"
                label="Filter by vehicle brand"
                outlined
                clearable
                prepend-inner-icon="mdi-car"
                @change="onVehicleBrandChange"
                :disabled="!vehicleType"
              ></v-select>
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                v-model="vehicleModel"
                :items="vehicleModels"
                label="Filter by vehicle model"
                outlined
                clearable
                prepend-inner-icon="mdi-car"
                @change="applyFilters"
                :disabled="!vehicleBrand"
              ></v-select>
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                v-model="parkingLotName"
                :items="parkingLotNames"
                label="Filter by parking lot"
                outlined
                clearable
                prepend-inner-icon="mdi-parking"
                @change="applyFilters"
              ></v-select>
            </v-col>
      </v-row>

      <!-- Row 3: Buttons aligned to the right -->
      <v-row dense >
                <!-- Total Logs Section -->
                <v-col cols="12" md="2" class="mt-1 ml-2">
                  <v-card class="py-2 px-3" elevation="1" outlined>
                    <v-row dense align="center">
                      <v-icon color="primary" size="28" class="mr-2">mdi-file-document-box-multiple</v-icon>
                      <div>
                        <span class="caption text-muted">Total Logs: </span>
                        <span class="subtitle-2 text-primary font-weight-bold">{{ totalLogs }}</span>
                      </div>
                    </v-row>
                  </v-card>
                </v-col>
            <v-row dense justify="end">
                <v-btn color="success" class="mt-3 ml-2" @click="printFilteredLogs(true)" elevation="1" rounded outlined>
                  <v-icon left>mdi-printer</v-icon>
                  Print All Logs
                </v-btn>
                <v-btn color="success" class="mt-3 ml-2" @click="printFilteredLogs(false)" elevation="1" rounded outlined>
                  <v-icon left>mdi-printer</v-icon>
                  Print Current Page
                </v-btn>
                <v-btn color="primary" class="mt-3 ml-2" @click="resetFilters" elevation="2" rounded >
                  <v-icon left>mdi-autorenew</v-icon>
                  Reset Filters
                </v-btn>
            </v-row>
      </v-row>

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
            <th class="sticky-header text-left">Parking Lot</th> 
            <th class="sticky-header text-left">Action</th>
            <th class="sticky-header text-left">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in paginatedLogs" :key="log.log_id" class="hoverable-row">
            <td>{{ log.personnel_fullname }}</td>
            <td>{{ log.vehicle }}</td>
            <td>{{ log.occupant_fullname }}</td>
            <td>{{ log.parking_lot_name }}</td>
            <td>
              <v-chip :color="log.action_type === 'ENTRY' ? 'green' : 'red'" text-color="white" small>
                {{ log.action_type }}
              </v-chip>
            </td>
            <td>{{ new Date(log.timestamp).toLocaleString() }}</td>
          </tr>
        </tbody>
      </v-simple-table>


      <!-- Pagination and Rows Per Page -->
      <v-row justify="space-between" class="my-4">
        <v-col cols="12" md="4">
          <v-select
            v-model="perPage"
            :items="[10, 20, 50, 100, 150, 200, 250, 300, 350]"
            label="Rows per page"
            outlined
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


    <!-- Error Dialog Component -->
    <v-dialog v-model="errorDialog" max-width="500" persistent>
      <v-card class="error-dialog">
        <v-card-title class="headline error-title">Oops!</v-card-title>
        <v-card-text class="error-text">
          <v-icon large class="error-icon">mdi-alert-octagon</v-icon>
          <p>An error occurred while printing the parking log. Please try again or click the reset filter button.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="errorDialog = false" class="error-button">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>




  </div>

  
</template>


<script>
import axios from 'axios';
import vehicleInfos from '@/assets/vehicles.json';

export default {
  name: 'ParkingLogComponent',
  data() {
    return {
      errorDialog: false,
      parkingLogs: [],
      search: '',
      actionType: 'All',
      vehicleType: null,
      vehicleBrand: null,
      vehicleModel: null,
      vehicleTypes: Object.keys(vehicleInfos.vehicle_types),
      vehicleBrands: [],
      vehicleModels: [],
      parkingLotName: null,   // Added for filtering parking lots
      parkingLotNames: [], 
      dateRange: [],
      menu: false,
      dateRangeText: '',
      sortOption: 'Date: Latest First',
      page: 1,
      perPage: 10,
      activeFilters: [],
      columns: [
        { label: 'Scanned by', value: 'personnel_fullname' },
        { label: 'Vehicle', value: 'vehicle' },
        { label: 'Occupant', value: 'occupant_fullname' },
        {label: 'Parking Lot', value: 'parking_lot_name'},
        { label: 'Action', value: 'action_type' },
        { label: 'Timestamp', value: 'timestamp' }
      ],
      selectedColumns: []
    };
  },
  computed: {
    filteredLogs() {
      let logs = this.parkingLogs.filter(log => {
            const matchesSearch = 
                log.vehicle.toLowerCase().includes(this.search.toLowerCase()) ||
                log.personnel_fullname.toLowerCase().includes(this.search.toLowerCase()) ||
                log.occupant_fullname.toLowerCase().includes(this.search.toLowerCase()) ||
                log.parking_lot_name.toLowerCase().includes(this.search.toLowerCase());

            const matchesActionType = 
                this.actionType === 'All' || log.action_type === this.actionType;

            const matchesVehicleType = !this.vehicleType || log.vehicle_type === this.vehicleType;
            const matchesVehicleBrand = !this.vehicleBrand || log.vehicle_brand === this.vehicleBrand;
            const matchesVehicleModel = !this.vehicleModel || log.vehicle_model === this.vehicleModel;
            const matchesParkingLot = !this.parkingLotName || log.parking_lot_name === this.parkingLotName;

            const matchesDateRange = !this.dateRange.length ||
                (new Date(log.timestamp) >= new Date(this.dateRange[0]).setHours(0, 0, 0, 0) &&
                 new Date(log.timestamp) <= new Date(this.dateRange[1] || this.dateRange[0]).setHours(23, 59, 59, 999));

            return matchesSearch && matchesActionType && matchesVehicleType && matchesVehicleBrand && matchesVehicleModel && matchesParkingLot && matchesDateRange;
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

    totalLogs() {
        return this.filteredLogs.length;
    },
  },
  methods: {
    
    async fetchLogs() {
      try {
        const params = new URLSearchParams({
          actionType: this.actionType,
          vehicleType: this.vehicleType || '',
          vehicleBrand: this.vehicleBrand || '',
          vehicleModel: this.vehicleModel || '',
          startDate: this.dateRange[0] ? new Date(this.dateRange[0]).toISOString() : '',
          endDate: this.dateRange[1] ? new Date(this.dateRange[1]).toISOString() : ''
        });

        const response = await fetch(`http://localhost:8080/parking_occupant/api/fetchParkingLogs.php?${params.toString()}`);
        const data = await response.json();

        if (data && data.success) {
          this.parkingLogs = data.logs;
        } else {
          console.error('Error from server:', data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching parking logs:', error);
      }
    },

    async fetchParkingLots() {
      try {
        const response = await fetch('http://localhost:8080/parking_occupant/api/fetchParkingLots.php');
        const data = await response.json();

        if (data && data.success) {
          // Map the fetched parking lot data to match the format v-select expects
          this.parkingLotNames = data.parking_lots.map(lot => lot.Parking_Lot_Name);
        } else {
          console.error('Error fetching parking lots:', data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching parking lots:', error);
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
      this.sortOption = 'Date: Latest First';  
      this.parkingLotName = null;
      this.parkingLotNames = []; 
      this.vehicleTypes = Object.keys(vehicleInfos.vehicle_types);
      this.vehicleBrands = [];
      this.vehicleModels = [];
      this.applyFilters();
      this.fetchLogs();
      this.fetchParkingLots();
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
        this.sortOption = 'Date: Latest First';  
      } else if (filter.type === 'parkingLotName') {  
        this.parkingLotName = null;  
      } else if (filter.type === 'vehicleType') {
        this.vehicleType = '';
      } else if (filter.type === 'vehicleBrand') {
        this.vehicleBrand = '';
      } else if (filter.type === 'vehicleModel') {
        this.vehicleModel = '';
      }

      this.activeFilters.splice(index, 1); // Remove the filter from the activeFilters array
      this.applyFilters();  
    },

    
  //   async printFilteredLogs(printAll = false) {
  //     try {
  //         // Fetch the logo and institution name
  //         await this.fetchExistingLogo();
  //         await this.fetchInstitutionName();

  //         //window size on printing
  //         const printWindow = window.open('', '', 'height=500,width=800');

  //         // Ensure the logo is fetched correctly and define an onload callback to print only after the logo loads
  //         const logoHtml = this.logoExists 
  //             ? `<img id="logoImage" src="${this.logoUrl}" alt="Institution Logo" style="width: 50px; height: auto; margin-right: 20px;" />` 
  //             : '';
  //         const institutionNameHtml = this.institutionNameExists 
  //             ? `<h2 style="font-size: 24px; color: #333; margin: 0;">${this.institutionName}</h2>` 
  //             : '';

  //         // Construct the header with logo and institution name
  //         const headerHtml = `
  //             <div style="display: flex; align-items: center; justify-content: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
  //                 ${logoHtml}
  //                 ${institutionNameHtml}
  //             </div>
  //         `;

  //         // Use already fetched logs
  //         const logsToPrint = printAll ? this.parkingLogs : this.filteredLogs.slice(0, this.perPage);

  //         if (logsToPrint.length === 0) {
  //             this.errorDialog = true; // Trigger the error dialog
  //             console.error('No logs available to print');
  //             return;
  //         }

  //         // Get selected columns to print
  //         const columnsToPrint = this.selectedColumns.length > 0 
  //             ? this.selectedColumns 
  //             : this.columns.map(col => col.value); // If no columns are selected, print all

  //         // Map the logs into printable data
  //         const logsData = logsToPrint.map(log => {
  //             return columnsToPrint.map(column => {
  //                 if (column === 'timestamp') {
  //                     // Format the timestamp to show date and time in 12-hour format with AM/PM
  //                     return new Date(log.timestamp).toLocaleString('en-US', { 
  //                         year: 'numeric',
  //                         month: 'numeric',
  //                         day: 'numeric',
  //                         hour: 'numeric', 
  //                         minute: 'numeric', 
  //                         second: 'numeric', 
  //                         hour12: true 
  //                     });
  //                 }
  //                 return log[column] || 'N/A';
  //             });
  //         });

  //         // Get headers for the selected columns
  //         const headers = columnsToPrint.map(column => {
  //             const col = this.columns.find(col => col.value === column);
  //             return col ? col.label : '';
  //         });

  //         // Prepare the document content
  //         printWindow.document.write('<html><head><title>Parking Logs</title>');
  //         printWindow.document.write('<style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; }</style>');
  //         printWindow.document.write('</head><body>');

  //         // Insert the header with logo and institution name
  //         printWindow.document.write(headerHtml);

  //         printWindow.document.write('<table><thead><tr>');

  //         // Add headers
  //         headers.forEach(header => {
  //             printWindow.document.write(`<th>${header}</th>`);
  //         });
  //         printWindow.document.write('</tr></thead><tbody>');

  //         // Add log rows
  //         logsData.forEach(row => {
  //             printWindow.document.write('<tr>');
  //             row.forEach(cell => {
  //                 printWindow.document.write(`<td>${cell}</td>`);
  //             });
  //             printWindow.document.write('</tr>');
  //         });

  //         printWindow.document.write('</tbody></table></body></html>');
  //         printWindow.document.close();

  //         // Add event listener for the logo loading
  //         const logoImage = printWindow.document.getElementById('logoImage');

  //         if (logoImage) {
  //             // Ensure print happens only after the logo image is fully loaded
  //             logoImage.onload = () => {
  //                 printWindow.focus();
  //                 printWindow.print();
  //             };
  //         } else {
  //             // If no logo exists, proceed to print
  //             printWindow.focus();
  //             printWindow.print();
  //         }
  //     } catch (error) {
  //         console.error('Error in printing logs:', error);
  //         this.errorDialog = true; // Trigger the error dialog
  //     }
  // },

  async printFilteredLogs(printAll = false) {
    try {
      // Fetch the logo and institution name
      await this.fetchExistingLogo();
      await this.fetchInstitutionName();

      // Ensure the logo and institution name is fetched correctly and define an onload callback to print only after the logo loads
      const logoHtml = this.logoExists 
          ? `<img id="logoImage" src="${this.logoUrl}" alt="Institution Logo" style="width: 50px; height: auto; margin-right: 20px;" />` 
          : '';
      const institutionNameHtml = this.institutionNameExists 
          ? `<h2 style="font-size: 24px; color: #333; margin: 0;">${this.institutionName}</h2>` 
          : '';

      // Construct the header with logo and institution name
      const headerHtml = `
          <div style="display: flex; align-items: center; justify-content: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
              ${logoHtml}
              ${institutionNameHtml}
          </div>
      `;

      // Use already fetched logs
      const logsToPrint = printAll ? this.parkingLogs : this.filteredLogs.slice(0, this.perPage);

      if (logsToPrint.length === 0) {
          this.errorDialog = true; // Trigger the error dialog
          console.error('No logs available to print');
          return;
      }

      // Get selected columns to print
      const columnsToPrint = this.selectedColumns.length > 0 
          ? this.selectedColumns 
          : this.columns.map(col => col.value); // If no columns are selected, print all

      // Map the logs into printable data
      const logsData = logsToPrint.map(log => {
          return columnsToPrint.map(column => {
              if (column === 'timestamp') {
                  // Format the timestamp to show date and time in 12-hour format with AM/PM
                  return new Date(log.timestamp).toLocaleString('en-US', { 
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric', 
                      minute: 'numeric', 
                      second: 'numeric', 
                      hour12: true 
                  });
              }
              return log[column] || 'N/A';
          });
      });

      // Get headers for the selected columns
      const headers = columnsToPrint.map(column => {
          const col = this.columns.find(col => col.value === column);
          return col ? col.label : '';
      });

      // Add a conditional check before opening the print window
      if (!this.errorDialog) {
          const printWindow = window.open('', '', 'height=500,width=800');

          // Prepare the document content
          printWindow.document.write('<html><head><title>Parking Logs</title>');
          printWindow.document.write('<style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; }</style>');
          printWindow.document.write('</head><body>');

          // Insert the header with logo and institution name
          printWindow.document.write(headerHtml);

          printWindow.document.write('<table><thead><tr>');

          // Add headers
          headers.forEach(header => {
              printWindow.document.write(`<th>${header}</th>`);
          });
          printWindow.document.write('</tr></thead><tbody>');

          // Add log rows
          logsData.forEach(row => {
              printWindow.document.write('<tr>');
              row.forEach(cell => {
                  printWindow.document.write(`<td>${cell}</td>`);
              });
              printWindow.document.write('</tr>');
          });

          printWindow.document.write('</tbody></table></body></html>');
          printWindow.document.close();

          // Add event listener for the logo loading
          const logoImage = printWindow.document.getElementById('logoImage');

          if (logoImage) {
              // Ensure print happens only after the logo image is fully loaded
              logoImage.onload = () => {
                  printWindow.focus();
                  printWindow.print();
              };
          } else {
              // If no logo exists, proceed to print
              printWindow.focus();
              printWindow.print();
          }
      }
    } catch (error) {
      console.error('Error in printing logs:', error);
      this.errorDialog = true; // Trigger the error dialog
    }
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
        this.dateRangeText = this.dateRange.length
          ? `${new Date(this.dateRange[0]).toLocaleDateString()} - ${new Date(this.dateRange[1]).toLocaleDateString()}`
          : '';

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
        if (this.parkingLotName) {
          this.activeFilters.push({ label: `Parking Lot: ${this.parkingLotName}`, type: 'parkingLotName' }); 
        }
        if (this.dateRangeText) {
          this.activeFilters.push({ label: `Date Range: ${this.dateRangeText}`, type: 'dateRange' });
        }
        if (this.sortOption) {
          this.activeFilters.push({ label: `Sort: ${this.sortOption}`, type: 'sortOption' });
        }
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

    async fetchExistingLogo() {
      try {
        const response = await axios.get('http://localhost:8080/parking_occupant/api/getLogo.php');
        if (response.data && response.data.logoData) {
          this.logoUrl = `data:image/png;base64,${response.data.logoData}`;
          this.logoExists = true;
        } else {
          this.logoUrl = '';
          this.logoExists = false;
        }
      } catch (error) {
        this.logoExists = false;
        console.error('Error fetching logo:', error.message);
      }
    },
  },
  mounted() {
    this.fetchLogs();
    this.fetchParkingLots(); 
  }
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

.support-button {
  background-color: #f57c00; /* Secondary color for contact support button */
  color: white;
}

.support-button:hover {
  background-color: #e64a19; /* Darker shade on hover */
}

</style>