
export const getEmployees = async () => {
   const res = await fetch("http://localhost:3500/employees", {
      method: "GET"
   });

   if (!res.ok) {
     throw new Error(`Failed to get employees: ${response.statusText}`);
   }

   const data = await res.json();
   return data;
}

export const addEmployee = async (firstname, lastname, age, isMarried) => {
   const res = await fetch("http://localhost:3500/employees", {
     method: "POST",
     headers: {
       "Content-Type": "application/json", // When doing POST/PUT/PATCH, you need to set the Content-Type
     },
     body: JSON.stringify({ firstname, lastname, age, isMarried }),
   });

   if (!res.ok) {
     throw new Error(`Failed to add employee: ${response.statusText}`);
   }

   const data = await res.json(); // Returned employee data
   return data;
};

const seeEmployeeById = async(empId)=>{
    const res = await fetch(`http://localhost:3500/employees/${empId}`,{
        method:"GET"
    })

    if(!res.ok){
      throw new Error(`Failed to get employees: ${response.statusText}`)
    }
    
    const data = await res.json();
    return data;
}


// Add the rest of the functions
//delete
export const deleteEmployee = async(id)=>{
    const res = await fetch(`http://localhost:3500/employees/${id}`,{
        method:"DELETE"
    })

   if (!res.ok) {
     throw new Error(`Failed to get employees: ${response.statusText}`);
   }

   return 'Employee deleted';
}

//search
export const searchEmployee = async(keyword)=>{
    const res = await fetch(`http://localhost:3500/employees/search?firstname=${keyword}`,{
        method:"GET"
        })
    if (!res.ok) {
     throw new Error(`Failed to add employee: ${response.statusText}`);
   }

   const data = await res.json(); // Returned employee data
   return data;
}

//update
export const updateEmployee = async (empId, updates) => {
  const { firstname, lastname, age, isMarried } = updates
   const res = await fetch(`http://localhost:3500/employees/${empId}`, {
      method: "PUT",
     headers: {
       "Content-Type": "application/json", // When doing POST/PUT/PATCH, you need to set the Content-Type
     },
     body: JSON.stringify({ firstname, lastname, age, isMarried }),
   });

   if (!res.ok) {
     throw new Error(`Failed to add employee: ${response.statusText}`);
   }

   const data = await res.json(); // Returned employee data
   return data;
};


document.addEventListener('DOMContentLoaded',async()=>{
    const employees = await getEmployees()
    await disyplayEmployee(employees)
})

//Edit form button
document.querySelector('.edit-submit-btn').addEventListener('click',async(e)=>{
  e.preventDefault()
  const form = document.querySelector('form.edit-form')
  const empId = form.id
  const formData = new FormData(form)

  const updates ={
    firstname: formData.get('edit-firstname'),
    lastname: formData.get('edit-lastname'),
    age: Number(formData.get('edit-age')),
    isMarried: formData.get('edit-isMarried')!==null?true:false
  }

  await updateEmployee(empId, updates)
  
  form.reset()
})

//Add Employee
document.querySelector('.add-submit-btn').addEventListener('click', async(e)=>{
  e.preventDefault()
  const form = document.querySelector('.add-form')
  const formData = new FormData(form)

  const newEmp ={
    firstname: formData.get('add-firstname'),
    lastname: formData.get('add-lastname'),
    age: formData.get('add-age'),
    isMarried: formData.get('add-isMarried')!==null?true:false
  }

  await addEmployee(newEmp.firstname, newEmp.lastname, newEmp.age, newEmp.isMarried)

  form.reset()

  const employees = await getEmployees()
  await disyplayEmployee(employees)
})

//Search
document.querySelector(".search-btn").addEventListener('click',async(e)=>{
  const input = document.querySelector("#search")
  const keyword = input.value

  const data = await searchEmployee(keyword)
  input.value=""

  const cardsContainer = document.querySelector('div.emp-detail-cards')
  cardsContainer.innerHTML=""

  data.forEach(emp => {
    renderCard(emp, cardsContainer)
  });
})


async function disyplayEmployee(employees){
    const ul = document.querySelector('div.emp-list ul')
    const cardsContainer = document.querySelector('div.emp-detail-cards')

    ul.innerHTML=""

    employees.map(employee=>{
        const li= document.createElement('li')
        li.innerHTML=`
         <div class="emp-card" id=${employee.id}>
         <span>${employee.firstname} ${employee.lastname}</span>
         <button id="view-btn">VIEW</button>
         <button id="edit-btn">EDIT</button>
         <button id="delete-btn">DELETE</button>
         </div>
        `
        li.querySelector('#view-btn').addEventListener('click',async (e)=>{
          const btn = e.target
          const empCard = btn.parentElement
          const empId = empCard.getAttribute('id')
          const emp = await seeEmployeeById(empId.toString())
          cardsContainer.innerHTML=""
          renderCard(emp)

        })

        //Set value to edit form
        li.querySelector('#edit-btn').addEventListener('click',async(e)=>{
          const btn = e.target
          const empCard = btn.parentElement
          const empId = empCard.getAttribute('id')
          const emp = await seeEmployeeById(empId.toString())
          const form = document.querySelector('form.edit-form')

          form.reset()
          form.id= empId

          form.querySelector('input#edit-firstname').value = emp.firstname
          form.querySelector('input#edit-lastname').value = emp.lastname
          form.querySelector('input#edit-age').value = emp.age
          if(emp.isMarried){
            form.querySelector('input#edit-isMarried').checked =true
          }
        })

        //Delete
        li.querySelector('#delete-btn').addEventListener('click', async(e)=>{
          const btn = e.target
          const empCard = btn.parentElement
          const empId = empCard.getAttribute('id')
          await deleteEmployee(empId)

          const employees = await getEmployees()
          await disyplayEmployee(employees)
        })

        ul.append(li)
    })
}

function renderCard(emp,cardsContainer){
    //Render the card
    const card = document.createElement('div')
    card.className="detail-card"
    card.id = emp.id

    card.innerHTML=`
    <div>First name: ${emp.firstname}</div>
    <div>Last name: ${emp.lastname}</div>
    <div>Age: ${emp.age}</div>
    <div>Marries: ${emp.isMarried?"Yes":"No"}</div>
    `
    cardsContainer.appendChild(card)
}
