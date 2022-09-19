const userInfoWrapper = document.getElementById("user-info-wrapper");
const reposWrapper = document.getElementById("repos-wrapper");
const form = document.getElementById("main-form");
const formValue = document.getElementById("input-value");
const errorMessage = document.getElementById("error-message");
// Setting up the icons
// -- Github icon
let githubIcon = document.createElement("i");
githubIcon.classList.add("fab");
githubIcon.classList.add("fa-github");
// -- Repos count icon
let reposCountIcon = document.createElement("i");
reposCountIcon.classList.add("fal");
reposCountIcon.classList.add("fa-table");
// -- Email icon
let emailIcon = document.createElement("i");
emailIcon.classList.add("fal");
emailIcon.classList.add("fa-envelope");
// -- Followers icon
let followersIcon = document.createElement("i");
followersIcon.classList.add("fal");
followersIcon.classList.add("fa-users");
// -- Following icon
let followingIcon = document.createElement("i");
followingIcon.classList.add("fal");
followingIcon.classList.add("fa-user-plus");
// -- Location icon
let locationIcon = document.createElement("i");
locationIcon.classList.add("fal");
locationIcon.classList.add("fa-map-marker-alt");
// -- Error Icon
let errorIcon = document.createElement("i");
errorIcon.classList.add("fal");
errorIcon.classList.add("fa-exclamation-circle");

// Handling the submit event
form.onsubmit = (e) => {
  e.preventDefault();
  getUserInfo(formValue.value);
};

// The main function that will fetch the data
async function getUserInfo(username) {
  const infoUrl = new URL(`https://api.github.com/users/${username}`);
  try {
    let userInfo = await (await fetch(infoUrl)).json();
    if (
      (userInfo.location != null && userInfo.location.includes("Israel")) ||
      (userInfo.location != null && userInfo.location.includes("israel"))
    ) {
      empty(userInfoWrapper);
      empty(reposWrapper);
      printError(` These people are not welcome`);
    } else if (userInfo.message) {
      empty(userInfoWrapper);
      empty(reposWrapper);
      printError(` Something went wrong! Check your spelling and try again`);
    } else {
      printUserInfo(userInfo);
      if (userInfo.public_repos > 0) {
        try {
          let reposUrl = new URL(
            `https://api.github.com/users/${username}/repos`
          );
          let repos = await (await fetch(reposUrl)).json();
          await printRepos(repos);
        } catch (error) {
          empty(reposWrapper);
          printError(
            ` Something went wrong! Check your spelling and try again`
          );
        }
      } else {
        empty(reposWrapper);
        printError(` ${username} doesn't have any public repositories yet.`);
      }
    }
  } catch (error) {
    console.log(error);
    empty(reposWrapper);
    empty(userInfoWrapper);
    printError(` Something went wrong! Check your spelling and try again`);
  }
}
// Function to print the user info
async function printUserInfo(data) {
  // Delete the error message if there is
  empty(errorMessage);
  // Delete the data of the previous user if there is
  empty(userInfoWrapper);
  // Add the visible class to set the padding of the 20px to the wrapper
  userInfoWrapper.classList.add("visible");
  // User Avatar
  const userAvatar = document.createElement("img");
  userAvatar.src = data.avatar_url;
  userAvatar.classList.add("user-avatar");
  userInfoWrapper.appendChild(userAvatar);
  // Info Div
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("info");
  userInfoWrapper.appendChild(infoDiv);
  // UserName
  const userName = document.createElement("h2");
  userName.classList.add("user-name");
  userName.innerText =
    data.name == undefined ? "Undedined Username" : data.name;
  infoDiv.appendChild(userName);
  // user Data Div (the sibling of the userName)
  const userDataDiv = document.createElement("div");
  userDataDiv.classList.add("user-data");
  infoDiv.appendChild(userDataDiv);
  // The informations
  // -- Visit account
  const visitAccount = document.createElement("p");
  visitAccount.appendChild(githubIcon);
  const visitAccountLink = document.createElement("a");
  visitAccountLink.href = data.html_url;
  visitAccountLink.target = "_blank";
  visitAccountLink.innerText = "Visit Account";
  visitAccount.appendChild(visitAccountLink);
  userDataDiv.appendChild(visitAccount);
  // -- Repos Count
  const reposCount = document.createElement("p");
  reposCount.appendChild(reposCountIcon);
  reposCount.append(
    `${data.public_repos} ${data.public_repos == 1 ? " repo" : " repos"}`
  );
  userDataDiv.appendChild(reposCount);
  // -- Email Address
  const emailAddress = document.createElement("p");
  emailAddress.appendChild(emailIcon);
  emailAddress.append(data.email == null ? " Private" : data.email);
  userDataDiv.appendChild(emailAddress);
  // -- Followers count
  const followersCount = document.createElement("p");
  followersCount.appendChild(followersIcon);
  followersCount.append(
    `${data.followers} ${data.followers == 1 ? " Follower" : " Followers"}`
  );
  userDataDiv.appendChild(followersCount);
  // -- Following count
  const followingCount = document.createElement("p");
  followingCount.appendChild(followingIcon);
  followingCount.append(`${data.following} Following`);
  userDataDiv.appendChild(followingCount);
  //  -- Country
  const country = document.createElement("p");
  country.appendChild(locationIcon);
  country.append(data.location == null ? "Private" : data.location);
  userDataDiv.appendChild(country);
}
// Function to print the repos
async function printRepos(repos) {
  empty(reposWrapper);
  for (let i = 0; i < repos.length; i++) {
    // The Repo
    let repo = document.createElement("div");
    repo.classList.add("repo");
    // The Repo Name
    let repoName = document.createElement("h3");
    repoName.classList.add("repo-name");
    let repoNameValue = repos[i].name.replaceAll(/(_|-)/gi, " ");
    repoName.append(repoNameValue);
    repo.appendChild(repoName);
    // Repo Stats Div
    let repoStats = document.createElement("div");
    repoStats.classList.add("repo-stats");
    repo.appendChild(repoStats);
    // Repo Stars Paragraph
    let starsCount = document.createElement("p");
    starsCount.classList.add("repo-stars");
    // -- Stars icon
    let starsIcon = document.createElement("i");
    starsIcon.classList.add("far");
    starsIcon.classList.add("fa-star");
    starsCount.appendChild(starsIcon);
    starsCount.append(repos[i].stargazers_count);
    repoStats.appendChild(starsCount);
    // Repo Stars Paragraph
    let forksCount = document.createElement("p");
    forksCount.classList.add("repo-forks");
    // -- Forks icon
    let forksIcon = document.createElement("i");
    forksIcon.classList.add("fal");
    forksIcon.classList.add("fa-code-branch");
    forksCount.appendChild(forksIcon);
    forksCount.append(repos[i].forks_count);
    repoStats.appendChild(forksCount);
    // The link
    let repoLink = document.createElement("a");
    repoLink.href = repos[i].html_url;
    repoLink.target = "_blank";
    // -- Github Icon
    let githubIcon = document.createElement("i");
    githubIcon.classList.add("fab");
    githubIcon.classList.add("fa-github");
    repoLink.append(githubIcon);
    repoLink.append("Visit Repo");
    repo.appendChild(repoLink);
    // Append The Repo on the repos wrapper
    reposWrapper.appendChild(repo);
  }
}
// Function to print errors if there is
function printError(errorValue) {
  empty(errorMessage);
  errorMessage.classList.add("visible");
  errorMessage.append(errorIcon);
  errorMessage.append(errorValue);
}
// Function to empty an element
function empty(element) {
  element.classList.remove("visible");
  element.innerText = "";
}
