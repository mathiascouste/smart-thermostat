<template>
    <trend class="historic"
    :data="[19, 19, 18, 17, 16, 16, 16, 16.5, 16.5, 16.5, 17, 20, 21, 21, 21, 20, 18, 17, 17, 17, 17]"
    :gradient="['#16a085', '#2c3e50', '#e74c3c']"
    :height="180"
    :stroke-width="2"
    auto-draw
    smooth>
</trend>
</template>

<script>
export default {
  name: 'historic',
  components: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.historic {
  flex: 4;
}
</style>
