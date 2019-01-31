4.
--Select countrycode | growth | population | futurepop | continent | percentage
with table1 (code, growth, population, futurepop, continent, percentage)
as
(
        select code, ((population_growth / 100)+1)^50, population*(percentage/100), population*(percentage/100)*((population_growth / 100)+1)^50, continent, percentage
        from country inner join population on country.code = population.country inner join encompasses on population.country = encompasses.country
),

continent_table (continent, population, futurepop, ratio)
as
(
        select continent, sum(population), sum(futurepop), sum(futurepop)/sum(population)
        from table1
        group by continent
        order by sum(futurepop)/sum(population)
)

select continent, ratio
  from continent_table
  where ratio = (select max(ratio) from continent_table) or
        ratio = (select min(ratio) from continent_table)
  order by ratio desc;

5.
with european_countries (code, continent)
as
(
        select country, continent
        from encompasses
        where continent like 'Europe'
),
international_superstar_organization_deluxe (abbreviation, name, city, country, province, established)
as
(
        select abbreviation, name, city, country, province, established
        from organization
        where name like '%International%'
),
members (countrycode, orgcode)
as
(
        select country, organization
        from ismember
        where country in (select country from european_countries)
)
select international_superstar_organization_deluxe.name, count(members.orgcode) as members
  from international_superstar_organization_deluxe, members
  where members.orgcode = international_superstar_organization_deluxe.abbreviation
  group by international_superstar_organization_deluxe.name
  order by members desc
  limit 1;

8.
-- Filter out the cities pop > 5 000 000
With contenders (city, latitude, longitude)
as
(
        select name, latitude, longitude
        from city
        where population > 5000000
),

-- Generate each permutation of city pairs
pairs (city1, lat1, long1, city2, lat2, long2)
as
(
        select first.city, first.latitude, first.longitude,
        second.city, second.latitude, second.longitude
        from contenders as first
          join contenders as second
          on not first.city = second.city

),

-- Calculate distance using Haversine formula (andrew.hedges.name/experiments/haversine/)
-- Distance in km and Earth's radius = 6371 km
lines (city1, city2, distance)
as
(
        select city1, city2,
        (6371 * 2 * atan(
                        sqrt(
                          (  sin(radians((lat2-lat1))/2)  )^2 +
                          cos(radians(lat1)) * cos(radians(lat2)) *
                          (  sin(radians((long2-long1)/2))  )^2
                            )
                        /
                        sqrt(
                          1-(sin(radians((lat2-lat1))/2))^2 +
                          cos(radians(lat1)) * cos(radians(lat2)) * (sin(radians((long2-long1)/2)))^2
                            )
                        )
        ) as distance
        from pairs
),
-- Get longest distance
longest_line (city1, city2, distance)
as
(
        select city1, city2, distance
        from lines
        where distance = (select max(distance) from lines)
),
-- Prepare a list of connections going in/out of the first and second city
lines2 (city1, city2, distance)
as
(
        select lines.city1, lines.city2, lines.distance
        from lines join longest_line on
          not longest_line.city2 = lines.city2 and not longest_line.city2 = lines.city1
          and lines.city2 = longest_line.city1
),
-- Now sum each city in lines2's two distances.
third_cities (city, total_distance)
as
(
        select lines2.city1, sum(distance)
        from lines2
        group by lines2.city1
)
select longest_line.city1 as city1, longest_line.city2 as city2,
       third_cities.city as city3,
       (longest_line.distance + third_cities.total_distance) as total_distance
  from longest_line join third_cities on
       third_cities.total_distance = (select max(total_distance) from third_cities);
