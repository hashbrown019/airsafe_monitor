const charts = {};
  let currentDateIndex = 0;

  function create_chart(dataString) {
    // Check for "_sensor_" marker
    if (!dataString.includes("_sensor_")) {
      console.log("No sensor marker found, ignoring:", dataString);
      return;
    }

    currentDateIndex++;

    // Remove the "_sensor_" prefix before parsing
    const cleanString = dataString.replace("_sensor_,", "");

    // Parse input like "arg1=10,arg2=12,arg3=20"
    const entries = cleanString.split(",").map(item => {
      const [arg, val] = item.split("=");
      return { arg: arg.trim(), val: parseInt(val.trim(), 10) };
    });

    const activeArgs = entries.map(e => e.arg);

    // Update or create charts for each entry
    entries.forEach(({ arg, val }) => {
      if (!charts[arg]) {
        const container = document.createElement("div");
        container.className = "chart-container";
        const canvas = document.createElement("canvas");
        container.appendChild(canvas);
        document.getElementById("charts").appendChild(container);

        charts[arg] = new Chart(canvas.getContext("2d"), {
          type: "line",
          data: {
            labels: [],
            datasets: [{
              label: arg,
              data: [],
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { title: { display: true, text: "Date Index" } },
              y: { beginAtZero: true }
            }
          }
        });
      }

      charts[arg].data.labels.push(currentDateIndex);
      charts[arg].data.datasets[0].data.push(val);
      charts[arg].update();
    });

    // For charts not in current data, append zero
    Object.keys(charts).forEach(arg => {
      if (!activeArgs.includes(arg)) {
        charts[arg].data.labels.push(currentDateIndex);
        charts[arg].data.datasets[0].data.push(0);
        charts[arg].update();
      }
    });
  }


  function sample_data(){
    create_chart("_sensor_,arg1=10,arg2=10");          // proceeds
    setTimeout(() => create_chart("_sensor_,arg1=15,arg2=12,arg3=20"), 2000); // proceeds
    setTimeout(() => create_chart("arg1=18,arg3=25"), 4000); // ignored (no _sensor_)
    create_chart("arg1=10,arg2=10");
    setTimeout(() => create_chart("arg1=15,arg2=12,arg3=20"), 2000);
    setTimeout(() => create_chart("arg1=18,arg3=25"), 4000);
  }
  
