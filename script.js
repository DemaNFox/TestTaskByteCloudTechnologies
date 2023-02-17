const storage = document.querySelector("#storage");
const transfer = document.querySelector("#transfer");
const inputs = document.querySelectorAll("input");
const priceArr = [];

document.addEventListener("DOMContentLoaded", function (e) {
  initGraf();
  inputListener();
});

const inputListener = () => {
  inputs.forEach((elem) => {
    elem.addEventListener("input", function (e) {
      initGraf();
    });
  });
};

function initGraf() {
  setStorage();
  setTransfer();
  setGrafValues();
}

function setStorage() {
  const storageVal = document.querySelector(".storageval");
  const currentVal = storage.value;

  storageVal.textContent = currentVal;

  return Number(currentVal);
}

function setTransfer() {
  const transferVal = document.querySelector(".transferval");
  const currentVal = transfer.value;

  transferVal.textContent = currentVal;

  return Number(currentVal);
}

function setPriceArr(price) {
  priceArr.push(price);
}

const companyList = {
  backblaze: {
    storage: 0.005,
    transfer: 0.01,
    minpayment: 7,
    findPrice: function () {
      const price = this.storage * setStorage() + this.transfer * setTransfer();
      const result = price < this.minpayment ? this.minpayment : price;
      const roundedResult = Math.round(result * 100) / 100;
      setPriceArr(roundedResult);
      return roundedResult;
    },
  },
  bunny: {
    storage: {
      hhd: 0.01,
      ssd: 0.02,
    },
    transfer: 0.01,
    maxpayment: 10,
    findPrice: function () {
      const isHhd = document.querySelector("#a1").checked;
      const storage = isHhd ? this.storage.hhd : this.storage.ssd;
      const price = storage * setStorage() + this.transfer * setTransfer();
      const result = price > this.maxpayment ? this.maxpayment : price;
      const roundedResult = Math.round(result * 100) / 100;
      setPriceArr(roundedResult);
      return roundedResult;
    },
  },
  scaleway: {
    storage: {
      single: 0.03,
      multi: 0.06,
    },
    transfer: 0.02,
    findPrice: function () {
      const isSingle = document.querySelector("#a3").checked;
      const storage = isSingle ? this.storage.single : this.storage.multi;
      let price = 0;

      if (setStorage() > 75) {
        price += storage * setStorage();
      }

      if (setTransfer() > 75) {
        price += this.transfer * setTransfer();
      }

      const roundedResult = Math.round(price * 100) / 100;

      setPriceArr(roundedResult);
      return roundedResult;
    },
  },
  vultr: {
    storage: 0.01,
    transfer: 0.01,
    minpayment: 5,
    findPrice: function () {
      const price = this.storage * setStorage() + this.transfer * setTransfer();
      const result = price < this.minpayment ? this.minpayment : price;
      const roundedResult = Math.round(result * 100) / 100;

      setPriceArr(roundedResult);
      return roundedResult;
    },
  },
};

function setGrafValues() {
  const columns = document.querySelectorAll(".grafline");
  const prices = document.querySelectorAll(".grafprice");
  const isPortrait =
    screen.orientation.type === "portrait-primary" ? true : false;

  (function resetPriceArr() {
    priceArr.length = 0;
  })();

  (function getPriceArr() {
    companyList.backblaze.findPrice();
    companyList.bunny.findPrice();
    companyList.scaleway.findPrice();
    companyList.vultr.findPrice();
  })();

  (function setNumbers() {
    priceArr.forEach((elem, i) => {
      prices[i].innerText = elem + "$";
    });
  })();

  (function setColumns() {
    const upperVal = 85;

    if (isPortrait) {
      priceArr.forEach((elem, i) => {
        const percent = (elem / upperVal) * 100 + "%";
        columns[i].style.height = percent;
      });
    } else {
      priceArr.forEach((elem, i) => {
        const percent = (elem / upperVal) * 100 + "%";
        columns[i].style.width = percent;
      });
    }
  })();

  (function styleBest() {
    const lowerPrice = Math.min(...priceArr);
    const lowIndex = priceArr.indexOf(lowerPrice);
    const colors = ["red", "yellow", "purple", "blue"];

    columns.forEach((elem) => {
      elem.style.backgroundColor = "#8080807c";
    });

    columns[lowIndex].style.backgroundColor = colors[lowIndex];
  })();
}
