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

    ± % node plain.js
    System Ready!
    lp% bxuwhckkvkzjphnozatpunexs
    watchboxes
    nonsubject
    nuncupates
    outpunches
    buckwheats
    phosphate
    nanotechs
    nanotubes
    naphthous
    ...
    --------------------
    Found 3360 results, time spent: 0.019s
    lp% /pun
    nuncupates
    outpunches
    naphthous
    nuncupate
    unweapons
    puncheons
    putcheons
    lp% 
