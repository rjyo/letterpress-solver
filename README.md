### the Letterpress Game Solver

This is a cli tool to solve the [Letterpress](http://www.atebits.com/letterpress/) game by Loren Brichter. This solver used a Redis database to preprocess data and store results

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
	

Solve the board "epcepkxargbdyqarscimutbeo" __without__ redis. This is an interactive CLI, enter the board to solve and use `'/'` to filter.

	> node plain.js
	System Ready!
	lp% xxiroarpiiuggozpdchzrazgj
	Found 896 results, time spent: 0.01s
	--------------------
	radiographic        doxographic         idiographic         cardiograph         radiograph          
	zoographic          diagraphic          ophidiaria          audiograph          urographic          
	orographic          cardophagi          xiphopagic          idiograph           ophiuroid           
	rhizocarp           digraphic           jaghirdar           arcograph           xiphopagi           
	paragogic           apagogic            paradrop            pauropod            chiragra            
	aciduria            urochord            ophiurid            podagric            podocarp            
	odograph            chorioid            churidar            approach            apograph            
	...

	lp% /goo
	Filtered 21 results
	--------------------
	doxographic         zoographic          orographic          odograph            coraggio            
	groupoid            porrigo             hopdog              gorgio              droog               
	gazoo               cohog               doggo               agood               gogo                
	good                goog                goop                goor                pogo                
	goo                 
