<template>
  <section class="hatefootball md:p-12 p-5">
    <div class="mt-8 text-center">
      <h1>Hate Football Traffic</h1>
      <div v-if="fData">
        <article v-for="match in fData" :key="match.id" class="mt-3">
          <h3>Home team: {{ match.homeTeam.name }}</h3>
          <h3>Away team: {{ match.awayTeam.name }}</h3>
          <h3>Date and time: {{ match.utcDate | date }}</h3>
        </article>
      </div>
      <nuxt-link
        class="no-underline text-grey-darkest hover:text-black font-bold text-2xl border-2 border-grey-darkest hover:border-black rounded p-4 mt-4 inline-block"
        to="/"
      >Home</nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      fData: null
    }
  },
  methods: {
    async fetchFootballData() {
      this.$axios.setHeader('X-Auth-Token', '4e7bf2774c02414891c545243b966cc9')
      const data = await this.$axios.$get(
        'https://api.football-data.org/v2/teams/64/matches?status=SCHEDULED'
      )
      this.fData = data.matches
      console.log(data)
    }
  },
  beforeMount() {},
  mounted() {
    console.log(this.$axios.APItoken)
    this.fetchFootballData()
  },
  filters: {
    date(val) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
      const date = new Date(val)
      const dateFormat = new Intl.DateTimeFormat('en-GB', options)

      return dateFormat.format(date)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>