<template>
    <div>
      <h2>Parking Logs</h2>
      <table>
        <thead>
          <tr>
            <th>Occupant ID</th>
            <th>Vehicle ID</th>
            <th>Personnel ID</th>
            <th>Time In</th>
            <th>Time Out</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.parklog_id">
            <td>{{ log.occupant_id }}</td>
            <td>{{ log.veh_id }}</td>
            <td>{{ log.personel_id }}</td>
            <td>{{ log.timein }}</td>
            <td>{{ log.timeout }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        logs: []
      };
    },
    async created() {
      const response = await fetch('http://localhost/parking_occupant/api/parkingLogs.php');
      this.logs = await response.json();
    }
  }
  </script>
  