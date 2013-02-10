SELECT BusTrips.Trip_id, BusStop_times.*, BusStops.Stop_id
FROM BusStops as busstops, BusTrips as bustrips, BusStop_times as busstop_times
WHERE bustrips.Trip_id = '"100"'
AND bustrips.Trip_id = busstop_times.Trip_id
AND busstop_times.Stop_id = busstops.Stop_id
ORDER BY busStop_times.Stop_sequence ASC;
