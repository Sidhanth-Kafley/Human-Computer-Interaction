oneFrameOfData = nj.array([[[  907.35753,  306.02584,    47.5107,  907.35753,  306.02584,    47.5107],
        [  907.35753,  306.02584,    47.5107,  626.39066,  202.14157,     37.962],
        [  626.39066,  202.14157,     37.962,  442.02386,  134.71586,    27.4169],
        [  442.02386,  134.71586,    27.4169,  308.04099,    84.1127,    28.9748]],
       [[  941.79863,  204.99311,    41.9381,  640.08267,   133.8505,   -6.12596],
        [  640.08267,   133.8505,   -6.12596,  475.49338,   82.35069,   -34.8365],
        [  475.49338,   82.35069,   -34.8365,  381.48695,    78.2428,   -51.7621],
        [  381.48695,    78.2428,   -51.7621,  316.80921,   89.81579,    -63.707]],
       [[ 1001.85873,  192.75806,    35.1888,  766.67611,  123.13766,   -15.2162],
        [  766.67611,  123.13766,   -15.2162,  670.38668,   55.14374,   -53.0762],
        [  670.38668,   55.14374,   -53.0762,  605.84516,   37.15868,   -76.0861],
        [  605.84516,   37.15868,   -76.0861,  559.95987,   37.78425,   -91.2944]],
       [[ 1066.46387,  194.77551,    28.8419,  910.08665,  132.39605,   -20.2294],
        [  910.08665,  132.39605,   -20.2294,  813.21561,   73.81691,   -55.2469],
        [  813.21561,   73.81691,   -55.2469,   742.7383,   61.37334,   -77.3819],
        [   742.7383,   61.37334,   -77.3819,  690.79744,   66.59683,   -92.1008]],
       [[ 1132.54361,  229.57268,    23.2087, 1039.60682,  162.93936,    -24.147],
        [ 1039.60682,  162.93936,    -24.147, 1027.98972,  106.96154,   -53.0304],
        [ 1027.98972,  106.96154,   -53.0304, 1014.89054,   84.32644,   -69.4425],
        [ 1014.89054,   84.32644,   -69.4425,  998.44546,    70.8194,   -84.0947]]])

function draw(){
  clear();
  for(var fingerIndex=0; fingerIndex<5; fingerIndex++){
    for(var boneIndex=0;boneIndex<4;boneIndex++){
      //console.log(oneFrameOfData.toString());
      var xStart = oneFrameOfData.get(fingerIndex, boneIndex, 0);
      var yStart = oneFrameOfData.get(fingerIndex, boneIndex, 1);
      var zStart = oneFrameOfData.get(fingerIndex, boneIndex, 2);
      var xEnd = oneFrameOfData.get(fingerIndex, boneIndex, 3);
      var yEnd = oneFrameOfData.get(fingerIndex, boneIndex, 4);
      var zEnd = oneFrameOfData.get(fingerIndex, boneIndex, 5);
      line(xStart, yStart, xEnd, yEnd);
    }
  }
}
