var config = {
  responsive: true,
  scrollZoom: true,
  displaylogo: false,
  modeBarButtonsToRemove: ["zoom2d","pan2d","select2d","lasso2d","toggleSpikelines","resetScale2d"],
  modeBarButtons: [[{
    name: "toImageButton",
    icon: Plotly.Icons.camera,
    click: function (gd) {
      imageNumber++;
      Plotly.downloadImage(gd, {
        filename: plotName + formatImageName(new Date(),imageNumber),
        format: "png",
        height: 500,
        width: 700,
        scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
      });
    }
  }, 'toImage'], []]
};
