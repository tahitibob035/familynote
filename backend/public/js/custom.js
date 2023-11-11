const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
const dt = new Date().toLocaleDateString(undefined, dateOptions)
document.getElementById('daily-date').innerHTML=dt
let events = []
const dialog = document.querySelector("dialog")
const deleteConfirmButton = document.querySelector("#delete-confirm")
const cancelConfirmButton = document.querySelector("#cancel-confirm")

async function deletEvent() {
  const eventIdToDelete = document.getElementById('delete-event-id')
  const eventId = eventIdToDelete.value
  await httpClient(`api/events/${eventId}`, "DELETE")
  getEvents()
  dialog.close()
  M.toast({html: 'Evénement supprimé.'})
} 

deleteConfirmButton.addEventListener("click", deletEvent)
cancelConfirmButton.addEventListener("click", () => dialog.close())

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
      const responseJson = await response.json()
      if (response.status !== 200) {
        M.toast({html: `Error: ${responseJson.message}`})
        return null
      }
      return responseJson
  } catch (error) {
      console.error(error)
      M.toast({html: `Error: ${error}`})
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
  const eventIdToDelete = document.getElementById('delete-event-id')
  eventIdToDelete.value = event.id
  const eventLabelToDelete = document.getElementById('delete-event-label')
  eventLabelToDelete.textContent = `Voulez-vous supprimer l'événement '${event.label}'?`
  dialog.showModal()
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
      onDeleteClick(element)
    })
    actionColumnElement.appendChild(deleteElement)

    eventElement.appendChild(actionColumnElement)

    eventsElement.appendChild(eventElement)
  })
}

async function postEvent() {
  const eventsForm = document.getElementById('events-form')
  const label = eventsForm.elements['label'].value
  const event = {
    label: eventsForm.elements['label'].value,
    location: eventsForm.elements['location'].value,
    datetime: eventsForm.elements['datetime'].value,
  }
  const response = await httpClient("api/events", "POST", event)
  if (response !== null) {
    M.toast({html: `Nouvel événement ajouté: '${label}'`})
    getEvents()
    const resetButton = document.getElementById('reset-button')
    resetButton.click()
  }
}

function resetForm() {
  const labelInput = document.getElementById('label')
  labelInput.focus()
  const eventsForm = document.getElementById('events-form')
  const inputFields = document.getElementsByClassName('form-input')
  for(field of inputFields) {
    field.classList.remove('active')
    field.value = ''
  }
  disableValidateButton()
  eventsForm.reset()

}

function disableValidateButton() {
  const eventsForm = document.getElementById('events-form')
  const validateButton = document.getElementById('validate-button')
  if (eventsForm.checkValidity()) {
    validateButton.removeAttribute('disabled')
  } else {
    validateButton.setAttribute('disabled', '')
  }
}

function onFormKeyUp(event) {
  if (event.key === 'Enter') {
    const eventsForm = document.getElementById('events-form')
    if (eventsForm.checkValidity()) {
      postEvent()
    }
  }
}

// Get events in the app starting
getEvents()