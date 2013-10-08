/*
 * Copyright (C) 2010 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.android.tictactoe;

import java.util.Random;

import io.adrenaline.AdrenalineIo;
import io.adrenaline.ApiResponse;
import io.adrenaline.User;
import android.app.Activity;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.example.android.tictactoe.library.GameActivity;
import com.example.android.tictactoe.library.GameView.State;

public class MainActivity extends Activity {
	TextView status;
	class SignUp extends AsyncTask<String, Object, ApiResponse> {

		@Override
		protected ApiResponse doInBackground(String... arg0) {
			ApiResponse response = User.signUp(arg0[0], arg0[1]);
			return response;
		}
		
		@Override
		protected void onPostExecute(ApiResponse response) {
			findViewById(R.id.button1).setEnabled(true);
			if (!response.returnStatusOk) {
            	status.setText("could not sign up: " + response.returnStatus);
            } else {
            	startGame(true);
            }
		}
		
	}
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        AdrenalineIo.APP_ID = "1015fd078bb8dd285d96e38160e6e884ea21d563";
        AdrenalineIo.APP_TOKEN = "ewSZ8Dil4zxmjknc_nb00-sK0hC5JaGK";
        AdrenalineIo.BASE_URL = "https://adrenaline-io.appspot.com/";
        AdrenalineIo.init();
        
        status = (TextView) findViewById(R.id.status_string);
        findViewById(R.id.button1).setOnClickListener(
                new OnClickListener() {
            public void onClick(View v) {
                status.setText("Signing up...");
                String username = "android-" + new Random().nextInt();
                String password = "woof";
                v.setEnabled(false);
                new SignUp().execute(username, password);
            }
        });

        /*
        findViewById(R.id.start_comp).setOnClickListener(
                new OnClickListener() {
            public void onClick(View v) {
                startGame(false);
            }
        });
        */
    }

    private void startGame(boolean startWithHuman) {
        Intent i = new Intent(this, GameActivity.class);
        i.putExtra(GameActivity.EXTRA_START_PLAYER,
                startWithHuman ? State.PLAYER1.getValue() : State.PLAYER2.getValue());
        startActivity(i);
    }
}