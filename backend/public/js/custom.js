const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
const dt = new Date().toLocaleDateString(undefined, dateOptions)
document.getElementById('daily-date').innerHTML=dt
let events = []


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
      return await response.json()
  } catch (error) {
      console.error(error)
      return null
  }
}

async function getEvents() {
  events = await httpClient("api/events", "GET")
  displayEventsList(events)
}

function onSearch(evt) {
  const filterString = evt.target.value
  displayEventsList(events.filter(event => {
    for (const key in event) {
      if (String(event[key]).toLowerCase().includes(String(filterString).toLowerCase())) {
        return true
      }
    }
  }))
}

function displayEventsList(events = []) {
  const columnsToHide = ['id', 'file']
  const eventsElement = document.getElementById('events-list')
  eventsElement.textContent = ''
  events.forEach(element => {
    const eventElement = document.createElement('tr')
    Object.keys(element).filter(name => !columnsToHide.includes(name))
      .forEach(name => {
        const columnElement = document.createElement('td')
        if (element[name]) {
          const columnContent = document.createTextNode(element[name])
          columnElement.appendChild(columnContent)
        }
        eventElement.appendChild(columnElement)
    })
    eventsElement.appendChild(eventElement)
  })
}

async function postEvent(event) {
  await httpClient("api/events", "POST", JSON.stringify(event))
}

// Get events in the app starting
getEvents()