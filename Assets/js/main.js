// Select inputs from HTML
var nameInput = document.getElementById("siteName");
var urlInput = document.getElementById("siteURL");
var addBtn = document.getElementById("addBtn");
var deleteBtn = document.getElementById("deleteBtn");
var allSitesBody = document.getElementById("allSitesBody");
var formGroups = document.getElementsByClassName("form-group");
var formControls = document.getElementsByClassName("form-control");
var errorMsgModal = document.getElementById("errorMsgModal");
var searchInput = document.getElementById("searchName");

// Initialize global variables
var sitesList;
var updateIndex;

// Fill sitesList from localStorage after loading the page
if(localStorage.getItem("sitesList")) {
    sitesList = JSON.parse(localStorage.getItem("sitesList"));
    viewSites(sitesList);
} else {
    sitesList = [];
}

// Add validation classes for css
for(i = 0; i < formControls.length; i++) {
    formControls[i].addEventListener("input", (event) => {
        let sharedIndex = parseInt(event.target.dataset.id);
        if(sharedIndex == 1 && isValidsiteURL(urlInput.value)) {
            addValidationClass(formGroups[sharedIndex]);
        }
        addValidationClass(formGroups[sharedIndex]);
    });
}

function addSite() {
    // URL validation
    if(isValidsiteURL(urlInput.value) == false || isValidsiteName(nameInput.value) == false) {
        const modalInstance = new bootstrap.Modal(errorMsgModal);
        modalInstance.show();
        return;
    }

    // Creating an object for each bookmark row
    var site = {
        name: nameInput.value,
        url: urlInput.value,
    }
    sitesList.push(site);
    fromSitesListToLocalStorage();
    clearInputsValues();
    viewSites(sitesList);
    removeValidationClass();
}

function viewSites(list, term) {
    var allSites = '';
    for(i = 0; i < list.length; i++) {
        /* // for cell-name class: The used tag is better as it returns the actual style of the letter if it's upper or lower regardless the toLowerCase() function 
            <span class="cell-name d-none" id="cell-name-${i}">${term? list[i].name.toLowerCase().replace(term.toLowerCase(), `<span class="text-orange bg-orange">${term}</span>`) : list[i].name}</span>*/

        allSites += `
            <tr>
                <td scope="row">${i+1}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="form-group ms-auto">
                            <span class="cell-name" id="cell-name-${i}">
                                ${term ? (
                                    list[i].name.replace(new RegExp(term, "gi"), (match) => {
                                        const originalCasedMatch = list[i].name.charAt(match.indexOf(match[1]));
                                        return originalCasedMatch === match ? match : `<span class="text-orange bg-orange">${match}</span>`;
                                    })
                                ) : list[i].name}
                            </span>
                            <div class="input-group d-none" data-site-index="input-group-${i}">
                                <input class="form-control" type="text" name="siteNameEdit" id="siteNameEdit-${i}"
                                    placeholder="Edit Name" minlength="3" data-id="${i+2}">
                                <div class="input-group-append">
                                    <button onclick="updateSiteName();" class="btn btn-outline-primary opacity-75 rounded-0 rounded-end" type="button"><i class="fa fa-check"></i></button>
                                </div>
                            </div>
                        </div>
                        <div onclick="editSiteName(${i});" role="button" class="text-black-50 opacity-75 ps-3 ms-auto"><i class="fa-solid fa-edit"></i></div>
                    </div>
                </td>
                <td><a href="${list[i].url}" target="_blank" role="button" class="btn btn-visit"><i class="fa-solid fa-eye pe-md-2"></i><span class="d-none d-sm-inline-block">Visit</span></a></td>
                <td><button onclick="deleteSite(${i});" class="btn btn-delete"><i class="fa-solid fa-trash-can pe-md-2"></i><span class="d-none d-sm-inline-block">Delete</span></button></td>
            </tr>
        `;
    }
    allSitesBody.innerHTML = allSites;
    cell_name = document.querySelectorAll(".cell-name");
    nameInputGroups = document.querySelectorAll(".input-group.d-none");
    nameInputsEdit = document.querySelectorAll(".form-control[name = 'siteNameEdit']");
}

function editSiteName(index) {
    for(i = 0; i < sitesList.length; i++) {
        if(i == index) {
            cell_name[index].classList.add("d-none");
            nameInputGroups[index].classList.replace("d-none", "d-flex");

            updateIndex = index;
            nameInputsEdit[index].value = sitesList[index].name;
        }
    }
} 

function updateSiteName() {
    cell_name[updateIndex].classList.remove("d-none");
    nameInputGroups[updateIndex].classList.replace("d-flex", "d-none");

    sitesList[updateIndex].name = nameInputsEdit[updateIndex].value;
    fromSitesListToLocalStorage();
    viewSites(sitesList);
    removeValidationClass();
}

function deleteSite(index) {
    sitesList.splice(index, 1);
    fromSitesListToLocalStorage();
    viewSites(sitesList);
}

function searchFromSitesList() {
    var searchList = [];
    var term = searchInput.value;

    for(i = 0; i < sitesList.length; i++) {
        if(sitesList[i].name.toLowerCase().includes(term.toLowerCase())) {
            searchList.push(sitesList[i]);
        }
    }

    viewSites(searchList, term);
}

function fromSitesListToLocalStorage() {
    localStorage.setItem("sitesList", JSON.stringify(sitesList));
}

function clearInputsValues() {
    nameInput.value = '';
    urlInput.value = '';
}

function isValidsiteURL(url) {
    const pattern = new RegExp(
        '^([a-zA-Z]+:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i'
    );
    return pattern.test(url);
}

function isValidsiteName(name) {
    return name.length >= 3;
}

function addValidationClass(ele) {
    if(ele) {
        ele.classList.add("was-validated");
    }
}

function removeValidationClass() {
    document.querySelectorAll(".form-group.was-validated").forEach(formGroup => {
        formGroup.classList.remove("was-validated");
    });
}