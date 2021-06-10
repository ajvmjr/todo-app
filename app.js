const ul = document.querySelector('.list')
const ulCompleted = document.querySelector('.completed')


const createTodo = ul.firstElementChild
let completeds = []

const completedButton = document.querySelector('#completed-btn')
const allBtn = document.querySelector('#all-btn')
const clearBtn = document.querySelector('#clear-btn')

const toggleClasses = whichList => {
  if(whichList === 'completed'){
    document.querySelector('.li-completed').lastElementChild.className = 'active-list'
    return
  }
  document.querySelector('.li-footer').firstElementChild.className = 'active-list' 
}

const setItemsLeftCounter = () => {
  const counter = document.getElementById('items-counter')
  const arr = Array.from(ul.querySelectorAll('li'))
  let res = 0;
  arr.shift()

  res = arr.filter(li => {
    const input = li.querySelector('.input-checkbox')
    if(input){
      return input.checked === false
    }
  }).length
  counter.innerText = res >= 1 ? `${res} Itens restando` : `${res} Item restando`
}

toggleClasses('all')

const clearFinisheds = () => {
  const arr = Array.from(ul.querySelectorAll('li'))
  Array.from(arr).forEach(li => {
    const input = li.querySelector('.input-checkbox')
    if(input && input.checked){
      const parentNode = li.parentNode
      if(parentNode === null) return
      parentNode.removeChild(li)
    }
  })
}

const addEventListenerToInputText = li => {
  const input = li.querySelector('.input-text')
  const initialValue = input.value 
  let changesCounter = 0;

  input.addEventListener('keypress', event => {
    if(input.value !== initialValue && changesCounter === 0){
      changesCounter++;
      input.value = ''
    }
    if(event.code === 'Enter'){
      input.className = 'input-text input-text-unfocused'
    }
  })
  input.addEventListener('blur', () => {
    if(input.checked){
      input.className = 'input-text input-text-unfocused checked'
    }else {
      input.className = 'input-text input-text-unfocused'
    }
  })
  input.addEventListener('focus', () => {
    if(input.checked){
      input.className = 'input-text checked'
    }
    input.className = 'input-text'
  })
}

const addListenersToLi = li => {
  addEventListenerToInputText(li)
  addEventListenerToInputCheckbox(li)
  addEventListenerToCloseIcon(li)
}

const displayNormalList = list => {
  toggleClasses('all')
  const lastElement = ul.querySelector('.actions')
  ul.classList.toggle('display-none')
  ulCompleted.classList.toggle('display-none')

  list.forEach(li => {
    ul.insertBefore(li, lastElement)
    addListenersToLi(li)
  })
}

const generateNormalList = () => {
  const currentList = Array.from(ulCompleted.querySelectorAll('li'))
  currentList.pop()
  currentList.shift()

  displayNormalList(currentList)
}

const displayCompletedList = list => {
  if(list.length === 0){
    const li = document.querySelector('.no-items')
    li.style.display = 'flex'
  } else {
    const li = document.querySelector('.no-items')
    li.style.display = 'none'
  }

  const lastElement = document.querySelector('.li-completed')
  ul.classList.toggle('display-none')
  ulCompleted.classList.toggle('display-none')
  list.forEach(li => {
    ulCompleted.insertBefore(li, lastElement)
    addListenersToLi(li)
  })
}

const generateCompletedList = () => {
  toggleClasses('completed')
  const currentList = ul.querySelectorAll('li')
  completeds = Array.from(currentList).filter(li => {
    const input = li.querySelector('.input-checkbox')
    if(input){
      return input.checked
    }
  })
  displayCompletedList(completeds)
}

const addEventListenerToInputCheckbox = li => {
  const input = li.firstElementChild
  input.addEventListener('change', () => {
    if(input.checked){
      input.className = 'input-checkbox input-checkbox-focused'
      input.nextElementSibling.className = 'input-text checked'
      setItemsLeftCounter()
      return
    }
    input.className = 'input-checkbox'
    input.nextElementSibling.className = 'input-text'
    setItemsLeftCounter()
  })
}

const addEventListenerToCloseIcon = li => {
  const closeIcon = li.querySelector('img')
  closeIcon.addEventListener('click', () => {
    const parentNode = li.parentNode
    if(parentNode === null) return
    parentNode.removeChild(li)
    setItemsLeftCounter()
  })
}

const addNewTodo = () => {
  const lastElement = ul.querySelector('.actions')
  const li = document.createElement('li')
  li.className = 'list-item no-borders'
  li.innerHTML = `<input type="checkbox" class="input-checkbox">
                  <input class="input-text"></input>
                  <img src="./images/icon-cross.svg" alt="Excluir item" class="remove-icon">
                 `
  li.id = Number(ul.firstElementChild.id) + 1;
  li.querySelector('.input-text').value = 'Digite aqui o título da tarefa'
  ul.insertBefore(li, lastElement)
  addListenersToLi(li)
  setItemsLeftCounter()
}

createTodo.addEventListener('click', addNewTodo)
completedButton.addEventListener('click', generateCompletedList)
allBtn.addEventListener('click', generateNormalList)
clearBtn.addEventListener('click', clearFinisheds)
