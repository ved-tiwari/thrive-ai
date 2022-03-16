// Use matchMedia to check the user preference
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

toggleDarkTheme(prefersDark.matches);

// Listen for changes to the prefers-color-scheme media query
prefersDark.addListener((mediaQuery) => toggleDarkTheme(mediaQuery.matches));

// Add or remove the "dark" class based on if the media query matches
function toggleDarkTheme(shouldAdd) {
  document.body.classList.toggle("dark", shouldAdd);
}

//display date
var date = new Date();
var currDate = date.getDate();
var currMonth = date.getMonth();
var currYear = date.getFullYear();
var affix;

//convert numbers to month
switch (currMonth) {
  case 0:
    currMonth = "January";
    break;
  case 1:
    currMonth = "Febuary";
    break;
  case 2:
    currMonth = "March";
    break;
  case 3:
    currMonth = "April";
    break;
  case 4:
    currMonth = "May";
    break;
  case 5:
    currMonth = "June";
    break;
  case 6:
    currMonth = "July";
    break;
  case 7:
    currMonth = "August";
    break;
  case 8:
    currMonth = "September";
    break;
  case 9:
    currMonth = "October";
    break;
  case 10:
    currMonth = "November";
    break;
  case 11:
    currMonth = "December";
    break;
}
//Change affix based on date
switch (currDate) {
  case 1:
    affix = "st";
    break;
  case 2:
    affix = "nd";
    break;
  case 3:
    affix = "rd";
    break;
  default:
    affix = "th";
}
$("#date").html(currMonth + " " + currDate + affix + ", " + currYear);

//Chart the data
function displayData(prev, pred, years) {
  dataArr = pred.split(" ");
  yearsArr = years.split(" ");

  totalYears = [];
  for (let i = 0; i < 20; i++) {
    totalYears.push(2000 + i);
  }
  for (let i = 0; i < yearsArr.length - 2; i++) {
    if (yearsArr[i] != " ") {
      totalYears.push(yearsArr[i]);
    }
  }
  previous = [];
  prev = prev[0].split(" ");
  for (let i = 0; i < 21; i++) {
    previous.push(parseInt(prev[i]));
  }
  for (let i = 0; i < 10; i++) {
    previous.push(NaN);
  }
  for (let i = 0; i < previous.length; i++) {
    previous[i] = previous[i] / 1000;
  }

  try {
    window.bar.destroy();
  } catch (err) {
    console.log("null");
  }

  predicted = [];

  pred = pred.split(" ");
  for (let i = 0; i < 19; i++) {
    predicted.push(NaN);
  }
  predicted.push(previous[previous.length - 1]);
  for (let i = 0; i < 11; i++) {
    predicted.push(parseInt(pred[i]));
  }

  for (let i = 0; i < predicted.length; i++) {
    predicted[i] = predicted[i] / 1000;
  }

  var ctx = document.getElementById("charts").getContext("2d");
  window.bar = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      labels: totalYears,
      datasets: [
        {
          label: "Previous Poerty Rates",
          borderColor: "rgb(50, 215, 75)",
          data: previous,
          fill: false,
          lineTension: 0,
        },
        {
          label: "AI Predictions",
          borderColor: "rgb(50, 215, 75)",
          data: predicted,
          backgroundColor: "rgb(50, 215, 75, .1)",
          lineTension: 0,
        },
      ],
    },

    // Configuration options go here
    options: {
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
              borderColor: "white",
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              color: "#303030",
            },
            scaleLabel: {
              display: true,
              labelString: "Poverty Rate (Thousands)",
            },
          },
        ],
      },
    },
  });
}

currLocation = "";
function sendData(data, totalYears) {
  currLocation = data[1][0]
  $("#stateName").html(data[1][0]);
  rawNums = "";
  for (let i = 0; i < data.length; i++) {
    if (i != 0) {
      rawNums += data[i][1] + " ";
    }
    //send to python backend
  }

  sentData = {
    rates: rawNums,
    years: totalYears,
  };

  rawNums = rawNums.split();

  $.ajax({
    type: "POST",
    url: "/",
    data: sentData,
    success: function (data) {
      displayData(rawNums, data.predictions, data.years);
    },
    error: function () {
      console.error("An Error has occured with posting data");
    },
  });
}


function clicked(codeState) {
  var stateCode = codeState
  var yearCall = "";
  var totalYears = "";
  for (let i = 0; i < 21; i++) {
    yr = 2000 + i;
    totalYears += yr.toString() + " ";
    yearCall += "&YEAR=" + yr;
  }

  fetch(
    `https://api.census.gov/data/timeseries/poverty/saipe?get=NAME,SAEPOVALL_PT&for=state:${stateCode}${yearCall}`
  )
    .then((response) => response.json())
    .then((data) => sendData(data, totalYears));
}
$("#click").click(function () {
  clicked($("#state").val());
});

