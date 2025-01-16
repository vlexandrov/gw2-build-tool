const builds = {};

// Add a new build
document.getElementById("build-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const profession = document.getElementById("profession").value;
    const category = document.getElementById("category").value;
    const entryName = document.getElementById("entry-name").value;
    const description = document.getElementById("description").value;
    const equipmentCode = document.getElementById("equipment-code").value;
    const buildCode = document.getElementById("build-code").value;

    // Create the profession entry if it doesn't exist
    if (!builds[profession]) {
        builds[profession] = {};
    }

    // Create the category entry for the profession if it doesn't exist
    if (!builds[profession][category]) {
        builds[profession][category] = [];
    }

    // Add the new entry to the category
    builds[profession][category].push({ entryName, description, equipmentCode, buildCode });

    // Reset the form
    e.target.reset();

    // Render the builds
    renderBuilds();
});

// Render the builds
function renderBuilds() {
    const container = document.getElementById("builds-container");
    container.innerHTML = ""; // Clear existing content

    for (const [profession, categories] of Object.entries(builds)) {
        const professionDiv = document.createElement("div");
        professionDiv.className = "profession";

        // Add profession name
        const professionHeader = document.createElement("h3");
        professionHeader.textContent = profession;
        professionDiv.appendChild(professionHeader);

        for (const [category, entries] of Object.entries(categories)) {
            if (entries.length === 0) continue; // Skip empty categories

            const categoryDiv = document.createElement("div");
            categoryDiv.className = "category";

            // Add category name
            const categoryHeader = document.createElement("h4");
            categoryHeader.textContent = category;
            categoryDiv.appendChild(categoryHeader);

            // Add entries
            entries.forEach((entry, index) => {
                const entryDiv = document.createElement("div");
                entryDiv.className = "entry";

                // Entry name and description
                const entryHeader = document.createElement("h5");
                entryHeader.textContent = entry.entryName;
                entryDiv.appendChild(entryHeader);

                const entryDescription = document.createElement("p");
                entryDescription.textContent = entry.description;
                entryDiv.appendChild(entryDescription);

                // Equipment code row
                const equipmentRow = document.createElement("div");
                equipmentRow.className = "sub-row";
                equipmentRow.innerHTML = `
                    <span>Equipment Code: ${entry.equipmentCode}</span>
                    <button onclick="copyToClipboard('${entry.equipmentCode}')">Copy Equipment Code</button>
                `;
                entryDiv.appendChild(equipmentRow);

                // Build code row
                const buildRow = document.createElement("div");
                buildRow.className = "sub-row";
                buildRow.innerHTML = `
                    <span>Build Code: ${entry.buildCode}</span>
                    <button onclick="copyToClipboard('${entry.buildCode}')">Copy Build Code</button>
                `;
                entryDiv.appendChild(buildRow);

                // Delete button
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete Entry";
                deleteButton.onclick = () => deleteEntry(profession, category, index);
                entryDiv.appendChild(deleteButton);

                // Add entry to category
                categoryDiv.appendChild(entryDiv);
            });

            professionDiv.appendChild(categoryDiv);
        }

        container.appendChild(professionDiv);
    }
}

// Delete a specific entry
function deleteEntry(profession, category, index) {
    builds[profession][category].splice(index, 1); // Remove the entry
    if (builds[profession][category].length === 0) {
        delete builds[profession][category]; // Remove the category if empty
    }
    if (Object.keys(builds[profession]).length === 0) {
        delete builds[profession]; // Remove the profession if empty
    }
    renderBuilds(); // Re-render the builds
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
    });
}

// Auto-adjust textarea height
document.getElementById("description").addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
});

// Save builds as a JSON file
function saveBuilds() {
    if (Object.keys(builds).length === 0) {
        alert("No builds to save!");
        return;
    }
    
    const jsonString = JSON.stringify(builds, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "builds.json";
    link.click();
}

// Load builds from a JSON file
function loadBuilds(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            // Parse the JSON file
            const loadedBuilds = JSON.parse(e.target.result);

            // Clear existing builds
            for (let profession in builds) {
                delete builds[profession];
            }

            // Load the new builds
            Object.assign(builds, loadedBuilds);

            // Re-render the builds
            renderBuilds();
        } catch (error) {
            alert("Failed to load builds. Please ensure it's a valid JSON file.");
        }
    };

    reader.readAsText(file);
}
