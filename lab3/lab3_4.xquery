(: 4 :)
<result>{
let $doc := doc("mondial.xml")/mondial
let $list := for $continent in distinct-values($doc/country/encompassed/@continent)
return concat(sum(
  for $country in $doc/country,
      $growth_rate in $country/population_growth,
      $population in $country/population[@year = max($country/population/@year)]
  where $country/encompassed/@continent = $continent
  return ($population * math:pow($growth_rate div 100 + 1, 50)) div $population
)," (",$continent,")")

return (max($list), min($list))
}</result>