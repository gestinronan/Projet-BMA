package com.example.cybel_bma;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;

public class StartScreen extends Activity {

 protected int _ScreenTime = 3000;

 /** Called when the activity is first created. */
 @Override
 public void onCreate(Bundle savedInstanceState) {
     super.onCreate(savedInstanceState);
     setContentView(R.layout.startscreen);
     // thread for displaying the SplashScreen
     Thread splashTread = new Thread() {
 
         public void run() {
             
             
                finish();

                Intent BMA =new Intent(getApplicationContext(),com.example.cybel_bma.FirstUserView.class );
                 startActivity(BMA);
             
         }
     };
     splashTread.start();
 }
     
}
