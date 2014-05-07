$(window).load(
	function() {
		var textarea = $("#textarea");
		var button = $("#button");

		$("#graphsDiv").hide();
		$("#instructionsDiv").hide();
		$("#debug").hide();

		button.click(
			function() {

				var iterationsParam = parseInt($("#iterations").val());
				if (iterationsParam != null && iterationsParam > 0) {
					ITERATIONS = iterationsParam;
				}

				// Process Strategy Counts
				var params = {};
				params['pushover'] = parseInt($("#pushoverCount").val());
				params['titForTat'] = parseInt($("#titForTatCount").val());
				params['grimTrigger'] = parseInt($("#grimTriggerCount").val());
				params['random'] = parseInt($("#randomCount").val());	
				params['defector'] = parseInt($("#defectorCount").val());
				params['generousRandomizer'] = parseInt($("#generousRandomizerCount").val());

				params['doubleTitForTat'] = parseInt($("#doubleTitForTatCount").val());
				params['suspiciousTitForTat'] = parseInt($("#suspiciousTitForTatCount").val());
				params['titForTwoTat'] = parseInt($("#titForTwoTatCount").val());
				params['grim75'] = parseInt($("#grim75count").val());
				params['7TitForTat'] = parseInt($("#7TitForTatCount").val());

				var result = runSimulation(params);
				$("#debug").val(JSON.stringify(result));

				var resultHtmlTable = processResults(result);
				

				$("#rankings").html(resultHtmlTable);
				$("#textarea").val(JSON.stringify(result));

				var graphData = getGraphData(result);

				var options = {
					grid: {
						borderWidth: 1,
						minBorderMargin: 20,
						labelMargin: 3,
						backgroundColor: {
							colors: ["#fff", "#e4f4f4"]
						},
						margin: {
							top: 0,
							bottom: 30,
							left: 20
						}
					},

				    series: {
				        lines: { show: true },
				        points: { show: false }
				    },
				    legend: {
					    container: $("#legend")
					},
					yaxis: {
						show: false
					}
				};

				$.plot($("#graph"), graphData, options);

				var yaxisLabel = $("<div class='axisLabel yaxisLabel'></div>")
				.text("Score of Player")
				.appendTo($("#graph"));
				yaxisLabel.css("margin-top", yaxisLabel.width() / 2 + 50);

				var yaxisLabel = $("<div class='axisLabel xaxisLabel'></div>")
				.text("Round Number")
				.appendTo($("#graph"));
				yaxisLabel.css("margin-top", yaxisLabel.width() / 2 + 50);
			}
		);

		$("#settingsToggle").click(
			function() {
				$("#resultsDiv").show();
				$("#graphsDiv").hide();
				$("#instructionsDiv").hide();
			}
		);

		$("#graphsToggle").click(
			function() {
				$("#instructionsDiv").hide();
				$("#resultsDiv").hide();
				$("#graphsDiv").show();
			}
		);

		$("#instructionsToggle").click(
			function() {
				$("#resultsDiv").hide();
				$("#graphsDiv").hide();
				$("#instructionsDiv").show();
			}
		);

		function processResults(result) {
			var tableHtml = "<table>";
			tableHtml += "<thead><tr><td>Rank</td><td>Name</td><td>Score</td></tr></thead>";
			for (var i = 0; i < result.length && i < 10; i++) {
				if (result[i].score > 0) {
					tableHtml += "<tr>";
					tableHtml += "<td>" + (i + 1) + "</td>";
					tableHtml += "<td>" + result[i].name + "</td>";
					tableHtml += "<td>" + result[i].score + "</td>";
					tableHtml += "</tr>";
				}
			}
			tableHtml += "</table>";
			return tableHtml;
		}

		function getGraphData(result) {
			var strategiesUsed = {};
			var graphData = [];
			for (var i = 0; i < result.length; i++) {
				if (strategiesUsed[result[i].name] == null) {
					var series = {};
					series['label'] = result[i].name;

					var datapoints = [];
					for (j = 0; j < result[i].scoreHistory.length; j++) {
						datapoints.push([j, result[i].scoreHistory[j]]);
					}
					series['data'] = datapoints;
					graphData.push(series);

					strategiesUsed[result[i].name] = true;
				}
			}			
			return graphData;
		}

	}
);