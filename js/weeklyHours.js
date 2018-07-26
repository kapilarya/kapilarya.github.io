d3.csv("./data/HoursWorked.csv")
  .row(function(d){ return { industry: d.Industry, Male: Number(d.Male), Female: Number(d.Female), diffMale: d.MaleDiff, diffFemale: d.FemaleDiff} ;})
  .get(function(error,data){
    
    var margin = {left: 200 , right: 50 , top: 40 , bottom:0 };
    //console.log(data);
    var width = 500;
    var height = 300;

    var sex = "Male";

    var refGender = {Male : "Female", Female: "Male"};

    var diffGender = {Male: "diffMale", Female: "diffFemale"};


    var textGender = {Male: "Males on an average work 42.5 hrs/week.<br> This is about 16% higher than females ", 
                      Female: "Females on an average work 36.8 hrs/week.<br> This is about 13% lower than males "};
    var maxHour = d3.max(data, function(d){return Math.max(d.Male,d.Female);});

    //console.log(maxHour);

    var indLabel = ['Arts & Entertain' , 'Construction' , 'Educational Services' , 'Finance & Insurance' , 'Medical Services' 
                    , 'Manufacturing' , 'Professional & Tech Services' , 'Public Administration' , 'Retail & Wholesale' , 'Other'];

    var y = d3.scaleLinear()
              .domain([0,maxHour])
              .range([height,0]);

    var x = d3.scaleBand()
              .domain(indLabel)
              .range([0,width])
              .paddingInner(0.75);

    var yAxis = d3.axisLeft(y);
    var xAxis = d3.axisBottom(x);

    var tooltip = d3.select("body").append("div").attr("class","tooltip").style("opacity","0").style("position","absolute");
    var annText1 = d3.select("body").append("div").attr("class","label").style("opacity","1").style("position","absolute")
                     .style("left",width*1.5+ "px").style("top",height+"px").style("font-weight","bold").style("font-size","18px");
    
    var svg = d3.select("body").append("svg").attr("height","100%").attr("width","100%");

    var chartGroup = svg.append("g")
                        .attr("transform","translate("+margin.left + "," + margin.top +")");

    chartGroup.selectAll("rect")
                .data(data)
                .enter().append("rect")
      //                  .transition()
      //                  .duration(500)
                        .attr("x", function(d,i){return x(d.industry);})
                        .attr("y", function(d,i){return y(d[sex]);})
                        .attr("height", function(d,i){return height - y(d[sex]);})
                        .attr("width", function(d,i){return 20;})
                        .on("mouseover", function(d){
                            tooltip.transition()
                                   .duration(200)
                                   .style("opacity",0.9)
                                   .style("left", (d3.event.pageX) + "px")
                                   .style("top",(d3.event.pageY) + "px");
                            tooltip.html("Hours: " + d[sex].toFixed(1) + "<br>" + "Difference w.r.t " + refGender[sex] + " : " + d[diffGender[sex]] );})
                        .on("mouseout",function(d){
                            tooltip.transition()
                                   .duration(500)
                                   .style("opacity",0);});

    chartGroup.append("g").attr("class","x axis")
                          .call(xAxis)
                          .attr("transform","translate(0,"+height + ")")
                          .selectAll("text")
                          .attr("transform","rotate(-60)")
                          .style("text-anchor","end");

    chartGroup.append("g").attr("class","y axis")
                          .call(yAxis);
    chartGroup.append("text")
              .attr("class","axis-label")
              .attr("transform","rotate(-90)")
              .attr("y", 0 - margin.left/2.5)
              .attr("x", 0 - (height/2))
              .attr("dy", "1.6em")
              .style("text-anchor","middle")
              .text("Hours Worked per Week");
    annText1.html(textGender[sex]);
//    chartGroup.append("text")
//              .attr("class","label")
//              .attr("x", width*1.1)
//              .attr("y", height*0.5)
//              .style( "font-size", "18px")
//              .style("font-weight","bold")
//              .text(textGender[sex]);

    d3.selectAll("input").on("change", change);

    var timeout = setTimeout(function() {
      d3.select("input[value=\"Female\"]").property("checked", true).each(change);
    }, 3000);

    function change() {
      clearTimeout(timeout);

      sex = this.value;

      // First transition the line & label to the new city.
      var t0 = chartGroup.transition().duration(1000);

      t0.selectAll("rect")
              .attr("x", function(d,i){return x(d.industry);})
              .attr("y", function(d,i){return y(d[sex]);})
              .attr("height", function(d,i){return height - y(d[sex]);})
              .attr("width", function(d,i){return 20;});   
      //t0.selectAll(".label").text(textGender[sex]);
      
      annText1.style("opacity",0)
              .html(textGender[sex])
              .transition()
              .delay(1000)
              .style("opacity",1);

    }

  });