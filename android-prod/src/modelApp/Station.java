package modelApp;



public abstract class Station 
{
	private double longitude, latitude;
	private String name;
	
	public Station()
	{
		longitude=0;
		latitude=0;
		name=null;
		
	}
	
	public String getName()
	{
		return name;
	}
	
	public double getLong()
	{
		return longitude;
	}
	
	public double getLat()
	{
		return latitude;
	}
	
	public void setInfos(String nameStation, double lng, double lat)
	{
		longitude=lng;
		latitude=lat;
		name=nameStation;
		        
	}
	 

}
