const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
const dt = new Date().toLocaleDateString(undefined, dateOptions)
document.getElementById('daily-date').innerHTML=dt
let events = []


async function httpClient(route, method, data = null) {
  const contentType = method === 'POST' ? 'application/x-www-form-urlencoded' : "application/json"
  const requestOptions = {
    method,
    headers: {
      'Content-Type': contentType,
    },
    mode: "cors",
    cache: "no-cache"
  }
  if (method === 'POST') {
    requestOptions['body'] = new URLSearchParams(data)
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

async function onDeleteClick(event) {
  await httpClient(`api/events/${event.id}`, "DELETE")
  getEvents()
}

function displayEventsList(events = []) {
  const columnsToHide = ['id', 'file', 'description']
  const eventsElement = document.getElementById('events-list')
  eventsElement.textContent = ''
  events.forEach(element => {
    const eventElement = document.createElement('tr')
    Object.keys(element).filter(name => !columnsToHide.includes(name))
      .forEach(name => {
        const columnElement = document.createElement('td')
        columnElement.className = `${name}-column`
        if (element[name]) {
          // Specific Date format
          const text = name === 'datetime' ? new Date(element[name]).toLocaleString().slice(0,10): element[name]

          const columnContent = document.createTextNode(text)
          columnElement.appendChild(columnContent)
        }
        eventElement.appendChild(columnElement)
    })

    // Action Column
    const actionColumnElement = document.createElement('td')
    eventElement.className = 'action-column'
    const deleteElement = document.createElement('i')
    deleteElement.className = "material-icons prefix delete-button"
    deleteElement.textContent = "delete"
    deleteElement.title = "Supprimer l'événement"
    deleteElement.addEventListener('click',   function () {
      onDeleteClick(element);
    })
    actionColumnElement.appendChild(deleteElement)

    eventElement.appendChild(actionColumnElement)

    eventsElement.appendChild(eventElement)
  })
}

async function postEvent() {
  const eventsForm = document.getElementById('events-form')
  const event = {
    label: eventsForm.elements['label'].value,
    location: eventsForm.elements['location'].value,
    datetime: eventsForm.elements['datetime'].value,
  }
  await httpClient("api/events", "POST", event)
  getEvents()
}

// Get events in the app starting
getEvents()