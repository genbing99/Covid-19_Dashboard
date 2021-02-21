//Statistics Overview
var statistics_svg = d3.select("#statistics")
  .append("svg")
  .attr('width', 350)
  .attr('height', 150);

//Confirmed Cases
x = 35
y = 25
confirmed_cases = statistics_svg.append('text')
  .attr('x', x)
  .attr('y', y)

confirmed_cases.append('tspan')
  .text('Confirmed Cases')
  .attr('x', x)
  .attr('font-size', 16)

confirmed_cases_cum = confirmed_cases.append('tspan')
  .text('0')
  .attr('x', x)
  .attr('dy', 30)
  .attr('dx', 5)
  .attr('font-size', 20)

confirmed_cases_add = confirmed_cases.append('tspan')
  .text('0')
  .attr('x', x)
  .attr('dx', 100)
  .attr('dy', 12)
  .attr('font-size', 10)
  .attr('fill', 'red')

//Vaccinated
x = 190
y = 25
vaccination = statistics_svg.append('text')
  .attr('x', x)
  .attr('y', y)

vaccination.append('tspan')
  .text('Vaccination')
  .attr('x', x+15)
  .attr('font-size', 16)

vaccination_cum = vaccination.append('tspan')
  .text('0')
  .attr('x', x+10)
  .attr('dy', 30)
  .attr('dx', 0)
  .attr('font-size', 20)

vaccination_add = vaccination.append('tspan')
  .text('0')
  .attr('x', x)
  .attr('dx', 85)
  .attr('dy', 12)
  .attr('font-size', 10)
  .attr('fill', 'red')

// Deaths
x = 35
y = 100
deaths = statistics_svg.append('text')
  .attr('x', x)
  .attr('y', y)

deaths.append('tspan')
  .text('Deaths')
  .attr('x', x+35)
  .attr('font-size', 16)

deaths_cum = deaths.append('tspan')
  .text('0')
  .attr('x', x)
  .attr('dy', 30)
  .attr('dx', 20)
  .attr('font-size', 20)
  
deaths_add = deaths.append('tspan')
  .text('0')
  .attr('x', x)
  .attr('dx', 85)
  .attr('dy', 12)
  .attr('font-size', 10)
  .attr('fill', 'red')

//Reproduction Rate
x = 220
y = 100
r0 = statistics_svg.append('text')
  .attr('x', x)
  .attr('y', y)

r0.append('tspan')
  .text('R₀')
  .attr('x', x+20)
  .attr('font-size', 16)

r0_curr = r0.append('tspan')
  .text('0')
  .attr("text-anchor", "middle")
  .attr('x', x)
  .attr('dy', 30)
  .attr('dx', 25)
  .attr('font-size', 20)

// Update function
function update_statistics(data, date, country_id){
  set_all_zero = true
  if(data[country_id]){ //Check if country id exist
    $.each(data[country_id].data, function(k,v){
      if(v.date == date){
        set_all_zero=false
        v.total_cases!=undefined  ? confirmed_cases_cum.text(v.total_cases.toLocaleString()) : confirmed_cases_cum.text('0')
        v.new_cases!=undefined  ? confirmed_cases_add.text('+' + v.new_cases.toLocaleString()) : confirmed_cases_add.text('+0')
        v.total_deaths!=undefined  ? deaths_cum.text(v.total_deaths.toLocaleString()) : deaths_cum.text(0)
        v.new_deaths!=undefined  ? deaths_add.text('+' + v.new_deaths.toLocaleString()) : deaths_add.text('+0')
        v.people_vaccinated!=undefined  ? vaccination_cum.text(v.people_vaccinated.toLocaleString()) : vaccination_cum.text('0') 
        v.new_vaccinations!=undefined  ? vaccination_add.text('+' + v.new_vaccinations.toLocaleString()) : vaccination_add.text('+0')
        v.reproduction_rate!=undefined ?  r0_curr.text(v.reproduction_rate) : r0_curr.text('0')
      }
    })
  }
  if(set_all_zero){
    confirmed_cases_cum.text('0')
    confirmed_cases_add.text('+0')
    deaths_cum.text(0)
    deaths_add.text('+0')
    vaccination_cum.text('0') 
    vaccination_add.text('+0')
    r0_curr.text('0')
  }
}
