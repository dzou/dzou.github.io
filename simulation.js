var GLOBAL_ID_COUNTER = 0;
var ITERATIONS = 50;
var STARTING_SCORE = 50;

function GrimTrigger() {
	this.name = "GrimTrigger";
	this.history = {};
	this.id = nextId();
	this.score = STARTING_SCORE;
	this.scoreHistory = [this.score];


	this.getMove = function(otherid) {
		if (this.history[otherid]== null || this.history[otherid] == 'C') {
			return 'C';
		} else {
			return 'D';
		}
	};

	this.updateHistory = function(otherid, move) {
		if (this.history[otherid] == null || this.history[otherid] == 'C') {
			this.history[otherid] = move;
		}
		
	};

	this.updateScore = function(score) {
		this.score += score;
	};

	this.updateScoreHistory = function() {
		this.scoreHistory.push(this.score);
	};
}

function Pushover() {
	this.name = "Pushover";
	this.score = STARTING_SCORE;
	this.id = nextId();
	this.scoreHistory = [this.score];

	this.getMove = function(otherid) {
		return 'C';
	};

	this.updateHistory = function(otherid, move) { };

	this.updateScore = function(score) {
		this.score += score;
	};

	this.updateScoreHistory = function() {
		this.scoreHistory.push(this.score);
	};
}

function Defector() {
	this.name = "Defector";
	this.score = STARTING_SCORE;
	this.id = nextId();
	this.scoreHistory = [this.score];

	this.getMove = function(otherid) {
		return 'D';
	};

	this.updateHistory = function(otherid, move) { };

	this.updateScore = function(score) {
		this.score += score;
	};

	this.updateScoreHistory = function() {
		this.scoreHistory.push(this.score);
	};
}

function TitForTat() {
	this.name = "TitForTat";
	this.history = {};
	this.id = nextId();
	this.score = STARTING_SCORE;
	this.scoreHistory = [this.score];


	this.getMove = function(otherid) {
		if (this.history[otherid]== null || this.history[otherid] == 'C') {
			return 'C';
		} else {
			return this.history[otherid];
		}
	};

	this.updateHistory = function(otherid, move) {
		this.history[otherid] = move;
	};

	this.updateScore = function(score) {
		this.score += score;
	};

	this.updateScoreHistory = function() {
		this.scoreHistory.push(this.score);
	};
}

function Random() {
	this.name = "Random";
	this.history = {};
	this.id = nextId();
	this.score = STARTING_SCORE;
	this.scoreHistory = [this.score];


	this.getMove = function(otherid) {
		if (Math.random() < 0.5) {
			return 'C';
		} else {
			return 'D';
		}
	};

	this.updateHistory = function(otherid, move) {
		this.history[otherid] = move;
	};

	this.updateScore = function(score) {
		this.score += score;
	};

	this.updateScoreHistory = function() {
		this.scoreHistory.push(this.score);
	};
}

function ProbabilityResponder() {
	this.name = "ProbabilityResponder";
	this.history = {};
	this.id = nextId();
	this.score = STARTING_SCORE;
	this.scoreHistory = [this.score];

	this.coopCount = 0;
	this.defCount = 0;


	this.getMove = function(otherid) {
		if (this.defCount == 0) {
			return 'C';
		} else {
			if (Math.random() < this.coopCount / (this.coopCount + this.defCount)) {
				return 'C';
			} else {
				return 'D';
			}
		}
	};

	this.updateHistory = function(otherid, move) {
		this.history[otherid] = move;
		if (move == 'C') {
			this.coopCount++;
		} else {
			this.defCount++;
		}
	};

	this.updateScore = function(score) {
		this.score += score;
	};

	this.updateScoreHistory = function() {
		this.scoreHistory.push(this.score);
	};
}

function initArray(params) {
	var strategyList = new Array();

	if (params['pushover'] != null)	{
		for (var i = 0; i < params['pushover']; i++) {
			strategyList.push(new Pushover());
		}
	}

	if (params['defector'] != null) {
		for (var i = 0; i < params['defector']; i++) {
			strategyList.push(new Defector());
		}
	}

	if (params['grimTrigger'] != null) {
		for (var i = 0; i < params['grimTrigger']; i++) {
			strategyList.push(new GrimTrigger());
		}
	}

	if (params['titForTat'] != null) {
		for (var i = 0; i < params['titForTat']; i++) {
			strategyList.push(new TitForTat());
		}
	}

	if (params['random'] != null) {
		for (var i = 0; i < params['random']; i++) {
			strategyList.push(new Random());
		}
	}

	if (params['probabilityResponder'] != null) {
		for (var i = 0; i < params['probabilityResponder']; i++) {
			strategyList.push(new ProbabilityResponder());
		}
	}

	return strategyList;
}

function runSimulation(params) {
	var idCounter = 0;
	var strategyList = initArray(params);

	for (var i = 0; i < ITERATIONS; i++) {
		for (var x = 0; x < strategyList.length; x++) {
			for (var y = x + 1; y < strategyList.length; y++) {
				if (strategyList[x].score > 0 && strategyList[y].score > 0)
					playRound(strategyList[x], strategyList[y]);
			}
		}

		for (var j = 0; j < strategyList.length; j++) {
			strategyList[j].updateScoreHistory();
		}
	}

	strategyList.sort(function(a, b) {
		if (a.score > b.score) {
			return -1;
		} else if (a.score == b.score) {
			return 0;
		} else {
			return 1;
		}
	});

	return strategyList;
}

function playRound(s1, s2) {
	var moveS1 = s1.getMove(s2.id);
	var moveS2 = s2.getMove(s1.id);

	s1.updateHistory(s2.id, moveS2);
	s2.updateHistory(s1.id, moveS1);

	if (moveS1 == 'C' && moveS2 == 'C') {
		s1.updateScore(1);
		s2.updateScore(1);
	} else if (moveS1 == 'C' && moveS2 == 'D') {
		s1.updateScore(-2);
		s2.updateScore(2);
	} else if (moveS1 == 'D' && moveS2 == 'C') {
		s1.updateScore(2);
		s2.updateScore(-2);
	} else {
		s1.updateScore(-1);
		s2.updateScore(-1);
	}
}

function nextId() {
	GLOBAL_ID_COUNTER++;
	return GLOBAL_ID_COUNTER;
}