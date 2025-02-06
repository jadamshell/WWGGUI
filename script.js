
const { useState } = React;

const CustomButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    style={{
      WebkitAppearance: 'none',
      appearance: 'none',
      position: 'relative',
      borderWidth: 0,
      padding: '8px',
      minWidth: '12em',  // Increased from 10em
      boxSizing: 'border-box',
      background: 'transparent',
      cursor: 'pointer'
    }}
  >
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 0,
      padding: '14px 18px',  // Increased padding
      height: '24px',  // Increased height
      textAlign: 'center',
      color: active ? '#fff' : '#999',
      textShadow: '0 -1px rgba(0, 0, 0, .25)',
      transition: 'all 0.3s ease',
      userSelect: 'none',
      background: active ? 'radial-gradient(#3dcd9e, #369d8d)' : '#444',
      borderRadius: '4px',
      boxSizing: 'content-box',
      boxShadow: active 
        ? '0 0 8px #3dcd9e, inset 0 0 5px rgba(255,255,255,0.3)' 
        : 'inset 0 0 0 1px rgba(0, 0, 0, .5)'
    }}>
      {label}
    </div>
  </button>
);



const MonitorPanel = ({ controlButtons, activeButton, handleButtonClick }) => {
  const [isPanelVisible, setIsPanelVisible] = React.useState(true);

  // Define all styles inside the component
  const toggleButtonStyles = {
    position: 'absolute',
    top: '8px',
    left: '8px',
    zIndex: 4,
    background: '#4a5568',
    border: 'none',
    borderRadius: '4px',
    padding: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px'
  };

 const dockablePanelStyles = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '500px',  
  maxHeight: '100%',
  background: 'rgba(26, 32, 44, 0.95)',
  borderRight: '1px solid #4a5568',
  padding: '16px',
  zIndex: 3,
  overflowY: 'auto'
};

 const buttonGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',  // Increased gap
  padding: '12px'
};
  
  React.useEffect(() => {
    // Add required CSS
    const style = document.createElement('style');
    style.textContent = `
       #mapDiv {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
      }
      
      #infoDiv {
        padding: 10px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      }
      
      /* Custom Popup Styles */
      .custom-popup {
        padding: 12px;
      }
      .popup-header {
        border-bottom: 2px solid #0079c1;
        margin-bottom: 12px;
        padding-bottom: 8px;
      }
      .popup-title {
        font-size: 1.2em;
        font-weight: bold;
        color: #0079c1;
        margin: 0;
      }
      .popup-subtitle {
        font-size: 0.9em;
        color: #666;
        margin: 4px 0 0 0;
      }
      .popup-content {
        margin: 12px 0;
        max-height: 700px;
       overflow-y: visible;
      }
      .field-group {
        margin: 8px 0;
      }
      .field-label {
        font-weight: 600;
        color: #2b2b2b;
      }
      .field-value {
        color: #4a4a4a;
      }
      .bar-chart {
        margin: 12px 0;
        background: #f5f5f5;
        border-radius: 4px;
        padding: 12px;
      }
      .bar-container {
        width: 100%;
        background-color: #e0e0e0;
        border-radius: 4px;
        margin-top: 6px;
        position: relative;
        height: 20px;
      }
      .bar {
        height: 100%;
        background-color: #0079c1;
        border-radius: 4px;
        transition: width 0.3s ease;
        position: relative;
      }
      .std-range {
        position: absolute;
        height: 8px;
        background-color: rgba(0, 121, 193, 0.3);
        top: 50%;
        transform: translateY(-50%);
        border-radius: 2px;
      }
      .bar-value {
        margin-top: 4px;
        font-size: 12px;
        color: #666;
      }
      .stacked-bar-container {
        width: 100%;
        height: 30px;
        background-color: #e0e0e0;
        border-radius: 4px;
        margin-top: 6px;
        display: flex;
        overflow: hidden;
      }
      .stacked-bar {
        height: 100%;
        transition: width 0.3s ease;
      }
      .stacked-bar-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 8px;
        font-size: 12px;
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }
      
      
      .section-divider {
        margin: 24px 0;
        border-top: 1px solid #ddd;
      }
      .elevation-chart {
        margin: 12px 0;
        background: #f5f5f5;
        border-radius: 4px;
        padding: 12px;
      }
      .elevation-chart canvas {
        width: 100%;
        height: 260px;  
      }
      .elevation-chart-title {
        font-weight: 600;
        color: #2b2b2b;
        margin-bottom: 8px;
      }
      .elevation-legend {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 4px;
        font-size: 12px;
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
    `;
    document.head.appendChild(style);

    // Load ArcGIS CSS and JS
    const link = document.createElement('link');
    link.rel = "stylesheet";
    link.href = "https://js.arcgis.com/4.31/esri/themes/light/main.css";
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = "https://js.arcgis.com/4.31/";
    script.onload = () => {
      require([
        "esri/Map",
        "esri/views/SceneView",
        "esri/layers/FeatureLayer",
        "esri/layers/ImageryLayer",
        "esri/layers/ElevationLayer",
        "esri/widgets/LayerList",
        "esri/popup/content/CustomContent"
      ], (Map, SceneView, FeatureLayer, ImageryLayer, ElevationLayer, LayerList, CustomContent) => {
        
        // Define ordered node names for elevation chart
        const orderedNodes = [
          "Reservoir 1",
          "DM17 West 40",
          "DM1 Inez",
          "DM3 Otto Brown Davella",
          "DM2 Coldwater",
          "KY 40E Pump",
          "DM11 2032",
          "DM17 Meat House",
          "DM7 Hode",
          "DM6 Buck Creek",
          "Kermit",
          "DM9 Pit/Lovely",
          "DM8 292 South",
          "DM10 Long Branch"
        ];

        // Create renderer for main nodes - 3D sphere
        const nodesRenderer = {
          type: "simple",
          symbol: {
            type: "point-3d",
            symbolLayers: [{
              type: "object",
              resource: { primitive: "sphere" },
              material: { color: "#F00000" },
              width: 50,
              height: 50,
              depth: 50
            }]
          }
        };

        // Create renderer for supplemental nodes - 3D sphere
        const suppNodesRenderer = {
          type: "simple",
          symbol: {
            type: "point-3d",
            symbolLayers: [{
              type: "object",
              resource: { primitive: "sphere" },
              material: { color: "#1E8AE3" },
              width: 15,
              height: 15,
              depth: 15
            }]
          }
        };

        // Create renderer for network - 3D path
        const networkRenderer = {
          type: "simple",
          symbol: {
            type: "line-3d",
            symbolLayers: [{
              type: "path",
              profile: "circle",
              width: 4,
              height: 4,
              material: {
                color: [79, 219, 255, 0.61]
              },
              cap: "round",
              join: "round",
              anchor: "bottom"
            }]
          }
        };

        // Create custom popup template
        const popupTemplate = {
          title: "", // We'll handle the title in the custom content
          content: [
            {
              type: "custom",
              creator: function(feature) {
                const div = document.createElement("div");
                div.className = "custom-popup";
                
                // Header section
                const header = document.createElement("div");
                header.className = "popup-header";
                
                const title = document.createElement("h2");
                title.className = "popup-title";
                title.textContent = feature.graphic.attributes.Name;
                
                const subtitle = document.createElement("p");
                subtitle.className = "popup-subtitle";
                subtitle.textContent = `ID: ${feature.graphic.attributes.ID} | Type: ${feature.graphic.attributes.Type}`;
                
                header.appendChild(title);
                header.appendChild(subtitle);
                
                // Content section
                const content = document.createElement("div");
                content.className = "popup-content";
                
                // Add fields based on type
                const type = feature.graphic.attributes.Type;
                
                if (type === "Node") {
                // Population
if (feature.graphic.attributes.TP != null) {
  const populationField = document.createElement("div");
  populationField.className = "field-group";
  populationField.innerHTML = `
    <span class="field-label">Total Population: </span>
    <span class="field-value">${feature.graphic.attributes.TP.toLocaleString()}</span>
  `;
  content.appendChild(populationField);
}

// Base Demand Bar Chart
const bd = feature.graphic.attributes.BD || 0;
                  const maxBD = 800;
                  
                  const barChart = document.createElement("div");
                  barChart.className = "bar-chart";
                  
                  const barLabel = document.createElement("div");
                  barLabel.className = "field-label";
                  barLabel.textContent = "Base Demand (gpm)";
                  
                  const barContainer = document.createElement("div");
                  barContainer.className = "bar-container";
                  
                  const bar = document.createElement("div");
                  bar.className = "bar";
                  bar.style.width = `${(bd / maxBD) * 100}%`;
                  
                  const barValue = document.createElement("div");
                  barValue.className = "bar-value";
                  barValue.textContent = bd.toFixed(2);
                  
                  barChart.appendChild(barLabel);
                  barContainer.appendChild(bar);
                  barChart.appendChild(barContainer);
                  barChart.appendChild(barValue);
                  content.appendChild(barChart);
                  
                  // Median Income Bar Chart with Standard Deviation
                  const medInc = feature.graphic.attributes.MEDINC || 0;
                  const medIncStd = feature.graphic.attributes.MEDSTD || 0;
                  const maxMedInc = 100000; // Adjust based on your data range
                  
                  const incomeChart = document.createElement("div");
                  incomeChart.className = "bar-chart";
                  
                  const incomeLabel = document.createElement("div");
                  incomeLabel.className = "field-label";
                  incomeLabel.textContent = "Median Income";
                  
                  const incomeContainer = document.createElement("div");
                  incomeContainer.className = "bar-container";
                  
                  const incomeBar = document.createElement("div");
                  incomeBar.className = "bar";
                  incomeBar.style.width = `${(medInc / maxMedInc) * 100}%`;
                  
                  const stdRange = document.createElement("div");
                  stdRange.className = "std-range";
                  const stdStart = Math.max(0, ((medInc - medIncStd) / maxMedInc) * 100);
                  const stdEnd = Math.min(100, ((medInc + medIncStd) / maxMedInc) * 100);
                  stdRange.style.left = `${stdStart}%`;
                  stdRange.style.width = `${stdEnd - stdStart}%`;
                  
                  const incomeValue = document.createElement("div");
                  incomeValue.className = "bar-value";
                  incomeValue.textContent = `$${medInc.toLocaleString()} ± $${medIncStd.toLocaleString()}`;
                  
                  incomeChart.appendChild(incomeLabel);
                  incomeContainer.appendChild(stdRange);
                  incomeContainer.appendChild(incomeBar);
                  incomeChart.appendChild(incomeContainer);
                  incomeChart.appendChild(incomeValue);
                  content.appendChild(incomeChart);

                  // Median Age Bar Chart with Standard Deviation
                  const medAge = feature.graphic.attributes.MEDAGE || 0;
                  const medAgeStd = feature.graphic.attributes.MEDAGESTD || 0;
                  const maxMedAge = 100; // Adjust based on your data range
                  
                  const ageChart = document.createElement("div");
                  ageChart.className = "bar-chart";
                  
                  const ageLabel = document.createElement("div");
                  ageLabel.className = "field-label";
                  ageLabel.textContent = "Median Age";
                  
                  const ageContainer = document.createElement("div");
                  ageContainer.className = "bar-container";
                  
                  const ageBar = document.createElement("div");
                  ageBar.className = "bar";
                  ageBar.style.width = `${(medAge / maxMedAge) * 100}%`;
                  
                  const ageStdRange = document.createElement("div");
                  ageStdRange.className = "std-range";
                  const ageStdStart = Math.max(0, ((medAge - medAgeStd) / maxMedAge) * 100);
                  const ageStdEnd = Math.min(100, ((medAge + medAgeStd) / maxMedAge) * 100);
                  ageStdRange.style.left = `${ageStdStart}%`;
                  ageStdRange.style.width = `${ageStdEnd - ageStdStart}%`;
                  
                  const ageValue = document.createElement("div");
                  ageValue.className = "bar-value";
                  ageValue.textContent = `${medAge.toFixed(1)} ± ${medAgeStd.toFixed(1)} years`;
                  
                  ageChart.appendChild(ageLabel);
                  ageContainer.appendChild(ageStdRange);
                  ageContainer.appendChild(ageBar);
                  ageChart.appendChild(ageContainer);
                  ageChart.appendChild(ageValue);
                  content.appendChild(ageChart);

                  // Housing Units Stacked Bar Chart
                  const totalHousing = feature.graphic.attributes.THouse || 0;
                  const ownerOccupied = feature.graphic.attributes.OO || 0;
                  const renterOccupied = feature.graphic.attributes.RO || 0;
                  const vacant = feature.graphic.attributes.VH || 0;

                  const housingChart = document.createElement("div");
                  housingChart.className = "bar-chart";
                  
                  const housingLabel = document.createElement("div");
                  housingLabel.className = "field-label";
                  housingLabel.textContent = "Housing Units Distribution";
                  
                  const housingContainer = document.createElement("div");
                  housingContainer.className = "stacked-bar-container";
                  
                  // Calculate percentages
                  const ownerPct = (ownerOccupied / totalHousing) * 100;
                  const renterPct = (renterOccupied / totalHousing) * 100;
                  const vacantPct = (vacant / totalHousing) * 100;
                  
                  // Create stacked bars
                  const ownerBar = document.createElement("div");
                  ownerBar.className = "stacked-bar";
                  ownerBar.style.width = `${ownerPct}%`;
                  ownerBar.style.backgroundColor = "#2ecc71";
                  
                  const renterBar = document.createElement("div");
                  renterBar.className = "stacked-bar";
                  renterBar.style.width = `${renterPct}%`;
                  renterBar.style.backgroundColor = "#3498db";
                  
                  const vacantBar = document.createElement("div");
                  vacantBar.className = "stacked-bar";
                  vacantBar.style.width = `${vacantPct}%`;
                  vacantBar.style.backgroundColor = "#95a5a6";
                  
                  housingContainer.appendChild(ownerBar);
                  housingContainer.appendChild(renterBar);
                  housingContainer.appendChild(vacantBar);
                  
                  // Create legend
                  const legend = document.createElement("div");
                  legend.className = "stacked-bar-legend";
                  
                  const legendItems = [
                    { label: `Owner-Occupied (${ownerOccupied.toLocaleString()})`, color: "#2ecc71" },
                    { label: `Renter-Occupied (${renterOccupied.toLocaleString()})`, color: "#3498db" },
                    { label: `Vacant (${vacant.toLocaleString()})`, color: "#95a5a6" }
                  ];
                  
                  legendItems.forEach(item => {
                    const legendItem = document.createElement("div");
                    legendItem.className = "legend-item";
                    
                    const colorBox = document.createElement("div");
                    colorBox.className = "legend-color";
                    colorBox.style.backgroundColor = item.color;
                    
                    const label = document.createElement("span");
                    label.textContent = item.label;
                    
                    legendItem.appendChild(colorBox);
                    legendItem.appendChild(label);
                    legend.appendChild(legendItem);
                  });
                  
                  housingChart.appendChild(housingLabel);
                  housingChart.appendChild(housingContainer);
                  housingChart.appendChild(legend);
                  content.appendChild(housingChart);

                  // Elevation Chart
                  const elevationChart = document.createElement("div");
                  elevationChart.className = "elevation-chart";
                  
                  // Add title
                  const chartTitle = document.createElement("div");
                  chartTitle.className = "elevation-chart-title";
                  chartTitle.textContent = "Elevation Profile";
                  elevationChart.appendChild(chartTitle);

                  // Create canvas for chart
                  const canvas = document.createElement("canvas");
                  elevationChart.appendChild(canvas);

                  // Add legend
                  const elevLegend = document.createElement("div");
                  elevLegend.className = "elevation-legend";
                  
                  const currentNodeLegend = document.createElement("div");
                  currentNodeLegend.className = "legend-item";
                  const currentDot = document.createElement("div");
                  currentDot.className = "legend-dot";
                  currentDot.style.backgroundColor = "#ff4444";
                  currentNodeLegend.appendChild(currentDot);
                  currentNodeLegend.appendChild(document.createTextNode("Current Node"));
                  
                  const otherNodesLegend = document.createElement("div");
                  otherNodesLegend.className = "legend-item";
                  const otherDot = document.createElement("div");
                  otherDot.className = "legend-dot";
                  otherDot.style.backgroundColor = "#0079c1";
                  otherNodesLegend.appendChild(otherDot);
                  otherNodesLegend.appendChild(document.createTextNode("Other Nodes"));
                  
                  elevLegend.appendChild(currentNodeLegend);
                  elevLegend.appendChild(otherNodesLegend);
                  elevationChart.appendChild(elevLegend);

                  // Query all nodes to get elevations
                  const query = nodesLayer.createQuery();
                  query.where = "1=1";
                  query.outFields = ["Name", "Elevation"];
                  
                  nodesLayer.queryFeatures(query).then(result => {
                    // Create data for the chart using an array
                    const allNodesData = result.features.reduce((acc, f) => {
                      acc[f.attributes.Name] = f.attributes.Elevation;
                      return acc;
                    }, {});
                    
                    const chartData = orderedNodes
                      .filter(name => name in allNodesData)
                      .map(name => ({
                        name: name,
                        elevation: allNodesData[name],
                        isCurrentNode: name === feature.graphic.attributes.Name
                      }));

                    // Get canvas dimensions and set resolution
                    const width = canvas.clientWidth;
                    const height = canvas.clientHeight;
                    
                    // Set canvas resolution
                    canvas.width = width * 2;  // For better resolution on high DPI displays
                    canvas.height = height * 2;
                    const ctx = canvas.getContext("2d");
                    ctx.scale(2, 2);

                    const padding = { 
                      top: 20,
                      right: 40,
                      bottom: 80,  // Increased bottom padding for labels
                      left: 60
                    };
                    
                    // Clear canvas
                    ctx.clearRect(0, 0, width, height);

                    // Calculate scales
                    const minElevation = Math.min(...chartData.map(d => d.elevation));
                    const maxElevation = Math.max(...chartData.map(d => d.elevation));
                    const elevationRange = maxElevation - minElevation;
                    
                    const xScale = (width - padding.left - padding.right) / (chartData.length - 1);
                    const yScale = (height - padding.top - padding.bottom) / elevationRange;

                    // Draw grid lines and labels
                    ctx.strokeStyle = "#ddd";
                    ctx.fillStyle = "#666";
                    ctx.font = "10px Arial";
                    ctx.textAlign = "right";

                    // Horizontal grid lines
                    const gridLines = 5;
                    for (let i = 0; i <= gridLines; i++) {
                      const y = height - padding.bottom - (i * (height - padding.top - padding.bottom) / gridLines);
                      const elevation = minElevation + (i * elevationRange / gridLines);
                      
                      ctx.beginPath();
                      ctx.moveTo(padding.left, y);
                      ctx.lineTo(width - padding.right, y);
                      ctx.stroke();
                      
                      ctx.fillText(Math.round(elevation), padding.left - 5, y + 4);
                    }

                    // Draw line connecting points
                    ctx.beginPath();
                    ctx.strokeStyle = "#0079c1";
                    ctx.lineWidth = 2;
                    
                    chartData.forEach((point, i) => {
                      const x = padding.left + i * xScale;
                      const y = height - padding.bottom - ((point.elevation - minElevation) * yScale);
                      
                      if (i === 0) {
                        ctx.moveTo(x, y);
                      } else {
                        ctx.lineTo(x, y);
                      }
                    });
                    ctx.stroke();

                    // Draw points
                    chartData.forEach((point, i) => {
                      const x = padding.left + i * xScale;
                      const y = height - padding.bottom - ((point.elevation - minElevation) * yScale);
                      
                      ctx.beginPath();
                      ctx.arc(x, y, point.isCurrentNode ? 6 : 4, 0, Math.PI * 2);
                      ctx.fillStyle = point.isCurrentNode ? "#ff4444" : "#0079c1";
                      ctx.fill();
                    });

                    // Draw x-axis labels
                    ctx.fillStyle = "#666";
                    ctx.font = "10px Arial";
                    ctx.textAlign = "right";
                    ctx.textBaseline = "top";
                    
                    chartData.forEach((point, i) => {
                      const x = padding.left + i * xScale;
                      const y = height - padding.bottom + 5;
                      
                      ctx.save();
                      ctx.translate(x, y);
                      ctx.rotate(-Math.PI / 4);
                      ctx.fillText(point.name.replace(/(DM\d+|KY)\s/, "$1\n"), 0, 0);
                      ctx.restore();
                    });
                  });
                  
                  content.appendChild(elevationChart);

                  // Add elevation field
                  const elevField = document.createElement("div");
                  elevField.className = "field-group";
                  elevField.innerHTML = `
                    <span class="field-label">Elevation (ft): </span>
                    <span class="field-value">${feature.graphic.attributes.Elevation}</span>
                  `;
                  content.appendChild(elevField);
                }
                else if (type === "Tank") {
                  const tankFields = [
                    { label: "Elevation (ft)", field: "Elevation" },
                    { label: "Initial Level (ft)", field: "IL" },
                    { label: "Minimum Level (ft)", field: "ML" },
                    { label: "Maximum Level (ft)", field: "MXL" },
                    { label: "Diameter (in)", field: "DIA" },
                    { label: "Mixing Model", field: "MIX" }
                  ];
                  
                  tankFields.forEach(field => {
                    const fieldDiv = document.createElement("div");
                    fieldDiv.className = "field-group";
                    fieldDiv.innerHTML = `
                      <span class="field-label">${field.label}: </span>
                      <span class="field-value">${feature.graphic.attributes[field.field]}</span>
                    `;
                    content.appendChild(fieldDiv);
                  });
                }
                else if (type === "Reservoir") {
                  const thField = document.createElement("div");
                  thField.className = "field-group";
                  thField.innerHTML = `
                    <span class="field-label">Total Head (ft): </span>
                    <span class="field-value">${feature.graphic.attributes.TH}</span>
                  `;
                  content.appendChild(thField);
                }
                
                div.appendChild(header);
                div.appendChild(content);
                return div;
              }
            }
          ]
        };
        // Create the Map with a light basemap
        const map = new Map({
          basemap: "gray-vector",
          ground: "world-elevation"
        });

        // Create the SceneView with enhanced daylight settings
        const view = new SceneView({
          container: "mapDiv",
          map: map,
          camera: {
            position: [-82.5, 37.8, 5000],
            heading: 0,
            tilt: 65
          },
          environment: {
            lighting: {
              date: new Date("2024-01-01T14:00:00"), // Set to 2 PM for good daylight
              directShadowsEnabled: true,
              ambientOcclusionEnabled: true,
              intensity: 1.0
            },
            atmosphere: {
              quality: "high"
            },
            background: {
              type: "color",
              color: [255, 255, 255, 1]
            }
          },
          highlightOptions: {
            color: [255, 241, 58],
            fillOpacity: 0.4
          },
          popup: {
            dockEnabled: true,
            dockOptions: {
              buttonEnabled: false,
              breakpoint: false,
              position: "auto"
            }
          }
        });

        // Create the layers
        const nodesLayer = new FeatureLayer({
          url: "https://services.arcgis.com/vQ8kO5zdqETeirEL/arcgis/rest/services/Martin_County_Viewer/FeatureServer/0",
          title: "Nodes",
          renderer: nodesRenderer,
          elevationInfo: {
            mode: "on-the-ground"
          },
          outFields: ["*"],
          popupTemplate: popupTemplate
        });

        const imageryLayer = new ImageryLayer({
          url: "https://kyraster.ky.gov/arcgis/rest/services/ImageServices/Ky_KYAPED_Phase3_3IN_WGS84WM/ImageServer",
          title: "Imagery"
        });

        const supplementalNodesLayer = new FeatureLayer({
          url: "https://services.arcgis.com/vQ8kO5zdqETeirEL/arcgis/rest/services/Martin_County_Viewer/FeatureServer/1",
          title: "Supplemental Nodes",
          renderer: suppNodesRenderer,
          elevationInfo: {
            mode: "on-the-ground"
          }
        });

        const networkLayer = new FeatureLayer({
          url: "https://services.arcgis.com/vQ8kO5zdqETeirEL/arcgis/rest/services/Martin_County_Viewer/FeatureServer/2",
          title: "Network",
          renderer: networkRenderer
        });

        // Add layers to the map
        map.addMany([imageryLayer, networkLayer, nodesLayer, supplementalNodesLayer]);

        // Add LayerList widget
        const layerList = new LayerList({
          view: view
        });
        view.ui.add(layerList, "top-right");

       

      // Highlight handling
let currentHighlight = null;

// Make highlightNode function globally available
window.highlightNode = function highlightNode(nodeName) {
  const query = nodesLayer.createQuery();
  query.where = `Name='${nodeName}'`;
  query.returnGeometry = true;
  query.outFields = ["*"];
  
  nodesLayer.queryFeatures(query).then(result => {
    if (currentHighlight) {
      currentHighlight.remove();
    }

    if (result.features.length > 0) {
      const feature = result.features[0];
      
      // Highlight the feature
      view.whenLayerView(nodesLayer).then(layerView => {
        currentHighlight = layerView.highlight(feature);
      });

      // Perform zoom animation to feature
      view.goTo({
        target: feature.geometry,
        tilt: 65,
        zoom: 18
      }, {
        duration: 1500,
        easing: "in-out-expo"
      }).then(() => {
        // Manually trigger popup
        view.openPopup({
          features: [feature],
          location: feature.geometry
        });
      });
    }
  });
}
      });
    };
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      document.head.removeChild(style);
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  
  
  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(180deg, #4a5568 0%, #2d3748 100%)',
      padding: '32px',
      borderRadius: '8px',
      marginBottom: '24px',
      border: '4px solid #4a5568'
    }}>
      {/* Monitor Frame */}
      <div style={{
        position: 'relative',
        background: '#000',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 0 0 4px #2d3748, inset 0 0 10px rgba(0,255,0,0.1)'
      }}>
        {/* Screen Content */}
        <div style={{
          position: 'relative',
          background: '#000',
          height: '600px',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          {/* Map Container */}
          <div id="mapDiv" style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 1
          }} />
          
        {/* Toggle Button */}
      <button 
        onClick={() => setIsPanelVisible(!isPanelVisible)}
        style={toggleButtonStyles}
      >
        {isPanelVisible ? '←' : '→'}
      </button>

      {/* Dockable Panel */}
      {isPanelVisible && (
        <div style={dockablePanelStyles}>
          <h2 style={{
            color: '#ef4444',
            fontSize: '18px',
            fontFamily: 'monospace',
            marginBottom: '16px'
          }}>
            Node Controls
          </h2>
          <div style={buttonGridStyles}>
            {controlButtons.map(button => (
              <CustomButton
                key={button.id}
                label={button.label}
                active={activeButton === button.id}
                onClick={() => handleButtonClick(button.id, button.nodeName)}
              />
            ))}
          </div>
        </div>
      )}
          

          {/* Scanlines Effect */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.4) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0.1
          }} />
          
          {/* Monitor Glare */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(0,255,0,0.1), transparent 80%)',
            pointerEvents: 'none',
            zIndex: 2
          }} />
          
          {/* Screen Edge Shadow */}
          <div style={{
            position: 'absolute',
            inset: 0,
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            zIndex: 2
          }} />
        </div>
        
        {/* Monitor Controls */}
        <div style={{
          position: 'absolute',
          bottom: '-25px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '16px',
          zIndex: '10'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#1f2937',
            border: '2px solid #4b5563'
          }} />
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#1f2937',
            border: '2px solid #4b5563'
          }} />
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#1f2937',
            border: '2px solid #4b5563'
          }} />
        </div>
      </div>
    </div>
  );
};

