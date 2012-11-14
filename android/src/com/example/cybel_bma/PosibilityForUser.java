package com.example.cybel_bma;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;
import android.widget.Toast;

public class PosibilityForUser extends Activity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_posibility_for_user);
//        
//        String dep =savedInstanceState.getParcelable("adDep");
//        String arr =savedInstanceState.getParcelable("adArr");
        
     
        
        
        
      //First Extract the bundle from intent
        Bundle bundle = getIntent().getExtras();
        //Next extract the values using the key as
        String dep = bundle.getString("adDep");
        String arr = bundle.getString("adArr");
        
        Toast affiche=Toast.makeText(getApplicationContext(),"address de depart   "+dep+"   adress d'arrive"+arr , Toast.LENGTH_LONG);
         affiche.show();
        
    }

   
}
