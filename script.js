const formMinute = document.getElementById("minuteLateForm");
const minuteLateInput = document.getElementById("minuteLateInput");
const buttonPenaltyCurrentTime = document.getElementById(
  "calculatePenaltyByCurrent"
);

const formTimeInput = document.getElementById("timeInputForm");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");

const resultWord = document.getElementById("resultWord");
const resultDescription = document.getElementById("resultDescription");
const resultLineBreaker = document.getElementById("resultLineBreaker");
const resultWellDone = document.getElementById("resultWellDone");
const scoreLateResult = document.getElementById("lateResult");

formMinute.addEventListener("submit", function (event) {
  event.preventDefault();
  ClearAllResult();
  let minuteLate = minuteLateInput.value;
  let penaltyScore = GetPenaltyByMinute(minuteLate).toFixed(2);

  DisplayScore(penaltyScore);
});

formTimeInput.addEventListener("submit", function (event) {
  event.preventDefault();
  ClearAllResult();

  const hour = parseInt(hourInput.value);
  const minute = parseInt(minuteInput.value);

  const userInputTime = new Date();
  userInputTime.setHours(hour, minute, 0, 0);

  let minuteLate = calculateTimeDifferenceToNoon(userInputTime);
  let penaltyScore = GetPenaltyByMinute(minuteLate).toFixed(2);

  resultDescription.innerHTML = `you submit lab late by <span class="code_header">${minuteLate}</span> minutes`;
  DisplayScore(penaltyScore);
});

buttonPenaltyCurrentTime.onclick = function () {
  ClearAllResult();
  let currentTime = new Date(); // Current time
  let timeDifferenceToNoon = calculateTimeDifferenceToNoon(currentTime);
  let penaltyScore = GetPenaltyByMinute(timeDifferenceToNoon).toFixed(2);

  resultDescription.innerHTML = `you submit lab late by <span class="code_header">${timeDifferenceToNoon}</span> minutes`;
  DisplayScore(penaltyScore);
};

function DisplayScore(penaltyScore) {
  resultLineBreaker.innerHTML = "===========================";

  if (penaltyScore <= 0) {
    resultWellDone.innerHTML = "✅ You have no penalty, well done!";
  } else {
    resultWord.innerHTML = "Your score will be deducted by";
    scoreLateResult.innerHTML = `-${penaltyScore}`;
  }
}

function GetPenaltyByMinute(minutes_late) {
  if (minutes_late <= 0) {
    return 0;
  }

  function SmoothStep(x, edge0, edge1) {
    x = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return x * x * (3 - 2 * x);
  }

  let p1 = 0.01 * minutes_late; // Up to 30 minutes
  let p2 = 0.3 + 0.02 * (minutes_late - 30); // 30-60 minutes
  let p3 = 0.9 + 0.04 * (minutes_late - 60); // 60-120 minutes
  let p4 = 3.3 + 0.07 * (minutes_late - 120); // Beyond 120 minutes

  let w1 = SmoothStep(minutes_late, 28, 32);
  let w2 = SmoothStep(minutes_late, 58, 62);
  let w3 = SmoothStep(minutes_late, 118, 122);

  let penalty =
    p1 * (1 - w1) + p2 * w1 * (1 - w2) + p3 * w2 * (1 - w3) + p4 * w3;

  return penalty;
}

function calculateTimeDifferenceToNoon(currentTime) {
  const noonTime = new Date();
  noonTime.setHours(12, 0, 0, 0); // Set noon time (12:00:00)

  if (currentTime < noonTime) {
    return 0;
  }

  const diffInMilliseconds = Math.abs(currentTime - noonTime);
  const diffInMinutes = Math.round(diffInMilliseconds / (1000 * 60));

  return diffInMinutes;
}

function ClearAllResult() {
  resultWord.innerHTML = "";
  resultDescription.innerHTML = "";
  scoreLateResult.innerHTML = "";
  resultLineBreaker.innerHTML = "";
  resultWellDone.innerHTML = "";
}
