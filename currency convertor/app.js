// Generate background particles
for (let i = 0; i < 15; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.width = Math.random() * 100 + 50 + 'px';
  particle.style.height = particle.style.width;
  particle.style.left = Math.random() * 100 + '%';
  particle.style.animationDelay = Math.random() * 20 + 's';
  particle.style.animationDuration = Math.random() * 10 + 15 + 's';
  document.body.appendChild(particle);
}

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapIcon = document.querySelector(".swap-icon");
const amountInput = document.querySelector(".amount input");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Swap currencies
swapIcon.addEventListener("click", () => {
  const tempCurr = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = tempCurr;
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

const updateExchangeRate = async () => {
  let amtVal = amountInput.value;
  if (amtVal === "" || amtVal < 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  msg.innerText = "Loading...";
  msg.classList.add("loading");
  msg.classList.remove("error");

  // Using ExchangeRate-API (free, no API key required)
  const URL = `https://open.er-api.com/v6/latest/${fromCurr.value}`;
  
  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error("Network response was not ok");
    let data = await response.json();
    
    if (data.result === "success") {
      let rate = data.rates[toCurr.value];
      let finalAmount = (amtVal * rate).toFixed(2);
      
      msg.classList.remove("loading");
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } else {
      throw new Error("API returned error");
    }
  } catch (error) {
    msg.classList.remove("loading");
    msg.classList.add("error");
    msg.innerText = "⚠️ Failed to fetch rate. Please try again.";
    console.error(error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
  img.alt = `${countryCode} Flag`;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Update on amount input change
amountInput.addEventListener("input", () => {
  if (amountInput.value) {
    updateExchangeRate();
  }
});

window.addEventListener("load", () => {
  updateExchangeRate();
});