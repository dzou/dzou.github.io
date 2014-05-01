$(window).load(
	function() {
		var textarea = $("#textarea");
		var button = $("#button");

		$("#graphsDiv").hide();

		button.click(
			function() {

				ITERATIONS = parseInt($("iterations").val());

				// Process Strategy Counts
				var params = {};
				params['pushover'] = parseInt($("#pushoverCount").val());
				params['titForTat'] = parseInt($("#titForTatCount").val());
				params['grimTrigger'] = parseInt($("#grimTriggerCount").val());
				params['random'] = parseInt($("#randomCount").val());	
				params['defector'] = parseInt($("#defectorCount").val());
				params['probabilityResponder'] = parseInt($("#probabilityResponderCount").val());
				var result = runSimulation(params);

				var resultHtmlTable = processResults(result);
				

				$("#rankings").html(resultHtmlTable);
				$("#textarea").val(JSON.stringify(result));

				var graphData = getGraphData(result);

				var options = {
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
			}
		);

		$("#settingsToggle").click(
			function() {
				$("#resultsDiv").show();
				$("#graphsDiv").hide();
			}
		);

		$("#graphsToggle").click(
			function() {
				$("#resultsDiv").hide();
				$("#graphsDiv").show();
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