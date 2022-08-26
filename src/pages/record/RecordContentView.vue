<template>
  <PlayGround/>
</template>

<script>
import PlayGround from "@/components/bode/PlayGround";
export default {
  name: "RecordContentView",
  components: {PlayGround},
  mounted() {
    if (this.$store.state.record.is_record === false) {
      this.$router.push('/record')
    }
  },
  beforeDestroy() {
    this.$store.state.record.is_record = false
  }
}
</script>

<style scoped>

</style>
