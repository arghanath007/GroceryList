// ****** SELECT ITEMS **********
const alert=document.querySelector('.alert');
const form=document.querySelector('.grocery-form');
const grocery=document.querySelector('#grocery');
const submitBtn=document.querySelector('.submit-btn');
const container=document.querySelector('.grocery-container');
const list=document.querySelector('.grocery-list');
const clearBtn=document.querySelector('.clear-btn');
// edit option
let editElement;
let editFlag=false;
let editID="";
// ****** EVENT LISTENERS **********
// Submit Form
form.addEventListener('submit',addItem);
// Clear Items
clearBtn.addEventListener('click',clearItems);
// Load items
window.addEventListener('DOMContentLoaded', setupItems);
// ****** FUNCTIONS **********
function addItem(e)
{
    e.preventDefault();
    const value=grocery.value;
    const id=new Date().getTime().toString();
    // if(value !== "" && editFlag === false)
    if(value && !editFlag)
    {
        createListItem(id,value);
        // display alert
        displayAlert("Item added to the list", "success");
        // Show container
        container.classList.add('show-container');
        // Add to local storage
        addToLocalStorage(id,value);
        // Set back to default
        setBackToDefault();
    }
    // else if(value !== "" && editFlag === true)
    else if(value && editFlag)
    {
        // console.log("editing");
        editElement.innerHTML=value;
        displayAlert('Value changed','success');
        // Edit local storage
        editLocalStorage(editID,value);
        setBackToDefault();
    }
    else
    {
        // console.log("Empty input or item");
        displayAlert("Please Enter a value", "danger");
    }
}

// display Alert
function displayAlert(text, action)
{
    
    alert.textContent=text;
    alert.classList.add(`alert-${action}`);

    // remove Alert
    setTimeout(function(){
    alert.textContent="";
    alert.classList.remove(`alert-${action}`);
    },1000);
}

// Clear items
function clearItems()
{
    const items=document.querySelectorAll('.grocery-item');
    if(items.length >0)
    {
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    container.classList.remove('show-container');
    displayAlert("Empty List", "danger");
    setBackToDefault();
    localStorage.removeItem('list'); 
}

// Delete Items
function deleteItem(e)
{
    // console.log("Item deleted");
    const element=e.currentTarget.parentElement.parentElement;
    const id=element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0)
    {
        container.classList.remove('show-container');
    }
    displayAlert('item removed','danger');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}
// Editing Items
function editItem(e)
{
    // console.log("Edit item");
    const element=e.currentTarget.parentElement.parentElement;
    // Set edit item
    editElement=e.currentTarget.parentElement.previousElementSibling;
    // Set form value
    grocery.value=editElement.innerHTML;
    editFlag=true;
    editID=element.dataset.id;
    submitBtn.textContent='edit';
}



// Set back to default
function setBackToDefault()
{
    // console.log("Set back to default");
    grocery.value="";
    editFlag=false;
    editID="";
    submitBtn.textContent="submit";
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id,value)
{
    // console.log("Added to local storage");
    const grocery={id,value};
    let items= getLocalStorage();
    // console.log(items);
    items.push(grocery);
    localStorage.setItem('list',JSON.stringify(items));
    // console.log("Added to local storage");
}

function removeFromLocalStorage(id)
{
    let items=getLocalStorage();
    items=items.filter(function(item){
    if(item.id !== id)
    {
        return item;
    }
    });
    localStorage.setItem('list',JSON.stringify(items));
}
function editLocalStorage(id,value)
{
    let items=getLocalStorage();
    items=items.map(function(item){
        if(item.id === id)
        {
            item.value=value
        }
        return item;
    });
    localStorage.setItem('list',JSON.stringify(items));
}
function getLocalStorage()
{
    return localStorage.getItem('list')? JSON.parse(localStorage.getItem('list')): [];
}
// ****** SETUP ITEMS **********
function setupItems()
{
    let items=getLocalStorage();
    if(items.length >0)
    {
        items.forEach(function(item)
        {
            createListItem(item.id,item.value)
        });
        container.classList.add('show-container');
    }
}
function createListItem(id, value)
{
     // console.log("Adding items to list");
        const element=document.createElement('article');
        // Add class
        element.classList.add('grocery-item');
        // Add id
        const attr=document.createAttribute('data-id');
        attr.value=id;
        element.setAttributeNode(attr);
        element.innerHTML=`<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`
            const deleteBtn=element.querySelector('.delete-btn');
            const editBtn=element.querySelector('.edit-btn');
            deleteBtn.addEventListener('click',deleteItem);
            editBtn.addEventListener('click',editItem);
            // Append child
            list.appendChild(element);
}