const labelCurrentStrawberries = document.getElementById("labelCurrentStrawberries");
const labelStrawberryUpgrade = document.getElementById("labelPickerUpgrade");
const buttonStrawberryUpgrade = document.getElementById("buttonPickerUpgrade");
const labelStrawberrySeeds = document.getElementById("labelStrawberrySeeds");
const buttonStrawberrySeeds = document.getElementById("buttonStrawberrySeeds");
const labelSeedFertilizer = document.getElementById("labelSeedFertilizer");
const buttonSeedFertilizer = document.getElementById("buttonSeedFertilizer");
const labelDashes = document.getElementById("labelDashes");
const buttonDashes = document.getElementById("buttonDashes");

var gameData = {
  strawberries: 0,
  strawberriesPerPick: 1,
  strawberriesPerPickUpgradeCost: 10,
  strawberrySeeds: 0,
  strawberrySeedCost: 2,
  strawberrySeedSoftcap: 10000,
  strawberrySeedRemoteSoftcap: 100000,
  seedFertilizers: 0,
  seedFertilizerCost: 100,
  seedFertilizerMult: 1,
  seedFertilizerSoftcap: 10,
  dashCost: 1000,
  dashes: 0,
  dashMult: 1,
  dashesSoftcap: 10000,
}

// var savegame = JSON.parse(localStorage.getItem("celesteIdleSave"))
// if (savegame !== null) {
//   gameData = savegame;
//   updateHTML();
// }

// helper funcs
function floatToString(num, decimals) {
  return num.toFixed(decimals);
}

function roundPowMult(num, base, expon) {
  return Math.round(num * Math.pow(base, expon));
}

function genericBuyMax(attemptorFunc, buyMax) {
  if (buyMax) {
    while (attemptorFunc()) {}
    updateHTML();
  } else {
    if (attemptorFunc()) {
      updateHTML();
    }
  }
}

// manual picking
function pickStrawberries() {
  gameData.strawberries += gameData.strawberriesPerPick * gameData.dashMult;
  updateHTML();
}

function attemptUpgradeStrawberryPicker() {
  if (gameData.strawberries >= gameData.strawberriesPerPickUpgradeCost) {
    gameData.strawberries -= gameData.strawberriesPerPickUpgradeCost
    gameData.strawberriesPerPick += 1;
    gameData.strawberriesPerPickUpgradeCost = 10 + gameData.strawberriesPerPick * (gameData.strawberriesPerPick - 1) / 2;
    return true;
  }
  return false;
}

function upgradeStrawberryPicker(buyMax) {
  genericBuyMax(attemptUpgradeStrawberryPicker, buyMax);
}


// seeds
function updateSeedStats() {
  gameData.strawberrySeedCost = 2 + Math.round(gameData.strawberrySeeds / 25 * gameData.seedFertilizerMult);
  if (gameData.strawberrySeeds >= gameData.strawberrySeedSoftcap) {
    gameData.strawberrySeedCost = roundPowMult(gameData.strawberrySeedCost, 
      1.001, gameData.strawberrySeeds - gameData.strawberrySeedSoftcap);
  }
}

function attemptBuyStrawberrySeed() {
  if (gameData.strawberries >= gameData.strawberrySeedCost) {
    gameData.strawberries -= gameData.strawberrySeedCost;
    gameData.strawberrySeeds += 1;
    updateSeedStats();
    return true;
  }
  return false;
}

function buyStrawberrySeed(buyMax) {
  genericBuyMax(attemptBuyStrawberrySeed, buyMax);
}

function updateFertlizerStats() {
  gameData.seedFertilizerCost = 100 + 25 * gameData.seedFertilizers * (gameData.seedFertilizers + 1);
  if (gameData.seedFertilizers >= gameData.seedFertilizerSoftcap) {
    gameData.seedFertilizerCost = roundPowMult(gameData.seedFertilizerCost, 
      1.1, gameData.seedFertilizers - gameData.seedFertilizerSoftcap);
  }
  gameData.seedFertilizerMult = Math.pow(0.8, gameData.seedFertilizers);
}

function attemptBuySeedFertilizer() {
  if (gameData.strawberrySeeds >= gameData.seedFertilizerCost) {
    gameData.strawberrySeeds -= gameData.seedFertilizerCost;
    gameData.seedFertilizers += 1;
    updateFertlizerStats();
    updateSeedStats();
    return true;
  }
  return false;
}

function buySeedFertilizer(buyMax) {
  genericBuyMax(attemptBuySeedFertilizer, buyMax);
}

// dashes
function updateDashStats() {
  gameData.dashCost = 1000 + 100 * gameData.dashes * (gameData.dashes + 1);
  if (gameData.dashes >= gameData.dashesSoftcap) {
    gameData.dashCost = roundPowMult(gameData.dashCost, 
      1 + 1 / gameData.dashesSoftcap, 
      gameData.dashes - gameData.dashesSoftcap);
  }
  gameData.dashMult = 1 + gameData.dashes;
}

function attemptBuyDash() {
  if (gameData.strawberries >= gameData.dashCost) {
    gameData.strawberries -= gameData.dashCost;
    gameData.dashes += 1;
    updateDashStats();
    return true;
  }
  return false;
}

function buyDash(buyMax) {
  genericBuyMax(attemptBuyDash, buyMax);
}


function updateHTML() {
  labelCurrentStrawberries.innerHTML = floatToString(gameData.strawberries, 1) + " Strawberries";
  labelStrawberryUpgrade.innerHTML = "Strawberries per pick: " + gameData.strawberriesPerPick;
  buttonStrawberryUpgrade.innerHTML = "Cost: " + gameData.strawberriesPerPickUpgradeCost + " Strawberries";
  labelStrawberrySeeds.innerHTML = `Strawberry seed: ${gameData.strawberrySeeds} (${floatToString(gameData.strawberrySeeds * 0.1, 1)} strawberries / sec)`;
  buttonStrawberrySeeds.innerHTML = `Cost: ${gameData.strawberrySeedCost} Strawberries`;
  labelSeedFertilizer.innerHTML = `Strawberry seed fertilizer: ${gameData.seedFertilizers} (${floatToString(100 * (1 - gameData.seedFertilizerMult), 1)}% reduced seed cost scaling)`
  buttonSeedFertilizer.innerHTML = `Cost: ${gameData.seedFertilizerCost} Strawberry seeds`;
  labelDashes.innerHTML = `Dash crystals: ${gameData.dashes} (${gameData.dashMult}x more strawberries from all sources)`;
  buttonDashes.innerHTML = `Cost: ${gameData.dashCost} Strawberries`;
}

// Loops
function step() {
  gameData.strawberries += gameData.strawberrySeeds * 0.1 * gameData.dashMult;
}

var mainGameLoop = window.setInterval(function() {
  step();
  updateHTML();
}, 1000)

var saveGameLoop = window.setInterval(function() {
  localStorage.setItem("celesteIdleSave", JSON.stringify(gameData));
}, 15000)