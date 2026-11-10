document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statcontainer = document.querySelector(".stat-container");

  const easyProgressCircle = document.querySelector(".easy-progress");
  const medprogressCircle = document.querySelector(".Med-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");

  const easyLabel = document.getElementById("easy-label");
  const MedLabel = document.getElementById("Med-label");
  const hardLabel = document.getElementById("hard-label");

  const cardstatContainer = document.querySelector(".stats-card-container");

  // Username Validation
  function Validateusername(username) {
    if (username.trim() === "") {
      alert("Username Should Not Be Empty");
      return false;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

    const isMatching = usernameRegex.test(username);

    if (!isMatching) {
      alert("Invalid Username");
    }

    return isMatching;
  }

  // Fetch User Details
  async function fetchUserDetails(username) {
    try {
      searchBtn.textContent = "Searching....";
      searchBtn.disabled = true;

      // const response = await fetch(url);
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const targetUrl = "https://leetcode.com/graphql/";
      const myHeader = new Headers();

      myHeader.append("content-type", "application/json");

      const graphql = JSON.stringify({
        query:
          "\n    query userSessionProgress($username: String!) {\n        allQuestionsCount {\n            difficulty\n            count\n        }\n        matchedUser(username: $username) {\n            submitStats {\n                acSubmissionNum {\n                    difficulty\n                    count\n                    submissions\n                }\n                totalSubmissionNum {\n                    difficulty\n                    count\n                    submissions\n                }\n            }\n        }\n    }\n    ",
        variables: { username: `${username}` },
      });
      const requestOptions = {
        method: "POST",
        headers: myHeader,
        body: graphql,
        redirect: "follow",
      };
      const response = await fetch(proxyUrl + targetUrl, requestOptions);

      if (!response.ok) {
        throw new Error("Unable to fetch The Username Details");
      }

      const parseddata = await response.json();

      // if (data.status === "error") {
      //     throw new Error(data.message || "User Not Found");
      // }

      console.log("Logging data:", parseddata);

      displayUserData(parseddata);
    } catch (error) {
      statcontainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
      searchBtn.textContent = "Search";
      searchBtn.disabled = false;
    }
  }

  function updateProgress(solve, total, label, circle) {
    const progressDegree = (solve / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solve}/${total}`;
  }

  function displayUserData(parseddata) {
    const totalQuestion = parseddata.data.allQuestionsCount[0].count;
    const totalEasyQuestion = parseddata.data.allQuestionsCount[1].count;
    const totalMediumQuestion = parseddata.data.allQuestionsCount[2].count;
    const totalHardQuestion = parseddata.data.allQuestionsCount[3].count;

    const solvedTotalQuestion =
      parseddata.data.matchedUser.submitStats.acSubmissionNum[0].count;
    const solvedTotalEasyQuestion =
      parseddata.data.matchedUser.submitStats.acSubmissionNum[1].count;
    const solvedTotalMediumQuestion =
      parseddata.data.matchedUser.submitStats.acSubmissionNum[2].count;
    const solvedTotalHardQuestion =
      parseddata.data.matchedUser.submitStats.acSubmissionNum[3].count;

    updateProgress(
      solvedTotalEasyQuestion,
      totalEasyQuestion,
      easyLabel,
      easyProgressCircle,
    );
    updateProgress(
      solvedTotalMediumQuestion,
      totalMediumQuestion,
      MedLabel,
      medprogressCircle,
    );
    updateProgress(
      solvedTotalHardQuestion,
      totalHardQuestion,
      hardLabel,
      hardProgressCircle,
    );

    const cardData = [
      {
        label: "Overall Submission",
        value:
          parseddata.data.matchedUser.submitStats.totalSubmissionNum[0]
            .submissions,
      },
        {
        label: "Easy Submission",
        value:
          parseddata.data.matchedUser.submitStats.totalSubmissionNum[1]
            .submissions,
      },
        {
        label: "Medium Submission",
        value:
          parseddata.data.matchedUser.submitStats.totalSubmissionNum[2]
            .submissions,
      },
        {
        label: "Hard Submission",
        value:
          parseddata.data.matchedUser.submitStats.totalSubmissionNum[3]
            .submissions,
      },
    ];
    console.log("card ka data: ", cardData);

    cardstatContainer.innerHTML = cardData.map(
      data =>
        `
           <div class = "card" >
           <h4>${data.label}</h4>
           <p>${data.value}</p>
           </div>
        `
      
     
    ).join("")
  //    cardstatContainer.style.setAttribute("width: 100px", "height: 100px", "background-color: orange")
   }

  // Search Button Event
  searchBtn.addEventListener("click", function () {
    const username = usernameInput.value.trim();

    console.log("Logging username:", username);

    if (Validateusername(username)) {
      fetchUserDetails(username);
    }
  });
});
