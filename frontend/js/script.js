
export function displayEmployee(employees){
    const ul = document.querySelector('div.emp-list ul')

    employees.map(employee=>{
        const li= document.createElement('li')
        li.innerHTML=`
         <div class="emp-card">
         <span>${employee.firstname} ${employee.lastname}</span>
         <button>VIEW</button>
         <button>EDIT</button>
         <button>DELETE</button>
         </div>
        `
        ul.appendChild(ul)
    })
}