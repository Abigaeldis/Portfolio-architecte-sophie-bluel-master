const gallerySection = document.querySelector(".gallery");
const filterButtons = document.querySelectorAll(".filtersbuttons button");
let galleryData = [];

// getting the informations from the API ( with fetch )
async function fetchGalleryData() {
  const response = await fetch("http://localhost:5678/api/works");
  galleryData = await response.json();
}

// Clear the content of .gallery
function clearGallerySection() {
  gallerySection.innerHTML = "";
}

// Creates a gallery item using a given item object (we got it with fetch)
function createGalleryItem(item) {
  const galleryItem = document.createElement("figure");
  const imageElement = document.createElement("img");
  imageElement.src = item.imageUrl;
  const nameElement = document.createElement("figcaption");
  nameElement.innerText = item.title;
  galleryItem.appendChild(imageElement);
  galleryItem.appendChild(nameElement);
  gallerySection.appendChild(galleryItem);
}

function displayGalleryItems(items) {
  clearGallerySection();
  for (let i = 0; i < items.length; i++) {
    createGalleryItem(items[i]);
  }
}

//get the id of the buttons so we can compare it in the filterGalleryItems functions, also add a class for active buttons and remove it to the non active ones
function setupFilterButtons() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((button) => button.classList.remove("buttonfilters-active"));
      button.classList.add("buttonfilters-active");
      const categoryId = parseInt(button.id);
      filterGalleryItems(categoryId);
    });
  });
}

// filter the gallery, if the ID of the button = 0, display all works. Else display only the item.category.id that matches the buttons id
function filterGalleryItems(categoryId) {
  if (categoryId === 0) {
    displayGalleryItems(galleryData);
  } else {
    const filteredItems = galleryData.filter((item) => item.category.id == categoryId);
    displayGalleryItems(filteredItems);
  }
}

// initialisation of the gallery + buttons
async function init() {
  await fetchGalleryData();
  displayGalleryItems(galleryData);
  setupFilterButtons();
}

init();

//////////////new display if user logged in/////////////

//function create the edit banner in the header
function editmode() {
  // Create the elements
  var divElement = document.createElement("div");
  divElement.classList.add("editmode");
  var iconElement = document.createElement("i");
  iconElement.classList.add("fas", "fa-edit");
  var spanElement = document.createElement("span");
  spanElement.textContent = "Mode édition";

  var headerElement = document.querySelector("header");

  var buttonElement = document.createElement("button");
  buttonElement.textContent = "publier les changements";

  // Append the elements to the div
  spanElement.appendChild(iconElement);
  divElement.appendChild(spanElement);
  divElement.appendChild(buttonElement);
  // Append the div element to the header
  headerElement.appendChild(divElement);
}

// new layout with login token
let storedToken = sessionStorage.getItem("token");
console.log(storedToken);
if (storedToken !== "undefined" && storedToken !== null) {
  var editButtons = document.querySelectorAll(".editbuttons");
  document.querySelector(".filters").innerHTML = "";
  console.log(editButtons);
  editmode();
  for (var i = 0; i < editButtons.length; i++) {
    editButtons[i].style.display = "flex";
  }
} else {
  const editButtons = document.querySelector(".editbuttons");
  const editGallery = document.querySelector(".editbuttonsgallery");
  console.log(editButtons);
  editButtons.style.display = "none";
  editGallery.style.display = "none";
}

// edit button behavior management
const buttonEditGallery = document.querySelector(".editbuttonsgallery");
const buttonCloseGallery = document.querySelector(".closeedit");
function editgallery() {
  var divElement = document.createElement("div");
  var editWindow = document.createElement("div");
  var headerEdit = document.createElement("div");
  var buttonElement = document.createElement("button");
  var titleElement = document.createElement("h2");
  var galleryMini = document.createElement("div");
  var buttonAdd = document.createElement("button");
  var buttonSuppr = document.createElement("button");

  editWindow.classList.add("gallerydiv");
  divElement.classList.add("editgallery");
  buttonElement.classList.add("closeedit");
  headerEdit.classList.add("headeredit");
  galleryMini.classList.add("gallerymini");
  buttonAdd.classList.add("buttonadd");
  buttonSuppr.classList.add("buttonsuppr");

  titleElement.textContent = "Galerie photo";
  buttonElement.textContent = "X";
  buttonAdd.textContent = "Ajouter une photo";
  buttonSuppr.textContent = "Supprimer la galerie";

  document.body.appendChild(divElement);
  document.body.appendChild(editWindow);
  editWindow.appendChild(headerEdit);
  headerEdit.appendChild(buttonElement);
  editWindow.appendChild(titleElement);
  editWindow.appendChild(galleryMini);
  editWindow.appendChild(buttonAdd);
  editWindow.appendChild(buttonSuppr);
}

// creation de la mini gallery

function creationMiniGalerie(galerie) {
  const sectionGallery = document.querySelector(".gallerymini");
  const fichePhoto = document.createElement("figure");
  const deleteButton = document.createElement("button");
  deleteButton.classList.add(galerie.id);
  const imageElement = document.createElement("img");
  imageElement.src = galerie.imageUrl;
  imageElement.classList.add(galerie.id);
  const nomElement = document.createElement("figcaption");
  nomElement.innerText = "éditer";
  const trash = document.createElement("span");
  trash.classList.add("fas", "fa-trash");

  sectionGallery.appendChild(fichePhoto);
  fichePhoto.appendChild(imageElement);
  fichePhoto.appendChild(nomElement);
  fichePhoto.appendChild(deleteButton);
  deleteButton.appendChild(trash);
}

