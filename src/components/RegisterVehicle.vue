<template>
    <div>
      <h2>Register Vehicle</h2>
      <form @submit.prevent="registerVehicle">
        <div>
          <label for="vehicle_type">Vehicle Type:</label>
          <input type="text" v-model="vehicle_type" required>
        </div>
        <div>
          <label for="vehicle_color">Vehicle Color:</label>
          <input type="text" v-model="vehicle_color" required>
        </div>
        <div>
          <label for="vehicle_platenumber">Vehicle Plate Number:</label>
          <input type="text" v-model="vehicle_platenumber" required>
        </div>
        <div>
          <label for="vehicle_model">Vehicle Model:</label>
          <input type="text" v-model="vehicle_model" required>
        </div>
        <div>
          <label for="vehicle_brand">Vehicle Brand:</label>
          <input type="text" v-model="vehicle_brand" required>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        vehicle_type: '',
        vehicle_color: '',
        vehicle_platenumber: '',
        vehicle_model: '',
        vehicle_brand: ''
      };
    },
    methods: {
      async registerVehicle() {
        const response = await fetch('http://localhost/parking_occupant/api/registerVehicle.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            vehicle_type: this.vehicle_type,
            vehicle_color: this.vehicle_color,
            vehicle_platenumber: this.vehicle_platenumber,
            vehicle_model: this.vehicle_model,
            vehicle_brand: this.vehicle_brand
          })
        });
  
        const data = await response.json();
        console.log(data);
      }
    }
  }
  </script>
  