const ElevationMonitor = () => {
  const elevationData = [
    { name: 'Reservoir 1', elevation: 865.0 },
    { name: 'DM1 Inez', elevation: 639.5 },
    { name: 'DM17 West 40', elevation: 665.7 },
    { name: 'DM3 Otto Brown Davella', elevation: 660.0 },
    { name: 'DM2 Coldwater', elevation: 750.5 },
    { name: 'KY 40E Pump', elevation: 679.9 },
    { name: 'DM11 2032', elevation: 715.5 },
    { name: 'DM17 Meat House', elevation: 966.2 },
    { name: 'Buck Creek Tank', elevation: 1006.1 },
    { name: 'DM7 Hode', elevation: 789.7 },
    { name: 'DM6 Buck Creek', elevation: 744.0 },
    { name: 'Kermit', elevation: 661.4 },
    { name: 'DM9 Pit/Lovely', elevation: 621.7 },
    { name: 'DM8 292 South', elevation: 677.0 },
    { name: 'DM10 Long Branch', elevation: 648.7 }
  ];

  const [hoveredNode, setHoveredNode] = useState(null);
  
  // Calculate dimensions and scales
const margin = { top: 40, right: 60, bottom: 125, left: 60 }; // Increased bottom margin
  const width = window.innerWidth - 215 - margin.left - margin.right; // Dynamic width based on window
  const height = 300 - margin.top - margin.bottom;
  
  const minElevation = Math.min(...elevationData.map(d => d.elevation));
  const maxElevation = Math.max(...elevationData.map(d => d.elevation));
  const elevationRange = maxElevation - minElevation;

  // Create point coordinates
  const points = elevationData.map((d, i) => ({
    x: (i * width) / (elevationData.length - 1) + margin.left,
    y: height - ((d.elevation - minElevation) / elevationRange) * height + margin.top,
    ...d
  }));

  // Create path string for line
  const linePath = points.map((p, i) => 
    (i === 0 ? 'M' : 'L') + `${p.x},${p.y}`
  ).join(' ');

  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(180deg, #4a5568 0%, #2d3748 100%)',
      padding: '32px',
      borderRadius: '8px',
      marginTop: '24px',
      border: '4px solid #4a5568'
    }}>
      <div style={{
        position: 'relative',
        background: '#000',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 0 0 4px #2d3748, inset 0 0 10px rgba(0,255,0,0.1)'
      }}>
        <div style={{
          position: 'relative',
          background: '#000',
          height: '400px',
          borderRadius: '4px',
          overflow: 'hidden',
          padding: '20px'
        }}>
          <h2 style={{
            color: '#22c55e',
            fontSize: '18px',
            fontFamily: 'monospace',
            marginBottom: '16px',
            textShadow: '0 0 10px rgba(34,197,94,0.5)'
          }}>
            ELEVATION PROFILE
          </h2>

          <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
            {/* Grid lines */}
            {Array.from({ length: 6 }, (_, i) => {
              const y = height - (i * height / 5) + margin.top;
              const elevation = minElevation + (i * elevationRange / 5);
              return (
                <g key={i}>
                  <line
                    x1={margin.left}
                    y1={y}
                    x2={width + margin.left}
                    y2={y}
                    stroke="#22c55e"
                    strokeOpacity="0.2"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={margin.left - 10}
                    y={y}
                    fill="#22c55e"
                    fontSize="12"
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontFamily="monospace"
                  >
                    {Math.round(elevation)}
                  </text>
                </g>
              );
            })}

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              filter="url(#glow)"
            />

            {/* Points */}
        {points.map((point, i) => (
  <g key={i}>
    <circle
      cx={point.x}
      cy={point.y}
      r={hoveredNode === point.name ? 6 : 4}
      fill={hoveredNode === point.name ? '#fff' : '#22c55e'}
      stroke="#22c55e"
      strokeWidth="2"
      filter="url(#glow)"
      onMouseEnter={() => setHoveredNode(point.name)}
      onMouseLeave={() => setHoveredNode(null)}
      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
    />
    <text
      x={point.x}
      y={height + margin.top + 80}  // Increased from 40 to 80
      fill="#22c55e"
      fontSize="10"
      textAnchor="middle"
      transform={`rotate(45, ${point.x}, ${height + margin.top + 80})`}  // Updated rotation point to match new y-position
      fontFamily="monospace"
      opacity={hoveredNode === point.name ? 1 : 0.7}
    >
      {point.name}
    </text>
    {hoveredNode === point.name && (
      <text
        x={point.x}
        y={point.y - 15}
        fill="#22c55e"
        fontSize="12"
        textAnchor="middle"
        fontFamily="monospace"
      >
        {point.elevation.toFixed(1)} ft
      </text>
    )}
  </g>
))}
            {/* Filter for glow effect */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Scanlines Effect */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.4) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0.1
          }} />
          
          {/* Monitor Glare */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.1), transparent 80%)',
            pointerEvents: 'none',
            zIndex: 2
          }} />
        </div>
        
        {/* Monitor Controls */}
        <div style={{
          position: 'absolute',
          bottom: '-25px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '16px',
          zIndex: '10'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#1f2937',
            border: '2px solid #4b5563'
          }} />
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#1f2937',
            border: '2px solid #4b5563'
          }} />
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#1f2937',
            border: '2px solid #4b5563'
          }} />
        </div>
      </div>
    </div>
  );
};

