(: 8 :)
let $doc := doc("mondial.xml")/mondial
let $contenders := $doc/country/city[population[last()] > 5000000]
let $lines := (
    for $first in $contenders,
        $second in $contenders
    let $lat1 := $first/latitude
    let $long1 := $first/longitude
    let $lat2 := $second/latitude
    let $long2 := $second/longitude
    where $first != $second
    let $distance :=
                     (6371 * 2 * math:atan(
                            math:sqrt(
                              math:pow((  math:sin((($lat2 - $lat1)* (math:pi() div 180)) div 2)  ), 2) +
                              math:cos(($lat1)* (math:pi() div 180)) * math:cos(($lat2)* (math:pi() div 180)) *
                              math:pow((  math:sin((($long2 - $long1) div 2)* (math:pi() div 180))  ), 2)
                                )
                            div
                            math:sqrt(
                              1-math:pow((math:sin((($lat2 - $lat1)* (math:pi() div 180)) div 2)), 2) +
                              math:cos(($lat1)* (math:pi() div 180)) * math:cos(($lat2)* (math:pi() div 180)) * math:pow((math:sin((($long2 - $long1) div 2)* (math:pi() div 180))), 2)
                                )
                            )
            )

    return <item>
            <first>{$first}</first>
            <second>{$second}</second>
            <distance>{$distance}</distance>
           </item>

              )
(:Will return two duplicates C1 -> C2 and C2 -> C1. Only one is needed:)
let $longest_line := $lines[distance = max($lines/distance)][1]
let $lines2 := (
              for $third in $lines/first
              where $third != $longest_line/first and $third != $longest_line/second
              let $first := $longest_line/first
              let $second := $longest_line/second
              let $total_length :=
              (:first -> second:)    (for $line in $lines[first = $first and second = $second] return $line/distance) +
              (:second -> third:)    (for $line in $lines[first = $second and second = $third] return $line/distance) +
              (:third -> first:)     (for $line in $lines[first = $third and second = $first] return $line/distance)
              return <item>
                          <first>{$first}</first>
                          <second>{$second}</second>
                          <third>{$third}</third>
                          <distance>{$total_length}</distance>
                     </item>
               )

let $triangle := for $triple in $lines2
                 where $triple/distance = max (for $triple in $lines2 return $triple/distance)
                 return $triple

return $triangle[1]
