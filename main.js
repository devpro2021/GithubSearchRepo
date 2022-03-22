const search = document.querySelector('.search');
const input = search.querySelector('.search__input');
const autocompleteBox = search.querySelector('.search__autocomplete');
const repoContainer = document.querySelector('.repos');
const baseURL  = `https://api.github.com/`;


async function repoRequest(url) {
	if (input.value) {
		try {
			await fetch(url).then(res => {
				res.json().then(res => {
					autocompleteBox.innerHTML = createList(res.items);
				})
			});
		} catch (e) {
			console.error(e);
		}
	} else {
		autocompleteBox.innerHTML = '';
	}
}

function createList(arr) {
	return arr
		.reduce((acc, repo) => {
			acc.push(`<li>${repo.name}</li>`);
			return acc
		}, [])
		.join('');
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
};

function createRepository(data) {
	let element = `<div class="repos__item repo">
					<div class="repo__info">
						<p class="repo_name">Name: ${data.items[0].name}</p>
						<p class="repo_owner">Owner: ${data.items[0].owner.login}</p>
						<p class="repo_stars">Stars: ${data.items[0].stargazers_count}</p>
					</div>
					<button class="remove"></button></div>`
	repoContainer.insertAdjacentHTML("beforeend", element);
}

async function getDataRepo(e){
	if(e.target.tagName === 'LI'){
		try{
			await fetch(`${baseURL}search/repositories?q=${e.target.textContent}&per_page=1`)
				.then(res => res.json())
				.then(data => createRepository(data))
		}catch(e){
			console.error(e)
		}
			
	}
}

function deleteRepo(e) {
	if(e.target.className === 'remove'){
		e.target.closest('.repo').remove()
	}
	
}

input.addEventListener('keyup', debounce((e) => repoRequest(`${baseURL}search/repositories?q=${e.target.value}&per_page=5`), 300))
autocompleteBox.addEventListener('click', getDataRepo)
repoContainer.addEventListener('click', deleteRepo)
