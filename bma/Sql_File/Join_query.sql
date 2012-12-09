SELECT BusStops.*, BusTrips.*, BusRoutes.*, BusStop_Times.*
FROM BusStops AS busStops, BusTrips AS busTrips, BusStop_times As busStop_Times, BusRoutes AS busRoutes
WHERE busStops.Stop_id = busStop_times.Stop_id
AND busStop_Times.Trip_id = busTrips.Trip_id
AND busTrips.Route_id = busRoutes.Route_id;






