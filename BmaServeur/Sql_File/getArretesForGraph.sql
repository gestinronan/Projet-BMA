SELECT BusTrips.Trip_id, BusStops.Stop_id, BusStop_times.*
FROM BusStops, BusTrips, BusStop_times
WHERE BusTrips.Trip_id = '"100"'
AND BusTrips.Trip_id = BusStop_times.Trip_id
AND BusStop_times.Stop_id = BusStops.Stop_id
ORDER BY BusStop_times.Stop_sequence ASC;
