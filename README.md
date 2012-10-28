### the Letterpress Game Solver

This is a cli tool to solve the [Lettpress](http://www.atebits.com/letterpress/) game by Loren Brichter. This solver used a Redis database to preprocess data and store results

### Requirements

1. node (`brew install node`)
2. redis (`brew install redis`)

Only tested on MacOSX 10.8 

### Usage
	
Install libs with `npm`

	> npm install
	
Pre-process the data

	> node import.js
	
Solve the board "epcepkxargbdyqarscimutbeo"

	> node solver.js epcepkxargbdyqarscimutbeo
	
Solve the board "epcepkxargbdyqarscimutbeo" and filtering the results with "pce"

	> node solver.js xxiroarpiiuggozpdchzrazgj xir
	Solving board: xxiroarpiiuggozpdchzrazgj
	--------------------
	airprox
	apraxic
	corixid
	doxographic
	ixora
	orixa
	radix
	--------------------
	Time Spent: 0.185s