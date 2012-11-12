## the Letterpress Solver

In `plain.js`, all words are read into memory and processed. While `solver.js` used a Redis database to preprocess data and store results and works too.

## Requirements

1. node (`brew install node`)
2. redis (`brew install redis`, only needed for solver.js)

Only tested on MacOSX 10.8 

## Usage

### The Plain Version

A plain version to solve the board __without__ redis is also included. This is an interactive CLI, enter the board to solve and use `'/'` to filter the results.

	> node plain.js
	System Ready!
	% xxiroarpiiuggozpdchzrazgj
	radiographic        doxographic         idiographic         cardiograph         radiograph          
	zoographic          diagraphic          ophidiaria          audiograph          urographic          
	orographic          cardophagi          xiphopagic          idiograph           ophiuroid           
	rhizocarp           digraphic           jaghirdar           arcograph           xiphopagi           
	paragogic           apagogic            paradrop            pauropod            chiragra            
	aciduria            urochord            ophiurid            podagric            podocarp            
	odograph            chorioid            churidar            approach            apograph            
	...
	--------------------
	Found 896 results, time spent: 0.01s

	% /goo
	doxographic         zoographic          orographic          odograph            coraggio            
	groupoid            porrigo             hopdog              gorgio              droog               
	gazoo               cohog               doggo               agood               gogo                
	good                goog                goop                goor                pogo                
	goo                 
	--------------------
	Filtered 21 results
	

### The Redis Version

Install libs with `npm`

	> npm install
	
Pre-process the data

	> node import.js
	
Solve the board "epcepkxargbdyqarscimutbeo"

	> node solver.js epcepkxargbdyqarscimutbeo

Solve the board "epcepkxargbdyqarscimutbeo" and filter the results with "epc"

	> node solver.js epcepkxargbdyqarscimutbeo	epc