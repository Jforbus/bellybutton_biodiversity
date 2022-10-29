function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

// Create function to update page for selected Test Subject ID
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample); 
};

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
};

// Create the buildCharts function.
function buildCharts(sample) {
  barChart(sample);
  bubbleChart(sample);
  gaugeChart(sample);
};




// Create top 10 bar chart function
function barChart(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var selectedSample = samples.filter(select => select.id == sample)[0];
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = selectedSample.otu_ids;
    var otu_labels = selectedSample.otu_labels;
    var sample_values = selectedSample.sample_values;

    
    // Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      type: 'bar',
      orientation: 'h',
      text: otu_labels.slice(0, 10).reverse(),
      marker:{
        color: 'navy'
      }
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title:{text:'<b>Top 10 Bacteria Cultures Found</b>', font:{color: 'navy'}},
     paper_bgcolor: "rgba(0,0,0,0)",
     plot_bgcolor: "rgba(0,0,0,0)",
     autosize: true
    };
    // Make plot responsive to screen size
    var config = {responsive: true};
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout,config);
  });
};

// Create Sample Bubble Chart
function bubbleChart (sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var selectedSample = samples.filter(select => select.id == sample)[0];
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = selectedSample.otu_ids;
    var otu_labels = selectedSample.otu_labels;
    var sample_values = selectedSample.sample_values;


    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Jet'
      },
      text: otu_labels 
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text:'<b>Bacteria Cultures Per Sample</b>', font:{color: 'navy'}},
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      yaxis:{
        gridcolor: 'white'
      },
      xaxis:{
        title: 'OTU ID',
        gridcolor: 'white'
      },
      hovermode: 'closest',
      autosize: true
    };

    // Make plot responsive to screen size
    var config = {responsive: true};
    // Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout, config); 
  });
};



// Create Washing Frequency Guage Chart
function gaugeChart(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("static/js/samples.json").then((data) => {

    // Create a variable that filters the metadata array for the object with the desired sample number.
    var result = data.metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Create a variable that holds the washing frequency.
    var wfreq = parseFloat(result.wfreq);
    
    // Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      type: 'indicator',
      mode: 'gauge+number',
      value: wfreq,
      title: {text: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week', font:{color: 'navy'}},
      gauge: {
        axis: {range: [null, 10], dtick: 2},
        bar: {color: 'navy'},
        bgcolor: 'white',
        steps: [
          {range: [0, 2], color: 'crimson'},
          {range: [2, 4], color: 'darkorange'},
          {range: [4, 6], color: 'yellow'},
          {range: [6, 8], color: 'lightgreen'},
          {range: [8, 10], color: 'darkgreen'}]}

    }];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = {
      autosize: true,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: {color: 'navy'},
      autosize: true
    };
    // Make plot responsive to screen size
    var config = {responsive: true};
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout, config);
  });  
};
