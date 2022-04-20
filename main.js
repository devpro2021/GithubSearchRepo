const search = document.querySelector(".search");
const input = search.querySelector(".search__input");
const autocompleteBox = search.querySelector(".search__autocomplete");
const repoContainer = document.querySelector(".repos");
const baseURL = `https://api.github.com/`;

input.addEventListener(
  "input",
  debounce(() => {
    clearList(autocompleteBox);
    searchRepo(input.value);
  }, 300)
);

function clearList(namelist) {
  namelist.innerHTML = "";
}

function searchRepo(value) {
	value = value.trim();
  if (!value) {
    clearList(autocompleteBox);
  } else {
    try {
      repoRequest(value);
    } catch (e) {
      console.log("Error fetch" + e);
    }
  }
}

function debounce(func, wait, immediate) {
  let timeout;

  return function executedFunction() {
    const context = this;
    const args = arguments;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

const repoRequest = async (search) => {
  return await fetch(
    `${baseURL}search/repositories?q=${search}&per_page=5`
  ).then((res) => {
    res.json().then((res) => {
      res.items.forEach((item) => {
				const listItem = createElement('li', `${item.name}`);
				listItem.addEventListener(
          "click",
          () => {
            const choiseItem = createElement("div", "", "repo");
            choiseItem.innerHTML = `
						<div class="repo__info">
						<p class="repo_name">Name: ${item.name}</p>
						<p class="repo_owner">Owner: ${item.owner.login}</p>
						<p class="repo_stars">Stars: ${item.stargazers_count}</p>
					</div>
					<button class="remove"></button>
					`;
            choiseItem.addEventListener("click", deleteRepo, { once: true });
            repoContainer.append(choiseItem);
          },
          { once: true }
        );
				autocompleteBox.append(listItem);
			})
    });
  });
};

function createElement(elementTag, innerText, elementClass) {
  const element = document.createElement(elementTag);
  if (elementClass) {
    element.classList.add(elementClass);
  }
  if (innerText) {
    element.innerHTML = innerText;
  }
  return element;
}

const deleteRepo = (e) => {
  if (e.target.className === "remove") {
    e.target.closest(".repo").remove();
  }
};

