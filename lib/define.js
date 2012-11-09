exports.MINUS_INFINITE = -100000;
exports.PLUS_INFINITE = 100000;

exports.WEIGHT_DEEP_COLOR = -10;
exports.WEIGHT_NEAR_BLUE = 10;
exports.WEIGHT_NEAR_DEEP_RED = 10;
exports.WEIGHT_EMPTY = 3;
exports.WEIGHT_OPPONENT_RED = 8;
exports.WEIGHT_VOWEL = 0;
exports.WEIGHT_NEAR_VOWEL = 5;
exports.WEIGHT_BORDER = [3,3,1,3,3,
                         3,0,0,0,3,
                         1,0,0,0,1,
                         3,0,0,0,3,
                         3,3,1,3,3];

exports.WEIGHT_DEEP_RED = -5;
exports.WEIGHT_DEEP_BLUE = 5;
exports.WEIGHT_RED = -1;
exports.WEIGHT_BLUE = 1;

exports.MAX_DEPTH = 1; // this is for the alpha-beta pruning

// minor one of the 2 below will be used
exports.MAX_MOVES_PERCENT = 0.05; // if no results found in first 5% of moves, acknowledge lose
exports.MAX_MOVES_STEP = 500; // if no results found in first 500 of moves, acknowledge lose
