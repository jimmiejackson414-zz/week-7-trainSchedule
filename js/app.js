$(document).ready(function() {

            // Link to Firebase
            var trainData = new Firebase("https://train-schedule-app.firebaseio.com/");

            // Button for adding train times
            $("#addTrainBtn").on("click", function() {

                // Takes in user input
                var trainName = $("#trainNameInput").val().trim();
                var destination = $("#destinationInput").val().trim();
                var firstTrainTime = moment($("#firstTrainTime").val().trim(), "HH:mm").format("X");
                var trainFrequency = $("#frequencyInput").val().trim();

                // Creates local "temporary" object for holding train data 
                var newTrain = {
                    train: trainName,
                    destination: destination,
                    firstTrainTime: firstTrainTime,
                    frequency: trainFrequency
                }

                // Uploads train data to the database
                trainData.push(newTrain);

                // Console log check
                console.log(newTrain.train);
                console.log(newTrain.destination);
                console.log(newTrain.firstTrainTime);
                console.log(newTrain.frequency);

                // alert("Train Time Successfully Added");

                // Clears all of the text boxes
                $("#trainNameInput").val("");
                $("#destinationInput").val("");
                $("#firstTrainTime").val("");
                $("#frequencyInput").val("");

                return false;
            });


            // Create Firebase event for adding train to database and a row in the html when user adds entry
            trainData.on("child_added", function(childSnapshot, prevChildKey) {

            	// console.log(childSnapshot.val());

            	// Store everything into a variable
            	var trainName = childSnapshot.val().train;
            	var destination = childSnapshot.val().destination;
            	var firstTrainTime = childSnapshot.val().firstTrainTime;
            	console.log(firstTrainTime);
            	var trainFrequency = childSnapshot.val().frequency;
            	var currentTime = moment();


            	
				var firstTimeConverted = moment.unix(firstTrainTime, "hh:mm").subtract(1, "years");
				console.log(firstTimeConverted);

				var startTime = moment(firstTimeConverted, ["hh:mm"]);
				console.log(startTime);
            	
            	// Takes difference of current time and firstTimeConverted

            	var diffTime = moment().diff(startTime, "minutes");
            	console.log(diffTime);
            	
            	// Evaluates the remainder time
            	console.log("settingTRemainder", diffTime, trainFrequency);
            	var tRemainder = diffTime % trainFrequency;
            	console.log(tRemainder);
            	
            	// Evaluates minutes until the next train arrives
            	console.log(trainFrequency, tRemainder);

            	var tMinutesTillTrain = trainFrequency - tRemainder;
            	console.log(tMinutesTillTrain);

            	// Evaluates time until the next train arrives
            	var nextTrain = moment().add(tMinutesTillTrain, "minutes");
            	console.log(nextTrain);

            	var zNextTrain = moment(nextTrain).format("hh:mm");
            	console.log(zNextTrain);
            	

            	// Write output to table elements
            	$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + trainFrequency + "</td><td>" + zNextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
                });

            })
