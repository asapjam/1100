const projectItems = [
    {    
        title: "Game of War",
        url: "https://github.com/asapjam/btech-software-dev-25-classroom-computer-programming-game-of-war-game-of-war-starter-csharp",
        description: "The card game War in C#!",
    },
    {    
        title: "Putt Kitty Putt!",
        url: "https://github.com/Quarz8/projectile-maze-game",
        description: "My first game! 30 levels of kitty-putting action!",
    },
    {    
        title: "My First Project",
        url: "http://link.to.my.first.project.com",
        description: "My first project is the first project I ever made, and it's cool because...",
    },
];

const projectTargetDiv = document.getElementById("projectTarget");
const newUnorderedList = projectTargetDiv.appendChild(document.createElement("ul"));

projectItems.forEach(projectItem => {
    const titleText = projectItem.title;
    const urlText = projectItem.url;
    const descriptionText = projectItem.description;

    const newListElement = document.createElement("li")

    const newTitleDiv = document.createElement("div");
    newTitleDiv.classList.add("projectTitle");
    const newTitleHeader = document.createElement("h2");
    newTitleHeader.textContent = titleText;
    newTitleDiv.appendChild(newTitleHeader);

    const newUrlDiv = document.createElement("div");
    newUrlDiv.classList.add("projectUrl");
    const newUrlAnchor = document.createElement("a");
    newUrlAnchor.href = urlText;
    newUrlAnchor.target = "_blank" //new tab on link open
    newUrlAnchor.textContent = "Link";
    newUrlAnchor.title = "Go to Link...";
    newUrlDiv.appendChild(newUrlAnchor);

    const newDescriptionDiv = document.createElement("div");
    newDescriptionDiv.classList.add("projectDescription");
    const newParagraph = document.createElement("p")
    newParagraph.textContent = descriptionText;
    newDescriptionDiv.appendChild(newParagraph);
    
    newListElement.appendChild(newTitleDiv);
    newListElement.appendChild(newUrlDiv);
    newListElement.appendChild(newDescriptionDiv);

    newUnorderedList.appendChild(newListElement)
})