const WaterDashboard = () => {
  
  
const [isPanelVisible, setIsPanelVisible] = useState(true);


const dockablePanelStyles = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '300px', // Adjust width as needed
  maxHeight: '100%',
  background: 'rgba(26, 32, 44, 0.95)',
  borderRight: '1px solid #4a5568',
  padding: '16px',
  zIndex: 3,
  overflowY: 'auto'
};


const buttonGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '8px',
  padding: '8px'
};


const toggleButtonStyles = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  zIndex: 4,
  background: '#4a5568',
  border: 'none',
  borderRadius: '4px',
  padding: '8px',
  color: 'white',
  cursor: 'pointer'
};


const customButtonStyles = {
  WebkitAppearance: 'none',
  appearance: 'none',
  position: 'relative',
  borderWidth: 0,
  padding: '4px',
  width: '100%',
  boxSizing: 'border-box',
  background: 'transparent',
  cursor: 'pointer'
};
  
  const [activeButton, setActiveButton] = useState(null);
  
  const handleButtonClick = (buttonId, nodeName) => {
    // Update active button state
    setActiveButton(buttonId === activeButton ? null : buttonId);
    
    // Trigger map navigation
    if (window.highlightNode) {
      window.highlightNode(nodeName);
    }
  };


  const controlButtons = [
    { id: 'treatment', label: 'Water Treatment Plant', nodeName: 'Wastewater Treatment Plant' },
    { id: 'west40', label: 'DM17 West 40', nodeName: 'DM17 West 40' },
    { id: 'inez', label: 'DM1 Inez', nodeName: 'DM1 Inez' },
    { id: 'otto', label: 'DM3 Otto Brown', nodeName: 'DM3 Otto Brown Davella' },
    { id: 'coldwater', label: 'DM2 Coldwater', nodeName: 'DM2 Coldwater' },
    { id: 'ky40', label: 'KY 40E Pump', nodeName: 'KY 40E Pump' },
    { id: 'dm11', label: 'DM11 2032', nodeName: 'DM11 2032' },
    { id: 'meathouse', label: 'DM17 Meat House', nodeName: 'DM17 Meat House' },
    { id: 'buckcreek', label: 'Buck Creek Tank', nodeName: 'Buck Creek Tank' },
    { id: 'hode', label: 'DM7 Hode', nodeName: 'DM7 Hode' },
    { id: 'dm6', label: 'DM6 Buck Creek', nodeName: 'DM6 Buck Creek' },
    { id: 'kermit', label: 'Kermit', nodeName: 'Kermit' },
    { id: 'lovely', label: 'DM9 Pitt/Lovely', nodeName: 'DM9 Pit/Lovely' },
    { id: 'south', label: 'DM8 292 South', nodeName: 'DM8 292 South' },
    { id: 'longbranch', label: 'DM10 Long Branch', nodeName: 'DM10 Long Branch' }
  ];
  
 return (
   <div style={{ 
     minHeight: '100vh',
     background: '#2c3338',
     padding: '20px'
   }}>
      <MonitorPanel 
      controlButtons={controlButtons}
      activeButton={activeButton}
      handleButtonClick={handleButtonClick}
    />
     
     
     <style>
       {`
         body {
           margin: 0;
           padding: 0;
           background: #2c3338;
         }
         @keyframes pulse {
           0%, 100% { opacity: 1; }
           50% { opacity: 0.5; }
         }
       `}
     </style>
    

     <div style={{ 
       background: 'linear-gradient(180deg, #4a5568 0%, #2d3748 100%)',
       padding: '32px',
       borderRadius: '8px',
       border: '2px solid #4a5568',
       boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
     }}>
       <div style={{ 
         background: '#1a202c',
         padding: '16px',
         borderRadius: '4px'
       }}>
         <svg 
           viewBox="0 0 2000 500" 
           style={{ width: '100%', height: '100%' }}
           preserveAspectRatio="xMidYMid meet"
         >
           <defs>
             <linearGradient id="metallic-bezel" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stopColor="#777" />
               <stop offset="50%" stopColor="#CCC" />
               <stop offset="100%" stopColor="#444" />
             </linearGradient>
             
             <radialGradient id="led-on-blue">
               <stop offset="0%" stopColor="#00BFFF" />
               <stop offset="90%" stopColor="#1E90FF" />
               <stop offset="100%" stopColor="#4169E1" />
             </radialGradient>
             
             <radialGradient id="led-on-green">
               <stop offset="0%" stopColor="#5f5" />
               <stop offset="90%" stopColor="#0f0" />
               <stop offset="100%" stopColor="#070" />
             </radialGradient>
             
             <radialGradient id="led-off">
               <stop offset="0%" stopColor="#666" />
               <stop offset="90%" stopColor="#444" />
               <stop offset="100%" stopColor="#222" />
             </radialGradient>
             
             <filter id="glow">
               <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
               <feMerge>
                 <feMergeNode in="coloredBlur"/>
                 <feMergeNode in="SourceGraphic"/>
               </feMerge>
             </filter>
           </defs>

           {/* Main horizontal line */}
           <path 
             d="M 100 200 H 1900" 
             stroke="#444" 
             strokeWidth="3"
             fill="none"
           />

           {/* Vertical connections */}
           <path 
             d="M 250 80 V 200 M 500 200 V 350 M 650 200 V 350 M 900 200 V 350 M 1100 80 V 200 M 1250 200 V 350" 
             stroke="#444" 
             strokeWidth="3"
             fill="none"
           />

           {/* Water Treatment Plant */}
           <g transform="translate(220, 20)">
             <text 
               x="30" 
               y="-10" 
               textAnchor="middle"
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               Water Treatment Plant
             </text>
             <circle 
               cx="30"
               cy="30"
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               cx="30"
               cy="30"
               r="20" 
               fill="url(#led-off)"
               filter="url(#glow)"
             />
             <circle 
               id="treatment-light"
               cx="30"
               cy="30"
               r="20" 
               fill="url(#led-on-blue)"
               filter="url(#glow)"
               opacity="1"
             >
               <animate
                 attributeName="opacity"
                 values="1;0;1"
                 dur="1.5s"
                 repeatCount="indefinite"
               />
             </circle>
           </g>
           
           {/* DM17 West 40 */}
           <g transform="translate(100, 200)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
             <text 
               y="50" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               DM17 West 40
             </text>
             <text 
               y="70" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               J-1-38
             </text>
           </g>

           {/* DM1 Inez */}
           <g transform="translate(250, 200)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
             <text 
               y="50" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               DM1 Inez
             </text>
             <text 
               y="70" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               INEZ
             </text>
             <text 
               y="90" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               J-1-37
             </text>
           </g>

           {/* Unlabeled Node (above DM3) */}
           <g transform="translate(500, 200)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
           </g>

           {/* DM3 Otto Brown */}
           <g transform="translate(500, 350)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
             <text 
               y="50" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               DM3 Otto Brown
             </text>
             <text 
               y="70" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               DAVELLA
             </text>
             <text 
               y="90" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               J-1-58
             </text>
           </g>

           {/* Unlabeled Node (above DM2) */}
           <g transform="translate(650, 200)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
           </g>

           {/* DM2 Coldwater */}
           <g transform="translate(650, 350)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
             <text 
               y="50" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               DM2 Coldwater
             </text>
             <text 
               y="70" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               J-5-15
             </text>
           </g>

           {/* KY 40E Pump */}
           <g transform="translate(800, 200)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-off)"
               filter="url(#glow)"
             />
             <text 
               y="50" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               KY 40E Pump
             </text>
             <text 
               y="70" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               J-5-12
             </text>
           </g>

           {/* DM11 2032 */}
           <g transform="translate(900, 200)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
             <text 
               y="-50" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               DM11 2032
             </text>
             <text 
               y="-30" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               J-5-12
             </text>
           </g>

           {/* DM17 Meat House */}
           <g transform="translate(900, 350)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
             <text 
               y="50" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               DM17 Meat House
             </text>
             <text 
               y="70" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               J-5-13
             </text>
           </g>

           {/* Buck Creek Tank */}
           <g transform="translate(1070, 20)">
             <text 
               x="30" 
               y="-10" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               Buck Creek Tank
             </text>
             <circle 
               cx="30"
               cy="30"
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               cx="30"
               cy="30"
               r="20" 
               fill="url(#led-on-blue)"
               filter="url(#glow)"
             />
           </g>

           {/* Unlabeled Node (below Buck Creek Tank) */}
           <g transform="translate(1100, 200)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
           </g>

           {/* DM7 Hode */}
           <g transform="translate(1250, 200)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
             <text 
               y="-50" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               DM7 Hode
             </text>
             <text 
               y="-30" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               J-6
             </text>
           </g>

           {/* DM6 Buck Creek */}
           <g transform="translate(1250, 350)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
             <text 
               y="50" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               DM6 Buck Creek
             </text>
             <text 
               y="70" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               J-6-65
             </text>
           </g>

           {/* Kermit */}
           <g transform="translate(1400, 200)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
             <text 
               y="50" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               Kermit
             </text>
             <text 
               y="70" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               KERMIT
             </text>
           </g>

           {/* DM9 Pitt/Lovely */}
           <g transform="translate(1550, 200)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
             <text 
               y="50" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               DM9 Pitt/Lovely
             </text>
             <text 
               y="70" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               LOVELY
             </text>
             <text 
               y="90" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               J-9-5
             </text>
           </g>

           {/* DM8 292 South */}
           <g transform="translate(1700, 200)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
             <text 
               y="50" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               DM8 292 South
             </text>
             <text 
               y="70" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               J-8-8
             </text>
           </g>

           {/* DM10 Long Branch */}
           <g transform="translate(1900, 200)">
             <circle 
               r="25" 
               fill="url(#metallic-bezel)"
               style={{ cursor: 'pointer' }}
             />
             <circle 
               r="20" 
               fill="url(#led-on-green)"
               filter="url(#glow)"
             />
             <text 
               y="50" 
               textAnchor="middle" 
               style={{ fill: '#9ca3af', fontSize: '0.875rem' }}
             >
               DM10 Long Branch
             </text>
             <text 
               y="70" 
               textAnchor="middle" 
               style={{ fill: '#ef4444', fontSize: '0.875rem' }}
             >
               J-10-3
             </text>
          </g>

         </svg>
       </div>
     </div>

    {/* Add the Elevation Monitor component here */}
    <ElevationMonitor />

   </div>
 );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<WaterDashboard />);
