(: 3 :)
<result>
{let $doc := doc("mondial.xml")/mondial
for $continent in distinct-values($doc/country/encompassed/@continent)
return 
<item>
{concat($continent, ": ", string(sum(
  for $country in $doc/country,
      $lake in $doc//lake
  where $country/encompassed/@continent = $continent and
        $lake/@id = $doc//island/@lake and $lake/@country = $country/@car_code
  return $lake/area * number($country/encompassed[@continent = $continent]/@percentage) div 100
)))}
</item>}
</result>