function FIPSLocator(stateName) {
  switch (stateName) {
    case "Alabama":
      return "01";
      break;
    case "Alaska":
      return "02";
      break;
    case "Arizona":
      return "04";
      break;
    case "Arkansas":
      return "05";
      break;
    case "California":
      return "06";
      break;
    case "Colorado":
      return "08";
      break;
    case "Connecticut":
      return "09";
      break;
    case "Delaware":
      return 10;
      break;
    case "Florida":
      return 12;
      break;
    case "Georgia":
      return 13;
      break;
    case "Hawaii":
      return 15;
      break;
    case "Idaho":
      return 16;
      break;
    case "Illinois":
      return 17;
      break;
    case "Indiana":
      return 18;
      break;
    case "Iowa":
      return 19;
      break;
    case "Kansas":
      return 20;
      break;
    case "Kentucky":
      return 21;
      break;
    case "Lousiana":
      return 22;
      break;
    case "Maine":
      return 23;
      break;
    case "Maryland":
      return 24;
      break;
    case "Massachusetts":
      return 25;
      break;
    case "Michigan":
      return 26;
      break;
    case "Minnesota":
      return 27;
      break;
    case "Mississippi":
      return 28;
      break;
    case "Missouri":
      return 29;
      break;
    case "Montana":
      return 30;
      break;
    case "Nebraska":
      return 31;
      break;
    case "Nevada":
      return 32;
      break;
    case "New Hampshire":
      return 33;
      break;
    case "New Jersey":
      return 22;
      break;
    case "New Mexico":
      return 35;
      break;
    case "New York":
      return 36;
      break;
    case "North Carolina":
      return 37;
      break;
    case "North Dakota":
      return 38;
      break;
    case "Ohio":
      return 39;
      break;
    case "Oklahoma":
      return 40;
      break;
    case "Oregon":
      return 41;
      break;
    case "Pennslyvania":
      return 42;
      break;
    case "Rhode Island":
      return 44;
      break;
    case "South Carolina":
      return 45;
      break;
    case "South Dakota":
      return 46;
      break;
    case "Tennessee":
      return 47;
      break;
    case "Texas":
      return 48;
      break;
    case "Vermont":
      return 50;
      break;
    case "Virginia":
      return 51;
      break;
    case "Washington":
      return 53;
      break;
    case "West Virginia":
      return 54;
      break;
    case "Wisconsin":
      return 55;
      break;
    case "Wyoming":
      return 56;
      break;
    default:
      return 01;
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

defaultRegion = "";
function func(data) {
  defaultLocation = data.region;
  $("#defaultState").html(data.region);
  $("#stateName").html(data.region);
  var yearCall = "";
  var totalYears = "";
  for (let i = 0; i < 21; i++) {
    yr = 2000 + i;
    totalYears += yr.toString() + " ";
    yearCall += "&YEAR=" + yr;
  }

  fetch(
    `https://api.census.gov/data/timeseries/poverty/saipe?get=NAME,SAEPOVALL_PT&for=state:${FIPSLocator(
      data.region
    )}${yearCall}`
  )
    .then((response) => response.json())
    .then((theData) => {
      $("#currLocationPov").html(numberWithCommas(theData[21][1]))
      sendData(theData, totalYears)
    });
}

fetch("https://ipapi.co/json/")
  .then((response) => response.text())
  .then((data) => func(JSON.parse(data)));

function dismissModal() {
  if (currentModal) {
    currentModal.dismiss().then(() => {
      currentModal = null;
    });
  }
}

async function handleButtonClick(message) {
  const toast = await toastController.create({
    color: 'light',
    duration: 2000,
    message: `${message}`,
    showCloseButton: true,
  });

  await toast.present();
}

$("#default").click(function () {
  if (defaultLocation == currLocation) {
    handleButtonClick("Already Showing");
  } else {
    clicked(FIPSLocator(defaultLocation))
  }
})

const searchbar = document.querySelector("ion-searchbar");
var items = Array.from(document.getElementById("list").children);

searchbar.addEventListener("ionInput", handleInput);

function handleInput(event) {
  const query = event.target.value.toLowerCase();
  requestAnimationFrame(() => {
    items.forEach((item) => {
      const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
      item.style.display = shouldShow ? "block" : "none";
    });
  });
}

/*
fetch('https://gnews.io/api/v4/search?q=poverty&token=414779bc143d5d4775465a56f639719e')
  .then(response => response.text())
  .then(data => iterate(JSON.parse(data)));


//news cards
var allData = [];
function iterate(data) {
  data = data.articles;

  idName = -1;
  data.forEach(element => {
    idName++;
    varNameImg = "#im" + idName;
    $(varNameImg).attr("src", element.image);

    varNameTitle = "#t" + idName
    $(varNameTitle).html(element.title);

    allData.push(element.url)
  })
}
*/
fetch('https://newsdata.io/api/1/news?apikey=pub_54761cda437166ec7a38dbf4cfc5db8661a2&q=poverty')
  .then(response => response.text())
  .then(data => iterate(JSON.parse(data).results));


//news cards
var allData = [];
function iterate(data) {
  console.log(data)
  var identifier = 0;
  for(let i = 0; i < 9; i++) {
    if(data[i].image_url == null) {
      $(`#im${i}`).attr("src", "https://images.pexels.com/photos/889042/pexels-photo-889042.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
    } else {
      $(`#im${i}`).attr("src", data[i].image_url)
    }
    
    $(`#t${i}`).html(data[i].title)
    allData.push(data[i].link)
  }
}

var currArticle = "";
$("#card0").click(function () {
  currArticle = allData[0];
  openModal();
})
var currArticle = "";
$("#card1").click(function () {
  currArticle = allData[1];
  openModal();
})
var currArticle = "";
$("#card2").click(function () {
  currArticle = allData[2];
  openModal();
})
var currArticle = "";
$("#card3").click(function () {
  currArticle = allData[3];
  openModal();
})
var currArticle = "";
$("#card4").click(function () {
  currArticle = allData[4];
  openModal();
})
var currArticle = "";
$("#card5").click(function () {
  currArticle = allData[5];
  openModal();
})
var currArticle = "";
$("#card6").click(function () {
  currArticle = allData[6];
  openModal();
})
var currArticle = "";
$("#card7").click(function () {
  currArticle = allData[7];
  openModal();
})
var currArticle = "";
$("#card8").click(function () {
  currArticle = allData[8];
  openModal();
})


//popup on news click
const pageEl = document.querySelector('.ion-page');
customElements.define(
  'modal-content',
  class ModalContent extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
    <ion-header translucent>
      <ion-toolbar style="padding-top: 0px;">
        <ion-title>Modal Content</ion-title>
        <ion-buttons slot="end">
          <ion-button onclick="dismissModal()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <iframe src="${currArticle}" title="news" style="border: none; height: 100%; width: 100%"></iframe>
    </ion-content>
  `;
    }
  }
);

let currentModal = null;
async function openModal(opts = {}) {
  const modal = await modalController.create({
    component: 'modal-content',
    ...opts,
  });
  modal.present();

  currentModal = modal;
}

var charityIndex = 0;
var titles = ["Defeat Poverty", "The Borgen Project", "World Relief", "Care International"]
var images = ["https://media.globalcitizen.org/thumbnails/13/00/13004612-2e8d-4787-971c-21bfd2963b7a/bbh-singapore-d2hs0grfcpq-unsplash.jpg__1600x900_q85_crop_subsampling-2.jpg", "https://i.ibb.co/crg6dy4/pexels-pixabay-50707-Cropped.jpg", "https://i.ibb.co/F6J3gYp/ERM-7288-scaled-Cropped.jpg", "https://i.ibb.co/6JkR0hq/pexels-pixabay-45842-Cropped.jpg"]
var descriptions = ["Global Citizen is a movement of engaged citizens who are using their collective voice to end extreme poverty by 2030.", "The Borgen Project believes that leaders of the most powerful nation on earth should be doing more to address global poverty.", "At World Relief our mission is to empower the local church to serve the most vulnerable.", "CARE works around the globe to save lives, defeat poverty and achieve social justice."]
var links = ["https://www.globalcitizen.org/en/campaign/defeat-poverty/", "https://borgenproject.org/", "https://worldrelief.org/", "https://www.care-international.org/"]


function change() {
  $("#charityImage").fadeOut(300);
  setTimeout(() => { $("#charityImage").attr("src", `${images[charityIndex]}`) }, 250);
  $("#charityImage").fadeIn(300);

  $("#charityTitle").fadeOut(300);
  setTimeout(() => { $("#charityTitle").text(`${titles[charityIndex]}`) }, 250);
  $("#charityTitle").fadeIn(300);

  $("#donate1").attr("href", `${links[charityIndex]}`)

  $("#charityDescription").fadeOut(300);
  setTimeout(() => { $("#charityDescription").text(`${descriptions[charityIndex]}`) }, 250);
  $("#charityDescription").fadeIn(300);

  $("#contribute").fadeOut(300);
  setTimeout(() => { $("#contribute").text(`Contribute`) }, 250);
  $("#contribute").fadeIn(300);

  $("#prev").css("color", "#32d74b");
}
//change charity
$("#next").click(function () {
  if (charityIndex != 3) {
    change();
    charityIndex += 1;
  }

  if (charityIndex == 3) {
    $("#next").css("color", "gray")
  }
})

$("#prev").click(function () {
  if (charityIndex != 0) {
    change();
    charityIndex -= 1;
  }

  if (charityIndex == 0) {
    $("#prev").css("color", "gray")
    $("#next").css("color", "#32d74b")
  }
})


function updateRecent(arr) {

  arr.forEach(element => {
    fetch("https://api.census.gov/data/timeseries/poverty/saipe?get=NAME,SAEPOVALL_PT&for=state:" + FIPSLocator(element) + "&YEAR=2020")
      .then(response => response.json())
      .then(data => {

        document.getElementById("newItems").innerHTML += `
            <ion-item id="default">
              <ion-label>
                <h2>
                  ${element}
                </h2>
                <h5>Current Poverty Rate: <span style="color:#32d74b">${numberWithCommas(data[1][1])}</span></h5>
        
                <ion-icon name="time-outline" style="position: absolute; left: 90%; top: 37%;"></ion-icon>
              </ion-label>
            </ion-item>`
      });


  })


}

var pastHistory = [];

if (localStorage.getItem("history") != null) {
  pastHistory = JSON.parse(localStorage.getItem("history"));
  updateRecent(pastHistory);
}

var count = 0
function autofill(theID, theStateName) {

  document.getElementById("searchBar").value = theStateName;
  clicked(theID)

  pastHistory.push(theStateName)
  localStorage.setItem("history", JSON.stringify(pastHistory));
  //document.getElementById("newItems").innerHTML = "";
  updateRecent(pastHistory.reverse())
}


function segmentChanged() {
  var segmentVal = document.getElementById("segment").value;
  if (segmentVal == "district") {
    $("#list").css("display", "none");
    $("#mainDiv").css("display", "block")
    items = Array.from(document.getElementById("districtList").children);

  } else {
    $("#list").css("display", "block");
    $("#mainDiv").css("display", "none");
    items = Array.from(document.getElementById("list").children);

  }
}

$("#clear").click(function () {
  localStorage.clear()
  $("#newItems").slideUp();
  setTimeout(() => { $("#newItems").html("") }, 2000);
})

// Store all school districts in localStorage
localDistricts = []
if (localStorage.getItem("districts") != null) {
  localDistricts = JSON.parse(localStorage.getItem("districts"));
  localDistricts = [...new Set(localDistricts)];
  for (let i = 0; i < localDistricts.length; i++) {
    districtAutofill(0, localDistricts[i], true)
  }
}


function updateRecentDistrict(districtName, currRate) {
  localDistricts.push(districtName)
  document.getElementById("newItems").innerHTML += `
    <ion-item id="default">
      <ion-label>
        <h2>
          ${districtName}
        </h2>
        <h5>Current Low-Income Count: <span style="color:#32d74b">${numberWithCommas(currRate)}</span></h5>
        
        <ion-icon name="school-outline" style="position: absolute; left: 90%; top: 37%;"></ion-icon>
      </ion-label>
    </ion-item>`
  localStorage.setItem("districts", JSON.stringify(localDistricts))
}

function displayDistrictData(districtData, totalYears) {

}

localDistricts.reverse();
function districtAutofill(theID, theDistrictName, execute) {

  if (!execute) {
    document.getElementById("searchBar").value = theDistrictName;
    $("#stateName").html(theDistrictName)
  }


  fetch(
    `https://data.delaware.gov/resource/6i7v-xnmf.json?district=${theDistrictName}&race=All%20Students&gender=All%20Students&grade=All%20Students&specialdemo=Low-Income&geography=All%20Students&schoolcode=0`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      updateRecentDistrict(data[data.length - 1].district, data[data.length - 1].students)

      allDistrictYears = []
      allDistrictPopulation = []
      for (let i = 0; i < data.length; i++) {
        allDistrictYears.push(data[i].schoolyear)
        allDistrictPopulation.push(data[i].students)

        try {
          window.bar.destroy();
          var ctx = document.getElementById("charts").getContext("2d");
          window.bar = new Chart(ctx, {
            // The type of chart we want to create
            type: "line",

            // The data for our dataset
            data: {
              labels: allDistrictYears,
              datasets: [
                {
                  label: "Low-Income Student Count",
                  borderColor: "rgb(50, 215, 75)",
                  data: allDistrictPopulation,
                  fill: false,
                  lineTension: 0,
                }
              ],
            },

            // Configuration options go here
            options: {
              scales: {
                xAxes: [
                  {
                    gridLines: {
                      display: false,
                      borderColor: "white",
                    },
                  },
                ],
                yAxes: [
                  {
                    gridLines: {
                      color: "#303030",
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "Poverty Rate",
                    },
                  },
                ],
              },
            },
          });
        } catch (err) {
          console.log("null");
        }


      }


    });

}
