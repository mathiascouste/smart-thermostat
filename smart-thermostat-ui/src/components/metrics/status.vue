<template>
  <div class="status">
    <div class="roundedArea">
      <div class="content">
        <div class="temperature">23°C</div>
        <div class="time">11:30</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'status'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.status {
  flex: 5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.roundedArea {
  height: 300px;
  width: 300px;
  border-radius: 50%;
  border: solid 2px #2c3e50;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.time {
  font-size: 4em;
}

.temperature {
  font-size: 5em;
}
</style>
