1.
select name from country where code not in (select country
from geo_island);

2.
select

--Välj delmängd
(1.0 * (SELECT DISTINCT count(province) from not in geo_sea) as foo)

/

--Välj hela mängden
(SELECT COUNT(name) from province as foo2)

as ratio;

3.

with island_name (name)
as
(
        select island
        from islandin
        where lake is not null
),

island_area (name, area)
as
(
        select name, area
        from island
        where name in (select * from island_name)
),

island_country (name, country)
as
(
        select island, country
        from geo_island
        where island in (select * from island_name)
),

continent_percentage (continent, percentage)
as
(
        select continent, percentage
        from encompasses
        where country in (select country from island_country)
)


inner join continent_percentage on island_country.country=continent_percentage.country;
