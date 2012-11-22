package com.android_prod;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class FirstView extends Activity {
	
	 protected int _ScreenTime = 10000;

	 /** Called when the activity is first created. */
	 @Override
	 public void onCreate(Bundle savedInstanceState) {
	     super.onCreate(savedInstanceState);
	     setContentView(R.layout.activity_first_view);
	     // thread for displaying the SplashScreen
	     Thread splashTread = new Thread() {
	 
	         public void run() {
	             
	             
	                finish();

	                Intent BMA =new Intent(getApplicationContext(),com.android_prod.MapView.class );
	                 startActivity(BMA);
	             
	         }
	     };
	     splashTread.start();
	 }
	
}
