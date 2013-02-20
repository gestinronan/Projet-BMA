package working;

import java.util.ArrayList;

import org.osmdroid.bonuspack.routing.Road;
import org.osmdroid.util.GeoPoint;

import com.android_prod.MapViewClass;

import android.os.AsyncTask;
import android.util.Log;

/**
 * appel asychrone de mise en place de l'itnineraire
 * @author ronan
 *
 */
public class RoadGetter  extends AsyncTask{


	@Override
	protected Object doInBackground(Object... params) {
		
		Log.i("AsychTask", "IAM IN");
		@SuppressWarnings("unchecked")
		Road road1 = MapViewClass.roadManager.getRoad((ArrayList<GeoPoint>)  params[0]);
		// TODO Auto-generated method stub
		return road1;
	}

}
