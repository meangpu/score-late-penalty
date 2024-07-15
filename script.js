const formData = document.getElementById("minuteLateForm");
const minuteLateInput = document.getElementById("minuteLateInput");
const scoreLateResult = document.getElementById("lateResult");

formData.addEventListener("submit", function (event) {
  event.preventDefault();
  let minuteLate = minuteLateInput.value;
  let penaltyScore = smooth_penalty(minuteLate).toFixed(2);
  scoreLateResult.innerHTML = penaltyScore;
});

function smooth_penalty(minutes_late) {
  if (minutes_late <= 0) {
    return 0;
  }

  function smooth_step(x, edge0, edge1) {
    x = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return x * x * (3 - 2 * x);
  }

  let p1 = 0.01 * minutes_late; // Up to 30 minutes
  let p2 = 0.3 + 0.02 * (minutes_late - 30); // 30-60 minutes
  let p3 = 0.9 + 0.04 * (minutes_late - 60); // 60-120 minutes
  let p4 = 3.3 + 0.07 * (minutes_late - 120); // Beyond 120 minutes

  let w1 = smooth_step(minutes_late, 28, 32);
  let w2 = smooth_step(minutes_late, 58, 62);
  let w3 = smooth_step(minutes_late, 118, 122);

  let penalty =
    p1 * (1 - w1) + p2 * w1 * (1 - w2) + p3 * w2 * (1 - w3) + p4 * w3;

  return penalty;
}
