const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
const dt = new Date().toLocaleDateString(undefined, dateOptions)
document.getElementById('daily-date').innerHTML=dt

async function getEvents() {
    const requestOptions = {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        mode: "cors",
        cache: "default",
      }
    
    const myRequest = new Request("api/events", requestOptions)
    try {
        const response = await fetch(myRequest, requestOptions)
        const events = await response.json()
        console.log(events.data)
    } catch (error) {
        console.error(error)
    }
}

getEvents()
  