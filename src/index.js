document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000/characters";
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    const nameElement = document.getElementById("name");
    const imageElement = document.getElementById("image");
    const voteCount = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const votesInput = document.getElementById("votes");
    const resetButton = document.getElementById("reset-btn");
    const characterForm = document.getElementById("character-form");
    const newNameInput = document.getElementById("new-name");
    const newImageInput = document.getElementById("image-url");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Character";
    deleteButton.id = "delete-btn";
    detailedInfo.appendChild(deleteButton);

    let currentCharacter = null;

    function fetchCharacters() {
        fetch(baseURL)
            .then(response => response.json())
            .then(characters => {
                characterBar.innerHTML = "";
                characters.forEach(addCharacterToBar);
            });
    }


    function addCharacterToBar(character) {
        const span = document.createElement("span");
        span.textContent = character.name;
        span.dataset.id = character.id;
        span.addEventListener("click", () => displayCharacter(character));
        characterBar.appendChild(span);
    }

    function displayCharacter(character) {
        currentCharacter = character;
        nameElement.textContent = character.name;
        imageElement.src = character.image;
        voteCount.textContent = character.votes;
        deleteButton.style.display = "block";
    }

    votesForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!currentCharacter) return;

        let newVotes = parseInt(votesInput.value) || 0;
        currentCharacter.votes += newVotes;
        voteCount.textContent = currentCharacter.votes;
        votesInput.value = "";

        fetch(`${baseURL}/${currentCharacter.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: currentCharacter.votes })
        });
    });

    
    resetButton.addEventListener("click", () => {
        if (!currentCharacter) return;

        currentCharacter.votes = 0;
        voteCount.textContent = 0;

        fetch(`${baseURL}/${currentCharacter.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: 0 })
        });
    });

    deleteButton.addEventListener("click", () => {
        if (!currentCharacter) return;

        fetch(`${baseURL}/${currentCharacter.id}`, {
            method: "DELETE"
        })
        .then(() => {
            fetchCharacters();
            detailedInfo.innerHTML = "";
            currentCharacter = null;
        });
    });

    characterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = newNameInput.value.trim();
        const image = newImageInput.value.trim();
        if (!name || !image) return;

        const newCharacter = { name, image, votes: 0 };

        fetch(baseURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCharacter)
        })
        .then(response => response.json())
        .then(savedCharacter => {
            addCharacterToBar(savedCharacter);
            displayCharacter(savedCharacter);
            newNameInput.value = "";
            newImageInput.value = "";
        });
    });

    fetchCharacters();
});
