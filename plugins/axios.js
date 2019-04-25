export default function({ $axios, redirect }) {
  $axios.onRequest(config => {
    console.log(config)
    console.log('Making request to ' + config.baseURL)
    console.log('Setting header to: ' + config.APItoken)
    // $axios.setHeader('X-Auth-Token', '4e7bf2774c02414891c545243b966cc9')
  })
}
