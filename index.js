const startShift = "topics";
const endShift = "group_title";
const start = document.getElementById("start");
const end = document.getElementById("end");
const workerIDsToMondayIDs = {
  1235666: 1821690037,
  5623486: 1821690044,
  1234458: 1821690033,
  56732496: 1821690050,
  523457823: 1821690053,
  3243456: 1822008703,
};
var myHeaders1 = new Headers();
myHeaders1.append(
  "Authorization",
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjEyOTg3NjkyNSwidWlkIjoyNTQ3Njc4MCwiaWFkIjoiMjAyMS0xMC0yMlQxMjoyMzozOS4xNTZaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTAyMzgxNDQsInJnbiI6InVzZTEifQ.2Cs_O1sxAPdk3l0gHW7pIIzy8fC462kmJO56LaAb4_I"
);
myHeaders1.append("Content-Type", "application/json");
myHeaders1.append(
  "Cookie",
  "__cf_bm=npBeLrRC1NDRxqAupaxAJl2cMVNqz_95W6jg.1O_TgA-1634999877-0-Ac14C88xVzelq8yL0zM3CGHfduIPi52DRIcHZsZ+P5hiLEDzKCbaHS4UgMedRxl5hufQVn8DuFI3aiU1ICdoObg="
);
var myHeaders2 = new Headers();
myHeaders2.append(
  "Authorization",
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjEyOTg3NjkyNSwidWlkIjoyNTQ3Njc4MCwiaWFkIjoiMjAyMS0xMC0yMlQxMjoyMzozOS4xNTZaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTAyMzgxNDQsInJnbiI6InVzZTEifQ.2Cs_O1sxAPdk3l0gHW7pIIzy8fC462kmJO56LaAb4_I"
);
myHeaders2.append("Content-Type", "application/json");

async function getUser(mondayId) {
  var graphql = JSON.stringify({
    query: `query {\n    items(ids:[${mondayId}]) {\n        id\n        name\n        group {\n            id\n        }\n    }\n}`,
    variables: {},
  });
  var requestOptions1 = {
    method: "POST",
    headers: myHeaders1,
    body: graphql,
    redirect: "follow",
  };
  const res = await fetch("https://api.monday.com/v2", requestOptions1);
  const formattedRes = await res.json();
  return formattedRes["data"]["items"][0];
}

async function moveUserToNewGroup(mondayId, groupId) {
  var graphql = JSON.stringify({
    query:
      "mutation move_item_to_group ($itemID: Int!, $groupID: String!) {\n    move_item_to_group (item_id: $itemID, group_id: $groupID) {\n        id\n    }\n}",
    variables: { itemID: mondayId, groupID: groupId },
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders2,
    body: graphql,
    redirect: "follow",
  };
  await fetch("https://api.monday.com/v2", requestOptions);
}

function init() {
  //start button
  start.onclick = async (event) => {
    event.preventDefault();
    const workerId = document.getElementById("inputText").value;
    if (workerId in workerIDsToMondayIDs) {
      const mondayId = workerIDsToMondayIDs[workerId];
      const user = await getUser(mondayId);
      if (user.group.id === endShift) {
        await moveUserToNewGroup(mondayId, startShift);
        const paragraph = document.getElementById("hello-fairwell");
        const span = document.createElement("span");
        span.innerHTML = `Hello ${user.name}!`;
        paragraph.append(span);
        setTimeout(() => {
          span.classList.add("hidden");
        }, 3000);
      } else {
        alert("You're already on shift!");
      }
    } else {
      alert("This Worker ID Doesn't Exist!");
    }
  };
  //end button
  end.onclick = async (event) => {
    event.preventDefault();
    const workerId = document.getElementById("inputText").value;
    if (workerId in workerIDsToMondayIDs) {
      const mondayId = workerIDsToMondayIDs[workerId];
      const user = await getUser(mondayId);
      if (user.group.id === startShift) {
        await moveUserToNewGroup(mondayId, endShift);
        const paragraph = document.getElementById("hello-fairwell");
        const span = document.createElement("span");
        span.innerHTML = `Fairwell ${user.name}!`;
        paragraph.append(span);
        setTimeout(() => {
          span.classList.add("hidden");
        }, 3000);
      } else {
        alert("You're already off shift!");
      }
    } else {
      alert("This Worker ID Doesn't Exist!");
    }
  };
}

init();
