// Use matchMedia to check the user preference
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
console.log(prefersDark)

toggleDarkTheme(prefersDark);

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

    document.getElementById("districtCharts").style.display = "none"
    document.getElementById("charts").style.display = "block"
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
    try {
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
    } catch (error) {
        alert(error)
    }

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

allDefaultStateData = [];

function func(data, defaultToState) {
    if (defaultToState) {
        $("#rateCount").html("Poverty count in ")
        defaultLocation = "";

        localStorage.setItem("defaultToState", "true")

        if (localStorage.getItem("recentState") == null) {
            defaultLocation = data.region;
        } else {
            defaultLocation = localStorage.getItem("recentState")
        }

        var yearCall = "";
        var totalYears = "";
        for (let i = 0; i < 21; i++) {
            yr = 2000 + i;
            totalYears += yr.toString() + " ";
            yearCall += "&YEAR=" + yr;
        }

        fetch(
            `https://api.census.gov/data/timeseries/poverty/saipe?get=NAME,SAEPOVALL_PT&for=state:${FIPSLocator(
                defaultLocation
            )}${yearCall}`
        )
            .then((response) => response.json())
            .then((theData) => {

                allDefaultStateData = [defaultLocation, numberWithCommas(theData[21][1])];
                localStorage.setItem("allDefaultStateData", JSON.stringify(allDefaultStateData));
                allDefaultStateData = JSON.parse(localStorage.getItem("allDefaultStateData"));

                $("#defaultState").html(allDefaultStateData[0]);
                $("#stateName").html(allDefaultStateData[0]);
                $("#currLocationPov").html(allDefaultStateData[1])
                sendData(theData, totalYears)
            });
    }

}

fetch("https://ipapi.co/json/")
    .then((response) => response.text())
    .then((data) => {
        if (localStorage.getItem("defaultToState") == "false") {
            func(JSON.parse(data), false)
        } else {
            func(JSON.parse(data), true)
        }

    });

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

fetch('https://newsdata.io/api/1/news?apikey=pub_54761cda437166ec7a38dbf4cfc5db8661a2&q=poverty')
    .then(response => response.text())
    .then(data => iterate(JSON.parse(data).results));


