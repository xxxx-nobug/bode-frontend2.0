<template>
    <a-card style="width: 1100px; border-radius: 15px" >
      <slot></slot>
    </a-card>

</template>


<script>
export default {
  name: "ContentField"
}
</script>

<style scoped>
.ant-card-bordered {
  margin: 40px auto;
}
</style>
