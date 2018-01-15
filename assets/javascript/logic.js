var trainName = "";
var destination = "";
var startingTime = "00:00";
var frequency = 0;

var config = {
    apiKey: "AIzaSyCmGjsuu9BI9i9s7p6ckE6bPDjqcEM4B9M",
    authDomain: "train-schedule-f578e.firebaseapp.com",
    databaseURL: "https://train-schedule-f578e.firebaseio.com",
    projectId: "train-schedule-f578e",
    storageBucket: "train-schedule-f578e.appspot.com",
    messagingSenderId: "785555758947"
};
firebase.initializeApp(config);

var database = firebase.database()

$("#submit-button").on("click", function(event) {
    event.preventDefault();

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    startingTime = $("#starting-time").val().trim();
    frequency = $("#frequency").val().trim();

    database.ref().push( {
        trainName: trainName,
        destination: destination,
        startingTime: startingTime,
        frequency: frequency
    });

    $("#train-name").val("");
    $("#destination").val("");
    $("#starting-time").val("");
    $("#frequency").val("");

});

database.ref().on("child_added", function(childSnapshot) {

    trainName = childSnapshot.val().trainName;
    destination = childSnapshot.val().destination;
    startingTime = childSnapshot.val().startingTime;
    frequency = childSnapshot.val().frequency;

    nextTrainFinder();

});

nextTrainFinder = function() {
    var startTime = moment(startingTime, "HH:mm");
    var currentTime = moment();
    while (startTime < currentTime) {
        startTime.add(frequency, 'minutes')
        if(startTime > currentTime) {
            var minutesRemaining = startTime.diff(currentTime, 'minutes');
            var newRow =
                `<tr>
                <td>${trainName}</td>
                <td>${destination}</td>
                <td>${frequency} min</td>
                <td>${startTime.format("hh:mm a")}</td>
                <td>${minutesRemaining} min</td>
                </tr>`

            $("#train-table").prepend(newRow);
        }
    }
}