//news cards
var allData = [];
function iterate(data) {

    var identifier = 0;
    for (let i = 0; i < 9; i++) {
        if (data[i].image_url == null) {
            //Pick random image
            var allImages = ["https://drive.google.com/uc?id=1QqivbiSY_YgeR7YkJ2puIoEYyeIoDgub", "https://drive.google.com/uc?id=1SLtsTAQrmJEy-RMdQ4VHwyOEYjYAcgif", "https://drive.google.com/uc?id=1QGEx3l4bscxY9i8UBqzVmKUtWjoXIHof", "https://drive.google.com/uc?id=1mzSeZWFboNeSR-8D7WLVuCrmmqe3Kyqj", "https://drive.google.com/uc?id=1CI1j05vE0WhzXUrcTJmY7DSgDtnCShOn", "https://drive.google.com/uc?id=1KzoR5FKvr1d-wWUQlVBBizovWSZATeNW", "https://drive.google.com/uc?id=1xc4l71-uNX045dKuzwZi-DuJxofCoQog", "https://drive.google.com/uc?id=13jP-WQ3mBHE5pcwBZQx36FkZZWw9DOL3", "https://drive.google.com/uc?id=1zKX9WILsJIE0pATefEjcIk_j6kPocI-E", "https://drive.google.com/uc?id=1Y7OMb4vH_b6SDxwyzUIVOluuEii7y287", "https://drive.google.com/uc?id=1Cuh_q7hsS-Ch8PTs22azfn0LmDI5OM97"]
            var randomImage = allImages[Math.floor(Math.random() * allImages.length)]
            $(`#im${i}`).attr("src", randomImage)
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
$("#next").click(function() {
    charityIndex ++
    if(charityIndex == 1) {
        $("#DefeatPoverty").fadeIn().css("visibility: block;");

        $("#DefeatPoverty").fadeOut();
        $("#WorldRelief").fadeOut();
        $("#CareInternational").fadeOut();
    } else if(charityIndex == 2) {
        $("#BorgenProject").fadeIn().css("visibility: block;");;

        $("#DefeatPoverty").fadeOut();
        $("#BorgenProject").fadeOut();
        $("#CareInternational").fadeOut();
    } else if(charityIndex == 2) {
        $("#WorldRelief").fadeIn().css("visibility: block;");;

        $("#DefeatPoverty").fadeOut();
        $("#BorgenProject").fadeOut();
        $("#WorldRelief").fadeOut();
    } else if(charityIndex == 2) {
        $("#CareInternational").fadeIn().css("visibility: block;");;

        $("#DefeatPoverty").fadeOut();
        $("#BorgenProject").fadeOut();
        $("#WorldRelief").fadeOut();
    }
})

/*
var charityIndex = 0;
var charityElements = ["DefeatPoverty", "BorgenProject", "WorldRelief", "CareInternational"]

function fadeOutEverything(keep) {
    for(var i; i < 3; i++) {
        if (charityElements[i] != keep) {
            console.log("Remove: " + charityElements[i])
            $("#" + charityElements[i]).fadeOut()
            break;
        }
        if (charityElements[i] == keep) {
            $("#" + charityElements[i]).fadeIn()
            break;
        }
    }
}

function change() {
    console.log('hi')
    fadeOutEverything(charityElements[charityIndex])
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
*/



//recent searches
theHistory = []


function autofill(theID, theStateName) {
    localStorage.setItem("defaultToState", "true")
    document.getElementById("searchBar").value = theStateName;
    localStorage.setItem("current", "state");
    localStorage.setItem("recentState", theStateName)
    localStorage.setItem("history", JSON.stringify(history))
    location.reload();
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


function updateRecentDistrict(districtName, currRate) {
    //localDistricts.push(districtName)
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
    //localStorage.setItem("districts", JSON.stringify(localDistricts))
}

//Auto Caps
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

//localDistricts.reverse();

function districtAutofill(theID, theDistrictName) {
    localStorage.setItem("current", "school")
    localStorage.setItem("currSchool", theDistrictName)
    localStorage.setItem("defaultToState", "false")
    location.reload()
}


if (localStorage.getItem("current") == "school") {

    chartDistrict(localStorage.getItem("currSchool"))
}

function chartDistrict(theDistrictName) {
    $("#rateCount").html("Low Income Count in ")
    allDefaultStateData = JSON.parse(localStorage.getItem("allDefaultStateData"))
    $("#defaultState").html(allDefaultStateData[0]);
    $("#stateName").html(allDefaultStateData[0]);
    $("#currLocationPov").html(allDefaultStateData[1])

    var request = `https://data.delaware.gov/resource/6i7v-xnmf.json?district=${theDistrictName}&race=All%20Students&gender=All%20Students&grade=All%20Students&specialdemo=Low-Income&geography=All%20Students&schoolcode=0`
    console.log(request)

    document.getElementById("searchBar").value = theDistrictName;
    $("#stateName").html(theDistrictName)

    //get data from open data portal
    allDistrictData = [];
    allDistrictYears = []
    allDistrictPopulation = []

    fetch(request)
        .then((response) => response.json())
        .then((data) => {
            allDistrictData = data;

            for (let i = 0; i < data.length; i++) {
                allDistrictYears.push(data[i].schoolyear)
                allDistrictPopulation.push(data[i].students)
            }
            console.log(data)

        });


    try {
        window.bar.destroy();
    } catch (err) {
        console.log("null");
    }



    document.getElementById("charts").style.display = "none";
    document.getElementById("districtCharts").style.display = "block";
    var ctx = document.getElementById("districtCharts").getContext("2d");


    setTimeout(function () {
        document.getElementById("charts").width += 0;
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

    }, 2000);



}

$("#clear").click(function () {
    localStorage.clear();
    location.reload();
})
