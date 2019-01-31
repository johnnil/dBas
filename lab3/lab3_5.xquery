(: 5 :)
let $doc := doc("mondial.xml")/mondial
let $eu := $doc/country where $doc/country/encompassed/@continent = "europe"
let $high := max(
        for $org in $doc/organization
        where contains($org/name, 'International') and
              $org/@headq = (
                              for $airport in $doc/airport,
                                  $country in $doc/country
                              where $airport/@country = $country/@car_code
                              return $airport/@city
                            )
        return (
          count(tokenize(string-join(
            $org/members/@country
            ,' '), '\s+')))
)

return (
  for $org in $doc/organization
        where contains($org/name, 'International') and
              $org/@headq = (
                              for $airport in $doc/airport,
                                  $country in $doc/country
                              where $airport/@country = $country/@car_code
                              return $airport/@city
                            ) and count(tokenize(string-join($org/members/@country,' '), ' ')) = $high
        return ($org/name)
)
