'use strict';

{
  function getToday() {
    const today = new Date();
    today.setDate(today.getDate());
    let yyyy = today.getFullYear();
    let mm = ("0"+(today.getMonth()+1)).slice(-2);
    let dd = ("0"+today.getDate()).slice(-2);
    return yyyy+'-'+mm+'-'+dd;
  }

  function initInput() {
    const task = document.querySelector('.input-data input[type="text"]');
    const priority = document.querySelector('.input-priority select');
    const deadline = document.querySelector('.input-deadline input[type="date"]');
    const _deadline = document.querySelector('.filter-deadline input[type="date"]');
    task.value = "";
    const options = document.querySelector('.input-priority select').options;
    for(let option of options) {
      if(option.value === 'low') option.selected = true;
    }
    deadline.value = getToday();
    _deadline.value = getToday();
  }

  function initOptions() {
    lowCheck.checked = true;
    middleCheck.checked = true;
    highCheck.checked = true;
    deadlineInput.value = getToday();
    deadlineInput.disabled = true;
    deadlineSelect.options[0].selected = true;
    deadlineSelect.options[1].selected = false;
    deadlineSelect.options[2].selected = false;
    stat0Check.checked = true;
    stat1Check.checked = true;
    stat2Check.checked = true;
  }

  function renderTodos(_todos) {
    const tbody = document.querySelector('tbody');
    while(tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
    _todos.sort((first, second) => {
      if(first.deadline > second.deadline) return 1;
      if(first.deadline < second.deadline) return -1;
      if(first.priority === '低' && second.priority === '低') return 0;
      if(first.priority === '低' && second.priority === '中') return 1;
      if(first.priority === '低' && second.priority === '高') return 1;
      if(first.priority === '中' && second.priority === '低') return -1;
      if(first.priority === '中' && second.priority === '中') return 0;
      if(first.priority === '中' && second.priority === '高') return 1;
      if(first.priority === '高' && second.priority === '低') return -1;
      if(first.priority === '高' && second.priority === '中') return -1;
      if(first.priority === '高' && second.priority === '低') return 0;
    });
    _todos.forEach((todo) => {
      let tbody = document.querySelector('tbody');
      let tr = document.createElement('tr');
      let td = document.createElement('td');
      td.textContent = todo.task;
      tr.appendChild(td);
      td = document.createElement('td');
      td.textContent = todo.priority;
      tr.appendChild(td);
      td = document.createElement('td');
      td.textContent = todo.deadline;
      tr.appendChild(td);
      let select = document.createElement('select');
      let option = document.createElement('option');
      option.textContent = '作業前';
      option.selected = (todo.status === '作業前');
      select.appendChild(option);
      option = document.createElement('option');
      option.textContent = '作業中';
      option.selected = (todo.status === '作業中');
      select.appendChild(option);
      option = document.createElement('option');
      option.textContent = '完了';
      option.selected = (todo.status === '完了');
      select.appendChild(option);
      td = document.createElement('td');
      select.addEventListener('change', () => {
        todos.forEach((item) => {
          if(item.id === todo.id) {
            item.status = select.value;
          }
        });
        console.log(todos);
        localStorage.setItem('todos', JSON.stringify(todos));
      });
      td.appendChild(select);
      tr.appendChild(td);
      let btn = document.createElement('button');
      btn.textContent = '削除';
      btn.classList.add('btn');
      btn.classList.add('delete');
      btn.addEventListener('click', () => {
        if(!confirm('本当に削除しますか？')) {
          return;
        }
        todos = todos.filter((item) => {
          return item.id !== todo.id;
        });
        tbody.removeChild(tr);
        console.log(todos);
        localStorage.setItem('todos', JSON.stringify(todos));
      });
      td = document.createElement('td');
      td.appendChild(btn);
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function updateDisplay() {
    let low = lowCheck.checked;
    let middle = middleCheck.checked;
    let high = highCheck.checked;
    let input = deadlineInput.value.replaceAll('-', '/');
    let select = deadlineSelect.value;
    let stat0 = stat0Check.checked;
    let stat1 = stat1Check.checked;
    let stat2 = stat2Check.checked;
    
    let newTodos = [...todos];
    if(!low) {
      newTodos = newTodos.filter((todo) => {
        return todo.priority !== '低';
      });
    }
    if(!middle) {
      newTodos = newTodos.filter((todo) => {
        return todo.priority !== '中';
      });
    }
    if(!high) {
      newTodos = newTodos.filter((todo) => {
        return todo.priority !== '高';
      });
    }
    if(select === '以前') {
      newTodos = newTodos.filter((todo) => {
        return todo.deadline <= input;
      });
    }
    else if(select === '以降') {
      newTodos = newTodos.filter((todo) => {
        return todo.deadline >= input;
      });
    }
    if(!stat0) {
      newTodos = newTodos.filter((todo) => {
        return todo.status !== '作業前';
      });
    }
    if(!stat1) {
      newTodos = newTodos.filter((todo) => {
        return todo.status !== '作業中';
      });
    }
    if(!stat2) {
      newTodos = newTodos.filter((todo) => {
        return todo.status !== '完了';
      });
    }
    renderTodos(newTodos);
  }

  let todos;
  
  const clearBtn = document.getElementById('clear');
  const addBtn = document.getElementById('add');
  const filterBtn = document.querySelector('.filter-btn');

  let filterFlag = false;

  const resetBtn = document.getElementById('reset');
  const execBtn = document.getElementById('exec');

  const lowCheck = document.getElementById('filter-priority-low');
  const middleCheck = document.getElementById('filter-priority-middle');
  const highCheck = document.getElementById('filter-priority-high');

  const deadlineInput = document.querySelector('.filter-deadline input[type="date"]');
  const deadlineSelect = document.querySelector('.filter-deadline select');
  
  const stat0Check = document.getElementById('filter-status-0');
  const stat1Check = document.getElementById('filter-status-1');
  const stat2Check = document.getElementById('filter-status-2');

  clearBtn.addEventListener('click', () => {
    initInput();
  });

  addBtn.addEventListener('click', () => {
    const task = document.querySelector('.input-data input[type="text"]');
    const priority = document.querySelector('.input-priority select');
    const deadline = document.querySelector('.input-deadline input[type="date"]');
    let todo = {
      id: new Date().getTime().toString(),
      task: task.value,
      priority: priority.options[priority.selectedIndex].textContent,
      deadline: deadline.value.replaceAll('-', '/'),
      status: '作業前'
    }
    todos.push(todo);
    renderTodos(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
  });

  filterBtn.addEventListener('click', () => {
    const more = document.querySelector('.more');
    const less = document.querySelector('.less');
    const settings = document.querySelector('.filter-settings');
    const btns = document.querySelector('.filter-btns');
    more.classList.remove('display-none');
    more.classList.remove('display-inline');
    less.classList.remove('display-none');
    less.classList.remove('display-inline');
    settings.classList.remove('display-none');
    settings.classList.remove('display-flex');
    btns.classList.remove('display-none');
    btns.classList.remove('display-block');
    if(filterFlag) {
      filterFlag = false;
      more.classList.add('display-inline');
      less.classList.add('display-none');
      settings.classList.add('display-none');
      btns.classList.add('display-none');
    }
    else {
      filterFlag = true;
      more.classList.add('display-none');
      less.classList.add('display-inline');
      settings.classList.add('display-flex');
      btns.classList.add('display-block');
    }
  });

  deadlineSelect.addEventListener('click', () => {
    if(deadlineSelect.value === '指定なし') {
      deadlineInput.disabled = true;
    }
    else {
      deadlineInput.disabled = false;
    }
  });

  resetBtn.addEventListener('click', initOptions);
  execBtn.addEventListener('click', updateDisplay);

  window.addEventListener('load', () => {
    initInput();
    initOptions();
    todos = JSON.parse(localStorage.getItem('todos'));
    if(todos === null) {
      todos = [];
    }
    filterFlag = false;
    const more = document.querySelector('.more');
    const less = document.querySelector('.less');
    const settings = document.querySelector('.filter-settings');
    const btns = document.querySelector('.filter-btns');
    more.classList.add('display-inline');
    less.classList.add('display-none');
    settings.classList.add('display-none');
    btns.classList.add('display-none');
    renderTodos(todos);
  });
}