<music>{

let $doc := doc("songs.xml")/music

(:Invert song:)
let $songs := (for $song in $doc/song
let $name := $song/name
let $nr := $song/nr
return <song name='{data($name)}' nr='{data($nr)}'>
        <genre>{data($song/@genre)}</genre>
        <album>{data($song/@album)}</album>
        <artist>{data($song/@artist)}</artist>
        <id>{data($song/@id)}</id>
       </song>)

(:Invert artist:)
let $artists :=for $artist in $doc/artist
let $name := $artist
return <artist value='{string(data($name))}'>
        <id>{data($artist/@id)}</id>
        <isband>{data($artist/@isband)}</isband>
       </artist>

(:Invert album:)
let $albums :=for $album in $doc/album
let $name := $album
let $perf := 
    if (exists($album/@performers))
    then <performers>{data($album/@performers)}</performers>
    else ()
return <album value='{string(data($name))}'>
        <issued>{data($album/@issued)}</issued>
        <id>{data($album/@id)}</id>
        <label>{data($album/@label)}</label>
        {$perf}
       </album>

return ($songs, $artists, $albums)
}</music>