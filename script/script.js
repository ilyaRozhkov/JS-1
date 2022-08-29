const requestURL = "https://api.github.com/search/repositories?q=",
searchInput = document.querySelector(".search__input"),
searchDropdown = document.querySelector(".search__dropdown"),
repositoriesWrapper = document.querySelector(".repositories__wrapper"),
form = document.getElementsByTagName("form")[0];

const debounce = (func, delay) => {
  let inDebounce;
  return function () {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(this, arguments), delay);
  };
};
inputData=debounce(inputData,1000)

searchInput.addEventListener('input', inputData)

function inputData(e){
  while(searchDropdown.firstChild){
    searchDropdown.removeChild(searchDropdown.lastChild);
  }
  if(e.target.value.length!=0){
    createDropdown(e.target.value);
  }
};

function createDropdown(value){
  fetchFunctionData(requestURL + value + "&per_page=5")
  .then((data) =>{
    if(!data){
      return;
    }
    const perositories = data.items;
    const fragment = document.createDocumentFragment();
    console.log(perositories);
    if(!perositories.length){
      const item = document.createElement("div");
      item.classList.add('item');
      fragment.appendChild(item);
    }else{
      perositories.forEach((data)=>{
      const item=document.createElement("div");
      item.classList.add("item");
      item.innerHTML = data.full_name;
      item.addEventListener("click", () => {
        searchInput.value = "";
        searchDropdown.classList.remove("search__dropdown--active");
        addNewRepository(repositoriesWrapper, data);
      });
      fragment.appendChild(item);
    });
    }
    searchDropdown.appendChild(fragment);
    searchDropdown.classList.add("search__dropdown--active");
  }).catch((error) => {
    console.error(error);
    return true;
  });

}

function fetchFunctionData(url){
  return fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return response.json().then(() => {
      const fragment = document.createDocumentFragment(),
        item = document.createElement("div");
      item.classList.add("item");

      fragment.appendChild(item);
      searchDropdown.appendChild(fragment);
      searchDropdown.classList.add("search__dropdown--active");
    });
  });
}

function addNewRepository(parent, data){
  const fragment = document.createDocumentFragment(),
  repository = document.createElement("div"),
  repositoryHeader = document.createElement("h4"),
  repositoryLink = document.createElement("a"),
  repositoryAuthor = document.createElement("span"),
  repositoryStars = document.createElement("div"),
  repositoryStar = document.createElement("span"),
  repositoryDelete = document.createElement("div");

  repository.classList.add(`repository`);
  repositoryHeader.classList.add("repository__header");
  repositoryAuthor.classList.add("repository__author");
  repositoryDelete.classList.add("repository__delete-button");

  repositoryLink.textContent = data.name;
  repositoryAuthor.textContent = `By ${data.owner.login}`;
  repositoryStar.textContent = `Stars: ${data.stargazers_count}`;
  repositoryDelete.textContent = "Delete";

  repositoryStars.appendChild(repositoryStar);

  repositoryHeader.appendChild(repositoryLink);
  repository.appendChild(repositoryHeader);
  repository.appendChild(repositoryAuthor);
  repository.appendChild(repositoryStars);
  repository.appendChild(repositoryDelete);
  fragment.appendChild(repository);

  repositoryLink.setAttribute("href", data.html_url);
  repositoryLink.setAttribute("target", "_blank");
  repository.setAttribute("id", `${data.name}`)

  repositoryDelete.addEventListener("click", (event) => {
    const parent = document.querySelector(".repositories__wrapper")
    const child = document.getElementById(`${data.name}`);
    parent.removeChild(child);
  });

  parent.appendChild(fragment);
}