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
myHeaders1.append("Authorization", "Bearer <INSERT_TOKEN>");
myHeaders1.append("Content-Type", "application/json");
myHeaders1.append("Access-Control-Allow-Origin", "http://localhost:3000");
myHeaders1.append("Access-Control-Allow-Credentials", "true");
var myHeaders2 = new Headers();
myHeaders2.append("Authorization", "Bearer <INSERT_TOKEN>");
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
