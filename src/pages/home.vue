<template>
  
<h1>Greeting {{ msg }}</h1>

</template>
<script>
  
export default {

  data() {

    return {
      msg: "vue"
    }
  }
}

</script>
<style scoped>
  
  h1 {
    color: red;
  }
  
</style>