const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
const dailyDate = new Date().toLocaleDateString(undefined, dateOptions)
document.getElementById('daily-date').innerHTML=`Evénements du ${dailyDate}`
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
  const contentType = (method === 'POST' || method === 'PUT') ? 'application/x-www-form-urlencoded' : "application/json"
  const requestOptions = {
    method,
    headers: {
      'Content-Type': contentType,
    },
    mode: "cors",
    cache: "no-cache"
  }
  if (method === 'POST' || method === 'PUT') {
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
  displayDailyEvent(events)
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

async function onEditClick(event) {
  resetForm()
  const inputNames = ['id', 'label', 'datetime', 'location']
  inputNames.forEach(name => {
    const input = document.getElementById(name)
    const text = name === 'datetime' ? event[name].slice(0,10): event[name]
    input.value = text
    input.focus()
  })
  const formTitle = document.getElementById('form-title')
  formTitle.textContent = `Modifier l'événement '${event.label}'`
  disableValidateButton()
}

function specificTextForDate(value) {
  return new Date(value).toLocaleString().slice(0,10)
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
          const text = name === 'datetime' ? specificTextForDate(element[name]): element[name]

          const columnContent = document.createTextNode(text)
          columnElement.appendChild(columnContent)
        }
        eventElement.appendChild(columnElement)
    })

    // Action Column
    const actionColumnElement = document.createElement('td')
    eventElement.className = 'action-column'

    // Add edit button
    const editElement = document.createElement('i')
    editElement.className = "material-icons prefix edit-button"
    editElement.textContent = "edit"
    editElement.title = "Editer l'événement"
    editElement.addEventListener('click',   function () {
      onEditClick(element)
    })
    actionColumnElement.appendChild(editElement)

    // Add delete button
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

function displayDailyEvent(events) {
  const dailyList = document.getElementById('daily-event')
  dailyList.textContent= ''
  let todayEvent = null
  events.forEach(event => {
    if (event.datetime.slice(4,10) === new Date().toISOString().slice(4,10)) {
      todayEvent = document.createElement('li')
      todayEvent.textContent = `${event.label} (${event.location} le ${new Date(event.datetime).toLocaleDateString(undefined, dateOptions)}})`
      dailyList.appendChild(todayEvent)
    }
  })
  if (todayEvent === null) {
    dailyList.textContent = "Aucun événement aujourd'hui."
  }
}

async function saveEvent() {
  const eventsForm = document.getElementById('events-form')
  const label = eventsForm.elements['label'].value
  const event = {
    label: eventsForm.elements['label'].value,
    location: eventsForm.elements['location'].value,
    datetime: eventsForm.elements['datetime'].value,
  }
  let response = null
  if (eventsForm.elements['id'].value) {
    event.id = eventsForm.elements['id'].value
    response = await httpClient(`api/events/${event.id}`, "PUT", event)
    bottomMessage = `Evénement '${label}' sauvegardé.`
  } else {
    response = await httpClient("api/events", "POST", event)
    bottomMessage = `Nouvel événement ajouté: '${label}'`
  }
  if (response !== null) {
    M.toast({html: bottomMessage}) // non-passive event listener warning in console
    getEvents()
    const resetButton = document.getElementById('reset-button')
    resetButton.click()
  }
}

function resetForm() {
  const labelInput = document.getElementById('label')
  labelInput.focus()
  const eventsForm = document.getElementById('events-form')
  for(field of eventsForm.elements) {
    field.classList.remove('active')
    field.value = ''
  }
  disableValidateButton()
  eventsForm.reset()
  const formTitle = document.getElementById('form-title')
  formTitle.textContent = 'Créer un nouvel événement'
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
      saveEvent()
    }
  }
}

function onSearchKeyUp(event) {
  if (event.key === 'Enter') {
    const eventsList = document.getElementById('events-table')
    eventsList.focus()
  }
}
// Get events in the app starting
getEvents()