const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
const dt = new Date().toLocaleDateString(undefined, dateOptions)
document.getElementById('daily-date').innerHTML=dt

async function httpClient(route, method, body = null) {
  const requestOptions = {
    method,
    headers: {
      Accept: "application/json",
    },
    mode: "cors",
    cache: "no-cache",
    body
  }
  const myRequest = new Request(route, requestOptions)
  try {
      const response = await fetch(myRequest, requestOptions)
      const events = await response.json()
      console.log(events.data)
  } catch (error) {
      console.error(error)
  }
}

async function getEvents() {
  await httpClient("api/events", "GET")
}

async function postEvent(event) {
  await httpClient("api/events", "POST", JSON.stringify(event))
}

// Get events in the app starting
getEvents()