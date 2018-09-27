// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new Trains - then update the html + update the database
// 3. Create a way to retrieve Trains from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCAs88cqmliU0oHyvhOjydoQaeAbZBRQIA",
    authDomain: "train-game-7a083.firebaseapp.com",
    databaseURL: "https://train-game-7a083.firebaseio.com",
    projectId: "train-game-7a083",
    storageBucket: "train-game-7a083.appspot.com",
    messagingSenderId: "495514837039"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trnName = $("#train-name-input").val().trim();
    var trnDestination = $("#destination-input").val().trim();
    var trnStart = moment($("#start-input").val().trim()).format("MM/DD/YY HH:mm:ss");
    var trnFrequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding Train data
    // var newTrn = {
    //   name: trnName,
    //   destination: trnDestination,
    //   start: trnStart,
    //   frequency: trnFrequency
    // };

    // Uploads Train data to the database
    database.ref().push({
        name: trnName,
        destination: trnDestination,
        start: trnStart,
        frequency: trnFrequency
    });

    // Logs everything to console
    console.log(newTrn.name);
    console.log(newTrn.destination);
    console.log(newTrn.start);
    console.log(newTrn.frequency);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding Train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trnName = childSnapshot.val().name;
    var trnDestination = childSnapshot.val().destination;
    var trnStart = childSnapshot.val().start;
    var trnFrequency = childSnapshot.val().frequency;

    // Train Info
    console.log(trnName);
    console.log(trnDestination);
    console.log(trnStart);
    console.log(trnFrequency);

    // Format the Train start
    var trnStartPretty = moment(trnStart).format("MM/DD/YY HH:mm:ss");
    console.log('Start Time', trnStartPretty)

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(trnStartPretty, "MM/DD/YY HH:mm:ss").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("MM/DD/YY HH:mm:ss"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var trnRemainder = diffTime % trnFrequency;
    console.log(trnRemainder);

    // Minute Until Train
    var trnMinsAway = trnFrequency - trnRemainder;
    console.log("MINUTES TILL TRAIN: " + trnMinsAway);

    // Next Train
    var trnNextTrain = moment().add(trnMinsAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(trnNextTrain).format("MM/DD/YY HH:mm:ss"));

    // // Calculate the minutes away the next train is  using hardcore math
    // // To calculate the next Train arrival time
    // var trnStart = moment().diff(moment(trnNextTrain), "mins");
    // console.log(trnNextTrain);

    // // Calculate the total frequency
    // var trnMinsAway = trnNextTrain * trnFrequency;
    // console.log(trnMinsAway);

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trnName),
        $("<td>").text(trnDestination),
        $("<td>").text(trnStartPretty),
        $("<td>").text(trnFrequency),
        $("<td>").text(trnNextTrain),
        $("<td>").text(trnMinsAway)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Train start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case