<template>
    <div>
      <h2>Register Occupant</h2>
      <form @submit.prevent="registerOccupant">
        <div>
          <label for="profile_id">Profile ID:</label>
          <input type="text" v-model="profile_id" required>
        </div>
        <div>
          <label for="veh_id">Vehicle ID:</label>
          <input type="text" v-model="veh_id" required>
        </div>
        <div>
          <label for="status">Status:</label>
          <input type="text" v-model="status" required>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        profile_id: '',
        veh_id: '',
        status: ''
      };
    },
    methods: {
      async registerOccupant() {
        const response = await fetch('http://localhost/parking_occupant/api/registerOccupant.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            profile_id: this.profile_id,
            veh_id: this.veh_id,
            status: this.status
          })
        });
  
        const data = await response.json();
        console.log(data);
      }
    }
  }
  </script>
  