// opening and closing the edit mode window
buttonEditGallery.addEventListener("click", function (e) {
  editgallery();
  for (let i = 0; i < galleryData.length; i++) {
    creationMiniGalerie(galleryData[i]);
  }
  const buttonCloseGallery = document.querySelector(".closeedit");
  buttonCloseGallery.addEventListener("click", function (e) {
    const editGalleryDiv = document.querySelector(".editgallery");
    const galleryDiv = document.querySelector(".gallerydiv");
    editGalleryDiv.remove();
    galleryDiv.remove();
  });

  const outModale = document.querySelector(".editgallery");
  outModale.addEventListener("click", function (e) {
    const editGalleryDiv = document.querySelector(".editgallery");
    const galleryDiv = document.querySelector(".gallerydiv");
    editGalleryDiv.remove();
    galleryDiv.remove();
  });

  // remove picture
  const buttonDelete = document.querySelectorAll(".gallerymini figure button");
  buttonDelete.forEach((buttonDelete) => {
    buttonDelete.addEventListener("click", function (e) {
      console.log(buttonDelete.className);
      var targetedCategory = buttonDelete.className;
      for (let i = 0; i < galleryData.length; i++) {
        const arrGalerie = galleryData[i];

        if (arrGalerie.id == targetedCategory) {
          console.log("hello");
          fetch("http://localhost:5678/api/works/" + targetedCategory, {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + storedToken,
            },
          });
        }
      }
    });
  });

  //add picture
  const buttonAdd = document.querySelector(".buttonadd");
  buttonAdd.addEventListener("click", function (e) {
    console.log("hello");
    document.querySelector(".gallerydiv").innerHTML = "";
    createForm();
  });
});

// create form add image function

function createForm() {
  const galleryDiv = document.querySelector(".gallerydiv");

  const addTitle = document.createElement("h2");
  addTitle.innerText = "Ajout photo";
  galleryDiv.appendChild(addTitle);

  const form = document.createElement("form");
  form.id = "myForm";

  // create label and input for uploading image
  const imageLabel = document.createElement("label");
  imageLabel.setAttribute("for", "image");
  imageLabel.innerHTML =
    " <span class='fas fa-image'></span><br><span class='ajoutphoto'>+ Ajouter photo</span><span class='infoupload'>jpg, png : 4mo max</span>";
  imageLabel.classList.add("imagelabel");
  const imageInput = document.createElement("input");
  imageInput.setAttribute("type", "file");
  imageInput.setAttribute("id", "image");
  imageInput.setAttribute("name", "image");
  form.appendChild(imageLabel);
  form.appendChild(imageInput);
  form.appendChild(document.createElement("br"));

  // create image preview function
  function createImagePreview(file) {
    // create a new file reader
    const reader = new FileReader();

    // set up the file reader to read the file as a data URL
    reader.readAsDataURL(file);

    // add an event listener to the file reader
    reader.addEventListener("load", () => {
      // create a new image element
      const imagePreview = document.createElement("img");

      // set the src attribute of the image element to the data URL
      imagePreview.src = reader.result;

      //clean the label to let space to the preview
      document.querySelector(".imagelabel").innerHTML = "";
      // add the image element to the DOM
      imageLabel.appendChild(imagePreview);
    });
  }

  // add an event listener to the input element
  imageInput.addEventListener("change", (e) => {
    // get the uploaded file
    const file = e.target.files[0];

    // create image preview
    createImagePreview(file);
  });

  // add event listener for drag and drop
  imageInput.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  // add event listener for drop
  imageInput.addEventListener("drop", (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    // create image preview
    createImagePreview(file);
  });

  // create label and input for entering text
  const textLabel = document.createElement("label");
  textLabel.setAttribute("for", "text");
  textLabel.textContent = "Titre";
  const textInput = document.createElement("input");
  textInput.setAttribute("type", "text");
  textInput.setAttribute("id", "text");
  textInput.setAttribute("name", "title");
  form.appendChild(textLabel);
  form.appendChild(textInput);

  // create label and select for selecting option
  const selectLabel = document.createElement("label");
  selectLabel.setAttribute("for", "select");
  selectLabel.textContent = "Catégorie";
  const selectInput = document.createElement("select");
  selectInput.setAttribute("id", "select");
  selectInput.setAttribute("name", "category");
  const option1 = document.createElement("option");
  option1.setAttribute("value", "1");
  option1.textContent = "Objets";
  const option2 = document.createElement("option");
  option2.setAttribute("value", "2");
  option2.textContent = "Appartements";
  const option3 = document.createElement("option");
  option3.setAttribute("value", "3");
  option3.textContent = "Hotels & restaurants";
  selectInput.appendChild(option1);
  selectInput.appendChild(option2);
  selectInput.appendChild(option3);
  form.appendChild(selectLabel);
  form.appendChild(selectInput);
  form.appendChild(document.createElement("br"));
  form.appendChild(document.createElement("br"));

  // create submit button
  const submitButton = document.createElement("input");
  submitButton.setAttribute("type", "submit");
  submitButton.setAttribute("value", "Valider");
  submitButton.classList.add("uploadsubmit");
  form.appendChild(submitButton);

  // add form to document
  galleryDiv.appendChild(form);

  // add event listener for form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // prevent form from submitting

    // get form data
    const formData = new FormData(form);

    for (const item of formData) {
      console.log(item[0], item[1]);
    }

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + storedToken,
      },
      body: formData,
    });
  });
}

// closing the editmode version of the website
const finishEdit = document.querySelector(".editmode button");
finishEdit.addEventListener("click", function (event) {
  console.log("finish");
  sessionStorage.removeItem("token");
  location.reload();
});
