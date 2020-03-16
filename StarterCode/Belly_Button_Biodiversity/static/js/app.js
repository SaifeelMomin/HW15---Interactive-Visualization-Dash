function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  var metaPanel = d3.select("#sample-metadata");
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(sampleDict){
    metaPanel.html("")
    for (const [key, value] of Object.entries(sampleDict)) {
      metaPanel
        .append("div")
        .text(`${key}: ${value}`);
    }
  })

    // Use d3 to select the panel with id of `#sample-metadata`
    
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}
function sorter(data){
  var sampValues = data['sample_values']
  var otuIds = data['otu_ids']
  var otuLabels = data['otu_labels']

  var dataList = []
  for (var j = 0; j < sampValues.length; j++) {
    dataList.push({'otu_ids': otuIds[j], 'sample_values':sampValues[j], 'otu_labels':otuLabels[j]})
  }
  dataList.sort(function(a,b){
    return ((b.sample_values - a.sample_values))
  })
  for (var k = 0; k < dataList.length; k++){
    sampValues[k] = dataList[k].sample_values;
    otuIds[k] = dataList[k].otu_ids; 
    otuLabels[k] = dataList[k].otu_labels; 
  }
  var newData = {'otu_ids' : otuIds.slice(0, 11), 'sample_values': sampValues.slice(0, 11), 'otu_labels': otuLabels.slice(0, 11)}
  return newData

}

function buildCharts(sample) {
  var piePlace = d3.select('#pie')
  Plotly.purge('pie');
  var bubblePlace = d3.select("#bubble")
  Plotly.purge('bubble');
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data) {
    let bubbleData = [{
      x: data['otu_ids'],
      y: data['sample_values'],
      mode: 'markers',
      marker:{
        size: data['sample_values'],
        color: data['otu_ids']
      },
      text : data['otu_labels']
    }]
    var bubbleLayout = {
      xaxis: {
        title: {
          text: 'Otu Ids',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: 'seagreen'
          }
        }}
    };

    // * Use `otu_ids` for the x values
    // * Use `sample_values` for the y values
    // * Use `sample_values` for the marker size
    // * Use `otu_ids` for the marker colors
    // * Use `otu_labels` for the text values

 //   // var trace1 = {
    //   x: [1, 2, 3, 4],
    //   y: [10, 11, 12, 13],
    //   text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
    //   mode: 'markers',
    //   marker: {
    //     color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
    //     size: [40, 60, 80, 100]
    //   }
//    // };
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // Plotly.purge('pie');
    let sortedData = sorter(data)
    let pieData = [{
      values: sortedData['sample_values'],
      labels: sortedData['otu_ids'],
      type: 'pie',
      hovertext: sortedData['otu_labels']}]
    
    Plotly.plot("bubble", bubbleData, bubbleLayout)
    Plotly.plot("pie", pieData)
  })





    // @TODO: Build a Bubble Chart using the sample data


}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
